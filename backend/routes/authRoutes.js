const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Usuário fixo apenas para exemplo
const usuario = {
  id: 1,
  email: "admin@gmail.com",
  senha: bcrypt.hashSync("123456", 8),
};

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (email !== usuario.email) {
    return res.status(401).json({
      mensagem: "Usuário não encontrado",
    });
  }


  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({
      mensagem: "Senha inválida",
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );


  return res.json({
    mensagem: "Login realizado com sucesso",
    token,
  });
});

module.exports = router;