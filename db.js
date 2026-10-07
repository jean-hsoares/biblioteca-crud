require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Defina DATABASE_URL (veja .env.example).');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Neon exige SSL
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS autores (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      nacionalidade VARCHAR(80)
    );
    CREATE TABLE IF NOT EXISTS livros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(200) NOT NULL,
      ano_publicacao INTEGER,
      autor_id INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT
    );
  `);
}

module.exports = { pool, init };
