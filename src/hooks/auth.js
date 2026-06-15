// Função: Verifica se o usuário está autenticado
// O que faz: Valida se existe token e usuário no localStorage
// Como: Verifica se token existe E se usuário foi salvo corretamente
// Por que: Protege rotas que requerem autenticação
export function isAuthenticated() {
  const token = localStorage.getItem("token");

  return !!token && !!getUsuarioLogado();
}

// Função: Obtém dados do usuário logado do localStorage
// O que faz: Recupera e parseia o JSON do usuário armazenado
// Como: Tenta fazer JSON.parse, retorna null se falhar
// Por que: Necessário para acessar perfil, email e ID do usuário em toda a aplicação
export function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch {
    // Se o JSON está corrompido, retorna null para segurança
    return null;
  }
}

// Função: Verifica se o usuário logado é professor
// O que faz: Compara o perfil do usuário com "professor"
// Como: Acessa getUsuarioLogado e verifica propriedade perfil
// Por que: Determina que funcionalidades mostrar na interface (criar/editar questões)
export function isProfessor() {
  return getUsuarioLogado()?.perfil === "professor";
}

// Função: Realiza logout do usuário
// O que faz: Remove token e dados do usuário do localStorage
// Como: Chama removeItem para limpar ambos os dados
// Por que: Limpa sessão quando usuário clica em sair
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
