/**
 * Popula o banco com dados de demonstracao (empresa, freelancers, vagas,
 * conversa e custodia) para a apresentacao ao cliente.
 *
 * Uso:
 *   DATABASE_URL="postgres://..." node server/seed.js
 *
 * E' idempotente: roda quantas vezes quiser sem duplicar nada.
 */
import pg from "pg";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://trampo:trampo_local_dev@localhost:55433/trampo";
const isRemoteDb = !/localhost|127\.0\.0\.1|@postgres[:/]/.test(DATABASE_URL);

const { Pool } = pg;
const pool = new Pool({
  connectionString: DATABASE_URL,
  ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {}),
});

const PASSWORD = process.env.SEED_PASSWORD || "trampo123";

const people = [
  { email: "empresa@trampo.app", name: "Restaurante & Hotel Fazenda Solar", type: "empresa", balance: 500 },
  { email: "pintor@trampo.app", name: "Carlos Eduardo", type: "freelancer", category: "Pintura", balance: 0 },
  { email: "piscineiro@trampo.app", name: "Rodrigo Alves", type: "freelancer", category: "Manutenção de piscinas", balance: 0 },
  { email: "garcom@trampo.app", name: "Juliana Ferreira", type: "freelancer", category: "Garçom / Garçonete", balance: 0 },
  { email: "admin@trampo.app", name: "Administração Trampô", type: "admin", balance: 0 },
];

const jobs = [
  { title: "Pintura de fachada", description: "Fachada do restaurante, 2 dias de serviço. Material por conta da empresa.", price: 180, category: "Pintura", location: "Centro, São João del-Rei", urgent: false, days: 1 },
  { title: "Garçom para evento de sábado", description: "Evento para 120 pessoas, das 18h às 00h. Experiência em eventos.", price: 220, category: "Garçom / Garçonete", location: "Fazenda Solar, SJDR", urgent: true, days: 3 },
  { title: "Limpeza de piscina semanal", description: "Manutenção quinzenal da piscina do hotel.", price: 150, category: "Manutenção de piscinas", location: "Fazenda Solar, SJDR", urgent: false, days: 5 },
];

const run = async () => {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const users = {};

  for (const person of people) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, type, password_hash, balance)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, balance = EXCLUDED.balance
       RETURNING *`,
      [person.name, person.email, person.type, passwordHash, person.balance],
    );
    const user = rows[0];
    users[person.email] = user;

    await pool.query("INSERT INTO public_profiles (user_id,name,type) VALUES ($1,$2,$3) ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name", [user.id, person.name, person.type]);

    if (person.type === "admin") {
      await pool.query("INSERT INTO user_roles (user_id, role) VALUES ($1,'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin'", [user.id]);
    }
    if (person.type === "empresa") {
      const { rows: companyRows } = await pool.query(
        "INSERT INTO companies (user_id, name) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name RETURNING *",
        [user.id, person.name],
      );
      user.company = companyRows[0];
    }
    if (person.type === "freelancer") {
      const { rows: freelancerRows } = await pool.query(
        "INSERT INTO freelancers (user_id, category) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET category = EXCLUDED.category RETURNING *",
        [user.id, person.category],
      );
      user.freelancer = freelancerRows[0];
    }
  }

  const company = users["empresa@trampo.app"].company;
  const day = 24 * 60 * 60 * 1000;

  for (const job of jobs) {
    const { rowCount } = await pool.query("SELECT 1 FROM jobs WHERE company_id = $1 AND title = $2", [company.id, job.title]);
    if (rowCount) continue;
    await pool.query(
      "INSERT INTO jobs (company_id,title,description,date,price,category,location,urgent,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'open')",
      [company.id, job.title, job.description, new Date(Date.now() + job.days * day), job.price, job.category, job.location, job.urgent],
    );
  }

  // Conversa bloqueada, para demonstrar o fluxo de desbloqueio pago (simulado).
  await pool.query(
    "INSERT INTO conversations (company_user_id, freelancer_user_id, unlock_price, unlocked) VALUES ($1,$2,4.90,false) ON CONFLICT (company_user_id, freelancer_user_id) DO NOTHING",
    [users["empresa@trampo.app"].id, users["pintor@trampo.app"].id],
  );

  // Custodia em aberto, para a aba "Custódia" do painel da empresa.
  const { rows: jobRows } = await pool.query("SELECT id FROM jobs WHERE company_id = $1 ORDER BY created_at LIMIT 1", [company.id]);
  if (jobRows[0]) {
    const { rowCount } = await pool.query("SELECT 1 FROM escrow WHERE job_id = $1", [jobRows[0].id]);
    if (!rowCount) {
      await pool.query(
        "INSERT INTO escrow (job_id, company_id, freelancer_id, amount, status, service) VALUES ($1,$2,$3,180,'held','Pintura de fachada')",
        [jobRows[0].id, company.id, users["pintor@trampo.app"].freelancer.id],
      );
    }
  }

  console.log("Seed concluído. Logins de demonstração (senha: %s):", PASSWORD);
  for (const person of people) console.log("  %s  ->  %s", person.type.padEnd(10), person.email);
  await pool.end();
};

run().catch((e) => {
  console.error("Falha no seed:", e.message);
  process.exit(1);
});
