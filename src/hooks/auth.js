export function isAuthenticated() {
  const token = localStorage.getItem("token");

  return !!token;
}

export function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch {
    return null;
  }
}

export function isProfessor() {
  return getUsuarioLogado()?.perfil === "professor";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "/login";
}
