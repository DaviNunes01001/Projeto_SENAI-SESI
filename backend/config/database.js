// Carrega variáveis de ambiente
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = require("pg");

// Define as variáveis de ambiente obrigatórias para conectar ao PostgreSQL
// Por que: Garante que todas as credenciais necessárias estejam configuradas
const variaveisObrigatorias = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
];

// Verifica quais variáveis obrigatórias estão faltando ou vazias
// O que faz: Filtra as variáveis que não existem ou são strings vazias
// Por que: Ajuda a diagnosticar erros de configuração no .env
const variaveisAusentes = variaveisObrigatorias.filter((nome) => {
  const valor = process.env[nome];
  return typeof valor !== "string" || valor.trim() === "";
});

// Verifica se o banco está corretamente configurado
// Por que: Determina se deve criar um pool de conexão real ou um dummy
const bancoConfigurado = variaveisAusentes.length === 0;

// Se o banco não estiver configurado, avisa o desenvolvedor
if (!bancoConfigurado) {
  console.warn(
    `Banco nao configurado. Variaveis ausentes no .env: ${variaveisAusentes.join(
      ", ",
    )}`,
  );
}

// Cria um pool de conexões com o PostgreSQL ou um objeto dummy com erro
// Como: Se configurado, cria um pool real; caso contrário, retorna um objeto que lança erro
// Por que: Permite que o servidor inicie mesmo sem banco, facilitando diagnóstico de erros
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

// Testa a conexão ao banco se estiver configurado
// Como: Tenta conectar e desconectar para validar as credenciais
// Por que: Valida se os dados de conexão estão corretos durante a inicialização
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

// Função: Cria as tabelas do banco de dados se elas não existirem
// O que faz: Executa SQL para criar tabelas (usuario, avaliacao, vestibular, subtopico, questao, alternativa)
// Por que: Inicializa automaticamente o schema do banco sem manual
// Como: Usa CREATE TABLE IF NOT EXISTS para evitar erros se tabelas já existirem
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
        titulo VARCHAR(300) NOT NULL,
        nivel VARCHAR(20) NOT NULL CHECK (
            nivel IN ('base', 'intermediario', 'avancado')
        ),
        descricao TEXT
    );

    CREATE TABLE IF NOT EXISTS vestibular (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(300) NOT NULL,
        ano INT,
        instituicao VARCHAR(300)
    );

    CREATE TABLE IF NOT EXISTS subtopico (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(300) NOT NULL,
        descricao TEXT
    );

    CREATE TABLE IF NOT EXISTS questao (
        id SERIAL PRIMARY KEY,
        avaliacao_id INT REFERENCES avaliacao(id),
        vestibular_id INT REFERENCES vestibular(id),
        subtopico_id INT REFERENCES subtopico(id),
        enunciado TEXT NOT NULL,
        tipo VARCHAR(300) NOT NULL CHECK (
            tipo IN ('base', 'vestibular')
        ),
        conteudo VARCHAR(700) NOT NULL,
        bloco VARCHAR(100),
        explicacao TEXT,
        comentario_especialista TEXT,
        link_explicacao varchar(500)
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

// Executa a criação de tabelas se o banco estiver configurado
if (bancoConfigurado) {
  criarTabela();
}

module.exports = pool;
