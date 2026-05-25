const crypto = require("crypto");
const express = require("express");

const router = express.Router();

const usuario = {
  id: 1,
  email: "admin@gmail.com",
  senha: "12345",
};

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (email !== usuario.email) {
    return res.status(401).json({
      mensagem: "Usuario nao encontrado",
    });
  }

  if (senha !== usuario.senha) {
    return res.status(401).json({
      mensagem: "Senha invalida",
    });
  }

  const token = crypto
    .createHash("sha256")
    .update(`${usuario.id}:${usuario.email}:${Date.now()}`)
    .digest("hex");

  return res.json({
    mensagem: "Login realizado com sucesso",
    usuario: {
      id: usuario.id,
      email: usuario.email,
    },
    token,
  });
});

module.exports = router;
