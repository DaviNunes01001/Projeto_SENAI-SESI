// Carrega as variáveis de ambiente do arquivo .env localizado na raiz do projeto
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

// Importa os roteadores de autenticação e questões
const authRoutes = require("./routes/authRoutes");
const questoesRoutes = require("./routes/questoesRoutes");

// Cria a aplicação Express e define a porta (padrão 3000)
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Habilita CORS para permitir requisições de origens diferentes
// Middleware: Configura o Express para interpretar JSON no corpo das requisições
app.use(cors());
app.use(express.json());

// Rota raiz (GET /): Retorna informações sobre a API
// Por que: Facilita a verificação se a API está rodando e informa sua versão
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de questões de matemática",
    versao: "1.0",
    ambiente: process.env.NODE_ENV || "development",
    banco: "PostgreSQL",
  });
});

// Rota de informações da API (GET /api): Lista as rotas principais disponíveis
// Por que: Oferece documentação básica sobre os endpoints disponíveis
app.get("/api", (req, res) => {
  res.json({
    mensagem: "API de questões de matemática",
    versao: "1.0",
    rotas: ["/api/auth/login", "/api/questoes"],
  });
});

// Registra os roteadores para as rotas de autenticação e questões
app.use("/api/auth", authRoutes);
app.use("/api/questoes", questoesRoutes);

// Middleware de tratamento de rotas não encontradas
// Por que: Retorna um erro 404 quando o usuário tenta acessar uma rota inexistente
app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

// Inicia o servidor na porta especificada
// Por que: Torna a API acessível via HTTP nos clientes
app.listen(PORT, () => {
  console.log("=".repeat(49));
  console.log("Servidor rodando!");
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Banco: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(49));
});
