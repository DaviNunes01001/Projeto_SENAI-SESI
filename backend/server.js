const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

const questoesRoutes = require("./routes/questoesRoutes");
const pesquisaRoutes = require("./routes/pesquisaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de questões de matemática",
    versao: "1.0",
    ambiente: process.env.NODE_ENV || "development",
    banco: "PostgreSQL",
  });
});

app.get("/api", (req, res) => {
  res.json({
    mensagem: "API de questões de matemática",
    versao: "1.0",
    rotas: ["/api/questoes", "/api/pesquisa"],
  });
});

app.use("/api/questoes", questoesRoutes);
app.use("/api/pesquisa", pesquisaRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

app.listen(PORT, () => {
  console.log("=".repeat(49));
  console.log("Servidor rodando!");
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Banco: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(49));
});
