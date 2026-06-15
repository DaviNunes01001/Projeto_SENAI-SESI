// Importa o express e jwt para criar rotas de autenticação
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Função: Cria um objeto de usuário a partir de variáveis de ambiente
// O que faz: Lê email, senha e perfil do .env e retorna objeto usuário
// Como: Obtém variáveis com prefixo (ALUNO_, PROFESSOR_) e as organiza em objeto
// Por que: Permite configurar usuários sem banco de dados, facilitando testes
function criarUsuarioPorEnv(prefixo, id) {
  // Obtém email, senha e perfil do .env com o prefixo fornecido
  const email = process.env[`${prefixo}_EMAIL`];
  const senha = process.env[`${prefixo}_SENHA`];
  const perfil = process.env[`${prefixo}_PERFIL`];

  // Se alguma propriedade obrigatória estiver faltando, retorna null
  if (!email || !senha || !perfil) {
    return null;
  }

  // Retorna o usuário com todos os dados necessários
  return {
    id,
    email,
    senha,
    perfil,
  };
}

// Função: Lista todos os usuários configurados no .env
// O que faz: Cria objetos de usuário para ALUNO e PROFESSOR a partir de .env
// Como: Chama criarUsuarioPorEnv para cada prefixo e filtra os válidos (não null)
// Por que: Centraliza a obtenção de usuários disponíveis para validação de login
function listarUsuarios() {
  return [
    criarUsuarioPorEnv("ALUNO", 1),
    criarUsuarioPorEnv("PROFESSOR", 2),
  ].filter(Boolean);
}

// Rota: POST /api/auth/login - Realiza autenticação do usuário
// O que faz: Valida email e senha, gera token JWT se credenciais forem válidas
// Como: Busca usuário configurado, compara senha, cria token com dados do usuário
// Por que: Permite que usuários façam login e obtenham token para acessar recursos protegidos
router.post("/login", (req, res) => {
  // Extrai email e senha do corpo da requisição
  const { email, senha } = req.body;

  // Obtém lista de usuários configurados
  const usuariosConfigurados = listarUsuarios();

  // Busca usuário que tenha o email fornecido
  const usuario = usuariosConfigurados.find((item) => item.email === email);

  // Se nenhum usuário foi configurado no .env, retorna erro 500
  if (usuariosConfigurados.length === 0) {
    return res.status(500).json({
      mensagem: "Usuarios nao configurados no .env",
    });
  }

  // Se não encontrou usuário com este email, retorna erro 401
  if (!usuario) {
    return res.status(401).json({
      mensagem: "Usuario nao encontrado",
    });
  }

  // Compara a senha fornecida com a senha configurada
  // Se não corresponder, retorna erro 401
  if (senha !== usuario.senha) {
    return res.status(401).json({
      mensagem: "Senha invalida",
    });
  }

  // Cria um token JWT assinado com os dados do usuário
  // O token contém id, email e perfil do usuário
  // Expira em 1 hora por segurança
  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  // Retorna sucesso com o token e dados do usuário
  // O cliente deve armazenar este token e enviá-lo em requisições protegidas
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
