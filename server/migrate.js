/**
 * Aplica server/schema.sql no banco apontado por DATABASE_URL.
 *
 * Existe porque nem toda maquina tem o cliente psql instalado, e o Neon so
 * aceita conexao TLS -- o mesmo tratamento que a API faz.
 *
 * Uso: DATABASE_URL="postgres://..." npm run db:migrate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL || "postgres://trampo:trampo_local_dev@localhost:55433/trampo";
const isRemoteDb = !/localhost|127\.0\.0\.1|@postgres[:/]/.test(DATABASE_URL);

const { Client } = pg;
const client = new Client({
  connectionString: DATABASE_URL,
  ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {}),
});

const sql = fs.readFileSync(path.join(here, "schema.sql"), "utf8");

try {
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
  );
  console.log("Schema aplicado. Tabelas: %s", rows.map((r) => r.table_name).join(", "));
} catch (e) {
  console.error("Falha ao aplicar o schema:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
