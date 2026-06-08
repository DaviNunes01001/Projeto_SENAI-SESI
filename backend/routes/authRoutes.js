const crypto = require("crypto");
const express = require("express");

const router = express.Router();

const usuarios = [
  {
    id: 1,
    email: "aluno@gmail.com",
    senha: "12345",
    perfil: "aluno",
  },
  {
    id: 2,
    email: "professor@gmail.com",
    senha: "12345",
    perfil: "professor",
  },
];

router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find((item) => item.email === email);

  if (!usuario) {
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
      perfil: usuario.perfil,
    },
    token,
  });
});

module.exports = router;
