import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Em producao nada de fallback: um JWT_SECRET conhecido publicamente permitiria
 * forjar sessao de qualquer usuario. Local continua com o segredo de dev.
 */
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : "local-secret");
if (!JWT_SECRET) {
  console.error("JWT_SECRET obrigatorio em producao. Abortando.");
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL || "postgres://trampo:trampo_local_dev@localhost:55433/trampo";
// Neon/Render exigem TLS; o Postgres do docker-compose local nao tem certificado.
const isRemoteDb = !/localhost|127\.0\.0\.1|@postgres[:/]/.test(DATABASE_URL);

/**
 * Por padrao o driver devolve numeric/decimal como string, para nao perder
 * precisao em valores grandes. Aqui todo numeric e' dinheiro em reais, bem
 * dentro do alcance seguro de um double -- e o cliente espera numero: um
 * balance "500" quebrava .toFixed() e derrubava a tela inteira.
 */
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));

const { Pool } = pg;
const pool = new Pool({
  connectionString: DATABASE_URL,
  ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {}),
});

const app = express();

/**
 * Origens liberadas. Requisicoes sem Origin (app nativo, curl, health check do
 * Render) passam; browser so passa se estiver na lista.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!isProduction || allowedOrigins.length === 0) return callback(null, true);
      callback(null, allowedOrigins.includes(origin.replace(/\/$/, "")));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

const tables = new Set(["users", "user_roles", "companies", "freelancers", "jobs", "applications", "conversations", "messages", "payments", "escrow", "reviews", "public_profiles", "contracts", "checkins"]);

/**
 * Politica por tabela para o CRUD generico /api/data/:table.
 *   insert/update: false -> bloqueado para o cliente
 *   adminOnly            -> exige papel admin
 *   columns              -> unicas colunas que o cliente pode alterar
 */
const policies = {
  users: { insert: false, update: { adminOnly: true, columns: ["blocked"] } },
  user_roles: { insert: false, update: false },
  public_profiles: { insert: false, update: false },
};

// Colunas que nunca saem da API, independente do select.
const hiddenColumns = { users: ["password_hash"] };

const IDENT = /^[a-z_][a-z0-9_]*$/;
const id = () => crypto.randomUUID();
const tokenFor = (user) => jwt.sign({ sub: user.auth_id, userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

const publicUser = (user) => {
  const { password_hash: _ignored, ...rest } = user;
  return rest;
};

const sanitize = (table, rows) => {
  const hidden = hiddenColumns[table];
  if (!hidden || !Array.isArray(rows)) return rows;
  return rows.map((row) => {
    const copy = { ...row };
    for (const column of hidden) delete copy[column];
    return copy;
  });
};

const userFrom = async (req) => {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!raw) return null;
  try {
    const data = jwt.verify(raw, JWT_SECRET);
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [data.userId]);
    return rows[0] || null;
  } catch {
    return null;
  }
};

const isAdmin = async (user) => {
  if (!user) return false;
  if (user.type === "admin") return true;
  const { rows } = await pool.query("SELECT role FROM user_roles WHERE user_id = $1", [user.id]);
  return rows[0]?.role === "admin";
};

app.get("/api/health", (_req, res) => res.json({ ok: true, database: "postgresql" }));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name, user_type = "empresa" } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    if (String(password).length < 6) return res.status(400).json({ error: "A senha precisa ter ao menos 6 caracteres" });
    // Papel privilegiado nunca vem do cliente.
    const type = user_type === "admin" ? "empresa" : user_type;
    const passwordHash = await bcrypt.hash(password, 10);
    const authId = id();
    const { rows } = await pool.query("INSERT INTO users (auth_id,name,email,type,password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *", [authId, name, email.toLowerCase(), type, passwordHash]);
    const user = rows[0];
    await pool.query("INSERT INTO public_profiles (user_id,name,type) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [user.id, name, type]);
    res.json({ user: { id: user.auth_id, email: user.email, user_metadata: { name, user_type: type } }, session: { access_token: tokenFor(user), user: { id: user.auth_id, email: user.email } } });
  } catch (e) { res.status(400).json({ error: e.code === "23505" ? "Email já cadastrado" : e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [String(email || "").toLowerCase()]);
  const user = rows[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(password || "", user.password_hash))) return res.status(401).json({ error: "Email ou senha inválidos" });
  if (user.blocked) return res.status(403).json({ error: "Conta bloqueada" });
  res.json({ user: { id: user.auth_id, email: user.email, user_metadata: { name: user.name, user_type: user.type } }, session: { access_token: tokenFor(user), user: { id: user.auth_id, email: user.email } } });
});

