const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

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
      console.error("Erro ao conectar ao PostgreSQL:", erro.message);
      console.error("Verifique suas credenciais no arquivo .env");
    } else {
      console.log("Conectado ao PostgreSQL!");
      console.log(`Banco: ${process.env.DB_NAME}`);
      console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      release();
    }
  });
}

const criarTabela = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo BOOLEAN,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS avaliacao (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        nivel VARCHAR(20) NOT NULL CHECK (
            nivel IN ('base', 'intermediario', 'avancado')
        ),
        descricao TEXT
    );

    CREATE TABLE IF NOT EXISTS vestibular (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        ano INT,
        instituicao VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS subtopico (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT
    );

    CREATE TABLE IF NOT EXISTS questao (
        id SERIAL PRIMARY KEY,
        avaliacao_id INT REFERENCES avaliacao(id),
        vestibular_id INT REFERENCES vestibular(id),
        subtopico_id INT REFERENCES subtopico(id),
        enunciado TEXT NOT NULL,
        tipo VARCHAR(20) NOT NULL CHECK (
            tipo IN ('base', 'vestibular')
        ),
        conteudo VARCHAR(100) NOT NULL,
        bloco VARCHAR(100),
        explicacao TEXT,
        comentario_especialista TEXT,
        link_explicacao varchar(100)
    );

    CREATE TABLE IF NOT EXISTS alternativa (
        id SERIAL PRIMARY KEY,
        questao_id INT REFERENCES questao(id),
        letra CHAR(1) NOT NULL CHECK (
            letra IN ('A', 'B', 'C', 'D', 'E')
        ),
        texto TEXT NOT NULL,
        correta BOOLEAN DEFAULT false
    );

    CREATE EXTENSION IF NOT EXISTS unaccent;
  `;

  try {
    await pool.query(sql);
    console.log("Tabelas verificadas/criadas");
  } catch (erro) {
    console.error("Erro ao criar tabela:", erro.message);
  }
};

if (bancoConfigurado) {
  criarTabela();
}

module.exports = pool;
