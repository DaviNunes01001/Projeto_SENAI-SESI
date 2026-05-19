const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const topicosRoutes = require("./routes/topicosRoutes");
const questoesRoutes = require("./routes/questoesRoutes");
const pesquisaRoutes = require("./routes/pesquisaRoutes");
const provaRoutes = require("./routes/provaRoutes");

app.use("/topicos", topicosRoutes);
app.use("/api/topicos", topicosRoutes);

app.use("/questoes", questoesRoutes);
app.use("/api/questoes", questoesRoutes);

app.use("/pesquisa", pesquisaRoutes);
app.use("/api/pesquisa", pesquisaRoutes);

app.use("/prova", provaRoutes);
app.use("/api/prova", provaRoutes);
app.use("/provas", provaRoutes);
app.use("/api/provas", provaRoutes);

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de tópicos e questões com PostgreSQL",
    versao: "2.0",
    ambiente: process.env.NODE_ENV || "development",
    banco: "PostgreSQL",
  });
});

app.listen(PORT, () => {
  console.log("=".repeat(49));
  console.log("🚀 Servidor rodando!");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 Banco: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(49));
});