app.get("/api/me", async (req, res) => { const user = await userFrom(req); if (!user) return res.status(401).json({ error: "Não autenticado" }); res.json({ user: publicUser(user) }); });

const hydrate = async (table, rows, select) => {
  if (table === "jobs" && select?.includes("companies")) for (const row of rows) { const r = await pool.query("SELECT name FROM companies WHERE id=$1", [row.company_id]); row.companies = r.rows[0] || null; }
  if (table === "applications" && select?.includes("jobs")) for (const row of rows) { const r = await pool.query("SELECT * FROM jobs WHERE id=$1", [row.job_id]); row.jobs = r.rows[0] || null; }
  // A empresa precisa saber quem se candidatou: applications.freelancer_id
  // aponta para freelancers.id, entao o nome vem por join em duas etapas.
  if (table === "applications" && select?.includes("freelancers")) for (const row of rows) {
    const r = await pool.query(
      "SELECT f.id, f.category, u.name, u.email FROM freelancers f JOIN users u ON u.id = f.user_id WHERE f.id = $1",
      [row.freelancer_id],
    );
    row.freelancers = r.rows[0] || null;
  }
  if (table === "freelancers" && select?.includes("users")) for (const row of rows) { const r = await pool.query("SELECT name,email FROM users WHERE id=$1", [row.user_id]); row.users = r.rows[0] || null; }
  /**
   * Em escrow o cliente pede o nome pela chave estrangeira que interessa a ele:
   * o painel da empresa quer o profissional, o do prestador quer o contratante.
   * Antes o servidor resolvia sempre o profissional, entao o prestador via o
   * proprio nome no rotulo "Contratante".
   *
   * Alem disso company_id e freelancer_id apontam para companies.id e
   * freelancers.id, nao para users.id -- dai o join em duas etapas.
   */
  if (table === "escrow" && select?.includes("users")) {
    const querContratante = /company/i.test(select);
    for (const row of rows) {
      const r = querContratante
        ? await pool.query("SELECT u.name, u.email FROM companies c JOIN users u ON u.id = c.user_id WHERE c.id = $1", [row.company_id])
        : await pool.query("SELECT u.name, u.email FROM freelancers f JOIN users u ON u.id = f.user_id WHERE f.id = $1", [row.freelancer_id]);
      row.users = r.rows[0] || null;
    }
  }
  return rows;
};

/* -------------------------------------------------------------------------
 * Contratacao
 *
 * Da candidatura ao trabalho em execucao. Sao varias tabelas por operacao
 * (application, contract, escrow, job, checkin) e a autorizacao depende de
 * quem e' o dono da vaga, coisas que o CRUD generico de /api/data nao tem
 * como garantir -- por isso vivem aqui, em transacao.
 * ---------------------------------------------------------------------- */

/**
 * A empresa aceita um candidato: fecha a vaga, recusa os demais, cria o
 * contrato e retem o valor em custodia.
 */
