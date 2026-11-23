
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const { Pool } = require("pg");

const variaveisObrigatorias = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
];

const variaveisAusentes = variaveisObrigatorias.filter((nome) => {
  const valor = process.env[nome];
  return typeof valor !== "string" || valor.trim() === "";
});

const bancoConfigurado = variaveisAusentes.length === 0;

if (!bancoConfigurado) {
  console.warn(
    `Banco nao configurado. Variaveis ausentes no .env: ${variaveisAusentes.join(
      ", ",
    )}`,
  );
}

const pool = bancoConfigurado
  ? new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000,
    })
  : {
      query() {
        throw new Error(
          `Banco nao configurado. Crie um .env com: ${variaveisObrigatorias.join(
            ", ",
          )}`,
        );
      },
    };

if (bancoConfigurado) {
  pool.connect((erro, client, release) => {
    if (erro) {
      console.error(
        "Erro ao conectar ao PostgreSQL:",
        erro.message,
      );
      console.error("Verifique as credenciais e a conexão com o Supabase.");
    } else {
      console.log("Conectado ao PostgreSQL!");
      console.log(`Banco: ${process.env.DB_NAME}`);
      console.log(`Porta: ${process.env.DB_PORT}`);
      console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

      release();
    }
  });
}

module.exports = pool;
