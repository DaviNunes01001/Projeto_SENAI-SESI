// Importa o módulo JWT para validar tokens
const jwt = require("jsonwebtoken");

// Função: Middleware que valida o token JWT de autenticação
// O que faz: Verifica se o token é válido e coloca o usuário decodificado em req.usuario
// Como: Extrai o token do header Authorization, valida com JWT_SECRET, passa para próximo middleware
// Por que: Protege rotas que requerem autenticação, garante que apenas usuários logados acessem
function authMiddleware(req, res, next) {
  // Extrai o header Authorization da requisição
  const authHeader = req.headers.authorization;

  // Se não houver header Authorization, nega a requisição
  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token não enviado",
    });
  }

  // Extrai o token da string "Bearer <token>"
  // O token está no segundo elemento após split por espaço
  const token = authHeader.split(" ")[1];

  try {
    // Valida o token com a chave secreta do .env
    // Se válido, decodifica e obtém os dados do usuário
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Armazena os dados do usuário decodificado em req.usuario
    // Estes dados foram codificados no login e contêm id, email, perfil
    req.usuario = decoded;

    // Chama o próximo middleware/rota se tudo estiver válido
    next();
  } catch (error) {
    // Se o token for inválido, expirado ou a assinatura estiver incorreta
    // Nega a requisição com erro 401
    return res.status(401).json({
      mensagem: "Token inválido",
    });
  }
}

module.exports = authMiddleware;