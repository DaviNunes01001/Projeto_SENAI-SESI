const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function criarUsuarioPorEnv(prefixo, id) {
  const email = process.env[`${prefixo}_EMAIL`];
  const senha = process.env[`${prefixo}_SENHA`];
  const perfil = process.env[`${prefixo}_PERFIL`];

  if (!email || !senha || !perfil) {
    return null;
  }

  return {
    id,
    email,
    senha,
    perfil,
  };
}

function listarUsuarios() {
  return [
    criarUsuarioPorEnv("ALUNO", 1),
    criarUsuarioPorEnv("PROFESSOR", 2),
  ].filter(Boolean);
}

router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuariosConfigurados = listarUsuarios();
  const usuario = usuariosConfigurados.find((item) => item.email === email);

  if (usuariosConfigurados.length === 0) {
    return res.status(500).json({
      mensagem: "Usuarios nao configurados no .env",
    });
  }

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

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

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