app.post("/api/contracts/accept-application", async (req, res) => {
  const user = await userFrom(req);
  if (!user) return res.status(401).json({ error: "Não autenticado" });

  const applicationId = req.body?.application_id;
  if (!applicationId) return res.status(400).json({ error: "application_id obrigatório" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT a.id, a.status, a.freelancer_id, j.id AS job_id, j.title, j.price, j.date,
              c.id AS company_id, c.user_id AS company_user_id
         FROM applications a
         JOIN jobs j ON j.id = a.job_id
         JOIN companies c ON c.id = j.company_id
        WHERE a.id = $1
        FOR UPDATE OF a`,
      [applicationId],
    );
    const candidatura = rows[0];
    if (!candidatura) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Candidatura não encontrada" }); }
    if (candidatura.company_user_id !== user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Apenas a empresa dona da vaga pode aceitar" });
    }

    // Ja existe contrato para esta vaga? Entao alguem ja foi aceito.
    const { rows: jaTem } = await client.query("SELECT id FROM contracts WHERE job_id = $1", [candidatura.job_id]);
    if (jaTem.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Esta vaga já tem um profissional contratado" });
    }

    await client.query("UPDATE applications SET status = 'accepted' WHERE id = $1", [applicationId]);
    await client.query("UPDATE applications SET status = 'rejected' WHERE job_id = $1 AND id <> $2", [candidatura.job_id, applicationId]);
    await client.query("UPDATE jobs SET status = 'filled' WHERE id = $1", [candidatura.job_id]);

    const valor = Number(candidatura.price || 0);
    const { rows: contratos } = await client.query(
      `INSERT INTO contracts (job_id, company_id, freelancer_id, amount, freelancer_amount, start_at, description, status)
       VALUES ($1,$2,$3,$4,$4,$5,$6,'FUNDS_SECURED') RETURNING *`,
      [candidatura.job_id, candidatura.company_id, candidatura.freelancer_id, valor, candidatura.date, candidatura.title],
    );
    await client.query(
      "INSERT INTO escrow (job_id, company_id, freelancer_id, amount, status, service) VALUES ($1,$2,$3,$4,'held',$5)",
      [candidatura.job_id, candidatura.company_id, candidatura.freelancer_id, valor, candidatura.title],
    );

    await client.query("COMMIT");
    res.json({ contract: contratos[0] });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: isProduction ? "Falha ao aceitar a candidatura" : e.message });
  } finally {
    client.release();
  }
});

/**
 * Check-in do profissional no local: registra a presenca e coloca o contrato
 * em execucao. E' o que faz o trabalho aparecer como "Em andamento" dos dois
 * lados.
 */
app.post("/api/contracts/check-in", async (req, res) => {
  const user = await userFrom(req);
  if (!user) return res.status(401).json({ error: "Não autenticado" });

  const contractId = req.body?.contract_id;
  if (!contractId) return res.status(400).json({ error: "contract_id obrigatório" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT ct.id, ct.status, ct.freelancer_id, f.user_id AS freelancer_user_id
         FROM contracts ct
         JOIN freelancers f ON f.id = ct.freelancer_id
        WHERE ct.id = $1
        FOR UPDATE OF ct`,
      [contractId],
    );
    const contrato = rows[0];
    if (!contrato) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Contrato não encontrado" }); }
    if (contrato.freelancer_user_id !== user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Apenas o profissional contratado pode fazer check-in" });
    }

    await client.query(
      `INSERT INTO checkins (contract_id, freelancer_id, method, status)
       VALUES ($1,$2,$3,'CONFIRMED')
       ON CONFLICT (contract_id, freelancer_id) DO NOTHING`,
      [contrato.id, contrato.freelancer_id, req.body?.method || "PIN"],
    );
    const { rows: atualizados } = await client.query(
      "UPDATE contracts SET status = 'IN_PROGRESS' WHERE id = $1 RETURNING *",
      [contrato.id],
    );

    await client.query("COMMIT");
    res.json({ contract: atualizados[0] });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: isProduction ? "Falha ao registrar o check-in" : e.message });
  } finally {
    client.release();
  }
});

/**
 * A empresa confirma a conclusao: libera a custodia e encerra o contrato.
 */
