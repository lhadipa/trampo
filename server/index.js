import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://trampo:trampo_local_dev@localhost:55433/trampo" });
const app = express();
app.use(cors());
app.use(express.json());

const tables = new Set(["users", "user_roles", "companies", "freelancers", "jobs", "applications", "conversations", "messages", "payments", "escrow", "reviews", "public_profiles", "contracts", "checkins"]);
const id = () => crypto.randomUUID();
const tokenFor = (user) => jwt.sign({ sub: user.auth_id, userId: user.id }, process.env.JWT_SECRET || "local-secret");
const userFrom = async (req) => {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!raw) return null;
  try { const data = jwt.verify(raw, process.env.JWT_SECRET || "local-secret"); const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [data.userId]); return rows[0] || null; } catch { return null; }
};

app.get("/api/health", (_req, res) => res.json({ ok: true, database: "postgresql" }));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name, user_type = "empresa" } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    const passwordHash = await bcrypt.hash(password, 10);
    const authId = id();
    const { rows } = await pool.query("INSERT INTO users (auth_id,name,email,type,password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *", [authId, name, email.toLowerCase(), user_type, passwordHash]);
    const user = rows[0];
    await pool.query("INSERT INTO public_profiles (user_id,name,type) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [user.id, name, user_type]);
    res.json({ user: { id: user.auth_id, email: user.email, user_metadata: { name, user_type } }, session: { access_token: tokenFor(user), user: { id: user.auth_id, email: user.email } } });
  } catch (e) { res.status(400).json({ error: e.code === "23505" ? "Email já cadastrado" : e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [String(email || "").toLowerCase()]);
  const user = rows[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(password || "", user.password_hash))) return res.status(401).json({ error: "Email ou senha inválidos" });
  res.json({ user: { id: user.auth_id, email: user.email, user_metadata: { name: user.name, user_type: user.type } }, session: { access_token: tokenFor(user), user: { id: user.auth_id, email: user.email } } });
});

app.get("/api/me", async (req, res) => { const user = await userFrom(req); if (!user) return res.status(401).json({ error: "Não autenticado" }); res.json({ user }); });

const hydrate = async (table, rows, select) => {
  if (table === "jobs" && select?.includes("companies")) for (const row of rows) { const r = await pool.query("SELECT name FROM companies WHERE id=$1", [row.company_id]); row.companies = r.rows[0] || null; }
  if (table === "applications" && select?.includes("jobs")) for (const row of rows) { const r = await pool.query("SELECT * FROM jobs WHERE id=$1", [row.job_id]); row.jobs = r.rows[0] || null; }
  if ((table === "freelancers" || table === "escrow") && select?.includes("users")) for (const row of rows) { const uid = table === "escrow" ? row.freelancer_id : row.user_id; const r = await pool.query("SELECT name,email FROM users WHERE id=$1", [uid]); row.users = r.rows[0] || null; }
  return rows;
};

app.all("/api/data/:table", async (req, res) => {
  const { table } = req.params;
  if (!tables.has(table)) return res.status(404).json({ error: "Tabela não encontrada" });
  try {
    if (req.method === "POST") {
      const payload = Array.isArray(req.body) ? req.body : [req.body];
      const cols = Object.keys(payload[0] || {}).filter((c) => /^[a-z_]+$/.test(c));
      const values = []; const placeholders = payload.map((row, i) => `(${cols.map((c, j) => { values.push(row[c] ?? null); return `$${i * cols.length + j + 1}`; }).join(",")})`).join(",");
      const result = await pool.query(`INSERT INTO ${table} (${cols.join(",")}) VALUES ${placeholders} RETURNING *`, values);
      return res.json({ data: await hydrate(table, result.rows, req.query.select), error: null });
    }
    if (req.method === "PATCH") {
      const filters = Object.entries(req.query).filter(([k]) => k.startsWith("eq."));
      const updates = Object.entries(req.body).filter(([k]) => /^[a-z_]+$/.test(k));
      const values = updates.map(([, v]) => v); const set = updates.map(([k], i) => `${k}=$${i + 1}`).join(",");
      const where = filters.map(([k, v], i) => `${k.slice(3)}=$${updates.length + i + 1}`).join(" AND ");
      const result = await pool.query(`UPDATE ${table} SET ${set} WHERE ${where} RETURNING *`, [...values, ...filters.map(([, v]) => v)]);
      return res.json({ data: result.rows, error: null });
    }
    const filters = Object.entries(req.query).filter(([k]) => k.startsWith("eq."));
    const values = filters.map(([, v]) => v); const where = filters.length ? `WHERE ${filters.map(([k], i) => `${k.slice(3)}=$${i + 1}`).join(" AND ")}` : "";
    const order = req.query.order ? `ORDER BY ${String(req.query.order).split(".")[0]} ${String(req.query.order).includes("ascending=false") ? "DESC" : "ASC"}` : "ORDER BY created_at DESC";
    const result = await pool.query(`SELECT * FROM ${table} ${where} ${order}`, values);
    res.json({ data: await hydrate(table, result.rows, req.query.select), error: null });
  } catch (e) { res.status(400).json({ data: null, error: { message: e.message, code: e.code } }); }
});

app.listen(process.env.PORT || 3001, () => console.log("Trampo API local em http://localhost:" + (process.env.PORT || 3001)));
