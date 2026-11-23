const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const questoesRoutes = require("./routes/questoesRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const frontendUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
const corsOptions = frontendUrl
  ? {
      origin(origin, callback) {
        if (
          !origin ||
          origin === frontendUrl ||
          origin.endsWith(".vercel.app")
        ) {
          callback(null, true);
          return;
        }

        callback(new Error("Origem nao autorizada pelo CORS."));
      },
    }
  : undefined;

app.use(cors(corsOptions));
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
    rotas: ["/api/auth/login", "/api/questoes"],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questoes", questoesRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("=".repeat(49));
    console.log("Servidor rodando!");
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Banco: PostgreSQL (${process.env.DB_NAME})`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log("=".repeat(49));
  });
}

module.exports = app;