app.post("/api/contracts/complete", async (req, res) => {
  const user = await userFrom(req);
  if (!user) return res.status(401).json({ error: "Não autenticado" });

  const contractId = req.body?.contract_id;
  if (!contractId) return res.status(400).json({ error: "contract_id obrigatório" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT ct.id, ct.job_id, ct.amount, ct.freelancer_id, c.user_id AS company_user_id, f.user_id AS freelancer_user_id
         FROM contracts ct
         JOIN companies c ON c.id = ct.company_id
         JOIN freelancers f ON f.id = ct.freelancer_id
        WHERE ct.id = $1
        FOR UPDATE OF ct`,
      [contractId],
    );
    const contrato = rows[0];
    if (!contrato) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Contrato não encontrado" }); }
    if (contrato.company_user_id !== user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Apenas a empresa contratante pode concluir" });
    }

    await client.query("UPDATE contracts SET status = 'RELEASED', end_at = now() WHERE id = $1", [contrato.id]);
    await client.query("UPDATE escrow SET status = 'released' WHERE job_id = $1", [contrato.job_id]);
    await client.query("UPDATE jobs SET status = 'completed' WHERE id = $1", [contrato.job_id]);
    // O valor cai no saldo do profissional (movimentacao simulada, sem PSP).
    await client.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [Number(contrato.amount || 0), contrato.freelancer_user_id]);
    await client.query(
      "INSERT INTO payments (user_id, amount, status, service) VALUES ($1,$2,'paid_mock','contract_release')",
      [contrato.freelancer_user_id, Number(contrato.amount || 0)],
    );

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: isProduction ? "Falha ao concluir o contrato" : e.message });
  } finally {
    client.release();
  }
});

/* -------------------------------------------------------------------------
 * Pagamentos simulados
 *
 * Nesta versao nao ha integracao financeira real: nenhum valor transita, nada
 * e' cobrado. O saldo e' um numero na tabela users movido por estes endpoints.
 * Eles existem no servidor (e nao no cliente) porque o cliente nao pode ter
 * permissao de escrever no proprio saldo -- seria a mesma coisa que credito
 * infinito. Trocar por um PSP real significa substituir estas rotas.
 * ---------------------------------------------------------------------- */

const MOCK_TOPUP_MAX = 1000;

app.post("/api/mock/wallet/topup", async (req, res) => {
  const user = await userFrom(req);
  if (!user) return res.status(401).json({ error: "Não autenticado" });
  const amount = Number(req.body?.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > MOCK_TOPUP_MAX) {
    return res.status(400).json({ error: `Valor deve estar entre R$ 0,01 e R$ ${MOCK_TOPUP_MAX}` });
  }
  const { rows } = await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance", [amount, user.id]);
  await pool.query("INSERT INTO payments (user_id, amount, status, service) VALUES ($1,$2,$3,$4)", [user.id, amount, "paid_mock", "wallet_topup"]);
  res.json({ balance: Number(rows[0].balance), mock: true });
});

app.post("/api/mock/chat-unlock", async (req, res) => {
  const user = await userFrom(req);
  if (!user) return res.status(401).json({ error: "Não autenticado" });

  const conversationId = req.body?.conversation_id;
  if (!conversationId) return res.status(400).json({ error: "conversation_id obrigatório" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: convRows } = await client.query("SELECT * FROM conversations WHERE id = $1 FOR UPDATE", [conversationId]);
    const conversation = convRows[0];
    if (!conversation) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Conversa não encontrada" }); }
    if (conversation.company_user_id !== user.id) { await client.query("ROLLBACK"); return res.status(403).json({ error: "Somente a empresa desbloqueia a conversa" }); }
    if (conversation.unlocked) { await client.query("ROLLBACK"); return res.json({ conversation, balance: Number(user.balance), mock: true }); }

    const price = Number(conversation.unlock_price ?? 4.9);
    const { rows: balanceRows } = await client.query("SELECT balance FROM users WHERE id = $1 FOR UPDATE", [user.id]);
    const balance = Number(balanceRows[0].balance);
    if (balance < price) { await client.query("ROLLBACK"); return res.status(402).json({ error: "Saldo insuficiente", balance, price }); }

    const { rows: debited } = await client.query("UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance", [price, user.id]);
    const { rows: unlocked } = await client.query("UPDATE conversations SET unlocked = true WHERE id = $1 RETURNING *", [conversationId]);
    await client.query("INSERT INTO payments (user_id, amount, status, service) VALUES ($1,$2,$3,$4)", [user.id, price, "paid_mock", "chat_unlock"]);
    await client.query("COMMIT");

    res.json({ conversation: unlocked[0], balance: Number(debited[0].balance), mock: true });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: isProduction ? "Falha ao processar" : e.message });
  } finally {
    client.release();
  }
});

/**
 * Colunas reais de cada tabela, lidas uma vez e mantidas em memoria.
 *
 * Serve para nao ordenar por uma coluna que nao existe: public_profiles e
 * user_roles nao tem created_at, e o ORDER BY padrao fazia toda consulta a
 * essas duas tabelas falhar com 42703 -- era por isso que o nome do outro
 * participante da conversa aparecia como "Usuario" e o papel de admin nunca
 * era reconhecido.
 */
const columnCache = new Map();
const columnsOf = async (table) => {
  if (!columnCache.has(table)) {
    const { rows } = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1",
      [table],
    );
    columnCache.set(table, new Set(rows.map((r) => r.column_name)));
  }
  return columnCache.get(table);
};

/**
 * Extrai os filtros ?eq.<coluna>=<valor> validando o nome da coluna. Sem essa
 * validacao o nome cairia interpolado direto no SQL.
 */
const parseFilters = (query) =>
  Object.entries(query)
    .filter(([k]) => k.startsWith("eq."))
    .map(([k, v]) => [k.slice(3), v])
    .filter(([column]) => IDENT.test(column));

app.all("/api/data/:table", async (req, res) => {
  const { table } = req.params;
  if (!tables.has(table)) return res.status(404).json({ error: "Tabela não encontrada" });

  const user = await userFrom(req);
  if (!user) return res.status(401).json({ data: null, error: { message: "Não autenticado" } });
  if (user.blocked) return res.status(403).json({ data: null, error: { message: "Conta bloqueada" } });

  const policy = policies[table] || {};

  try {
    if (req.method === "POST") {
      if (policy.insert === false) return res.status(403).json({ data: null, error: { message: "Escrita não permitida nesta tabela" } });
      const payload = Array.isArray(req.body) ? req.body : [req.body];
      const cols = Object.keys(payload[0] || {}).filter((c) => IDENT.test(c));
      if (!cols.length) return res.status(400).json({ data: null, error: { message: "Nenhuma coluna válida" } });
      const values = []; const placeholders = payload.map((row, i) => `(${cols.map((c, j) => { values.push(row[c] ?? null); return `$${i * cols.length + j + 1}`; }).join(",")})`).join(",");
      const result = await pool.query(`INSERT INTO ${table} (${cols.join(",")}) VALUES ${placeholders} RETURNING *`, values);
      return res.json({ data: sanitize(table, await hydrate(table, result.rows, req.query.select)), error: null });
    }

    if (req.method === "PATCH") {
      const rule = policy.update;
      if (rule === false) return res.status(403).json({ data: null, error: { message: "Atualização não permitida nesta tabela" } });
      if (rule?.adminOnly && !(await isAdmin(user))) return res.status(403).json({ data: null, error: { message: "Apenas administradores" } });

      const filters = parseFilters(req.query);
      // UPDATE sem WHERE reescreveria a tabela inteira.
      if (!filters.length) return res.status(400).json({ data: null, error: { message: "Filtro obrigatório para atualizar" } });

      const updates = Object.entries(req.body || {})
        .filter(([k]) => IDENT.test(k))
        .filter(([k]) => !rule?.columns || rule.columns.includes(k));
      if (!updates.length) return res.status(400).json({ data: null, error: { message: "Nenhuma coluna válida para atualizar" } });

      const values = updates.map(([, v]) => v);
      const set = updates.map(([k], i) => `${k}=$${i + 1}`).join(",");
      const where = filters.map(([column], i) => `${column}=$${updates.length + i + 1}`).join(" AND ");
      const result = await pool.query(`UPDATE ${table} SET ${set} WHERE ${where} RETURNING *`, [...values, ...filters.map(([, v]) => v)]);
      return res.json({ data: sanitize(table, result.rows), error: null });
    }

    const filters = parseFilters(req.query);
    const values = filters.map(([, v]) => v);
    const where = filters.length ? `WHERE ${filters.map(([column], i) => `${column}=$${i + 1}`).join(" AND ")}` : "";
    const columns = await columnsOf(table);
    const orderColumn = String(req.query.order || "").split(".")[0];
    const order = IDENT.test(orderColumn) && columns.has(orderColumn)
      ? `ORDER BY ${orderColumn} ${String(req.query.order).includes("ascending=false") ? "DESC" : "ASC"}`
      : columns.has("created_at")
        ? "ORDER BY created_at DESC"
        : "";
    const pedido = Number(req.query.limit);
    const limit = Number.isInteger(pedido) && pedido > 0 ? ` LIMIT ${Math.min(pedido, 500)}` : "";
    const result = await pool.query(`SELECT * FROM ${table} ${where} ${order}${limit}`, values);
    res.json({ data: sanitize(table, await hydrate(table, result.rows, req.query.select)), error: null });
  } catch (e) {
    res.status(400).json({ data: null, error: { message: isProduction ? "Falha ao consultar dados" : e.message, code: e.code } });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Trampo API em http://localhost:${port} (${isProduction ? "producao" : "local"})`));
