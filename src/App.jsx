import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import NotFound from "./pages/404/NotFound";
import ComoFunciona from "./pages/ComoFunciona/ComoFunciona";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Questoes from "./pages/Questoes/Questoes";

import { isAuthenticated, logout } from "./hooks/auth";

// Define quais rotas requerem autenticação
// Por que: Protege certas páginas para usuários não logados
const rotasProtegidas = ["/", "/questoes", "/funcionamento"];

// Função: Obtém o caminho atual da URL
// O que faz: Retorna pathname da janela ou "/" se vazio
// Como: Acessa window.location.pathname
// Por que: Usado para rastrear rota atual sem React Router
function getCurrentPath() {
  return window.location.pathname || "/";
}

// Componente: App - Roteador e gerenciador de autenticação principal
// O que faz: Renderiza página correta baseado na rota e status de login
// Como: Usa state para rastrear rota e autenticação, History API para navegação
// Por que: Implementa roteamento client-side simples sem biblioteca externa
function App() {
  // Estado: Rota atual (ex: "/", "/login", "/questoes")
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  // Estado: Booleano indicando se usuário está logado
  const [usuarioLogado, setUsuarioLogado] = useState(isAuthenticated);

  // Effect: Escuta eventos de voltar/avançar do navegador (popstate)
  // O que faz: Atualiza rota atual quando usuário clica voltar/avançar
  // Como: Adiciona listener no popstate, retorna cleanup function
  // Por que: Mantém state sincronizado com histórico do navegador
  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Effect: Protege rotas que requerem autenticação
  // O que faz: Redireciona para login se tentar acessar rota protegida sem autenticação
  // Como: Se rota é protegida E não está logado, substitui histórico para /login
  // Por que: Impede que usuários não autenticados vejam páginas protegidas
  useEffect(() => {
    if (rotasProtegidas.includes(currentPath) && !usuarioLogado) {
      window.history.replaceState({}, "", "/login");
    }
  }, [currentPath, usuarioLogado]);

  // Função: Navega para uma nova rota usando History API
  // O que faz: Trata navegação entre páginas, valida autenticação
  // Como: Previne padrão, verifica proteção de rota, usa pushState
  // Por que: Implementa navegação client-side sem recarregar página
  function handleNavigate(event, href) {
    event.preventDefault();

    // Se rota é protegida e não está logado, vai para login em vez de navegar
    if (rotasProtegidas.includes(href) && !usuarioLogado) {
      window.history.pushState({}, "", "/login");
      setCurrentPath("/login");
      return;
    }

    // Caso contrário, navega normalmente
    window.history.pushState({}, "", href);
    setCurrentPath(href);
  }

  // Função: Tratador de login bem-sucedido
  // O que faz: Marca usuário como logado e navega para home
  // Como: Seta estado de login, navega para "/"
  // Por que: Chamado após login bem-sucedido no formulário
  function handleLogin() {
    setUsuarioLogado(true);
    window.history.pushState({}, "", "/");
    setCurrentPath("/");
  }

  // Função: Tratador de logout
  // O que faz: Remove token/usuário e navega para login
  // Como: Chama logout(), seta estado false, navega para login
  // Por que: Chamado quando usuário clica em "Sair"
  function handleLogout(event) {
    event.preventDefault();
    logout();
    setUsuarioLogado(false);
    window.history.pushState({}, "", "/login");
    setCurrentPath("/login");
  }

  // Define qual rota renderizar
  // Se rota protegida e não logado, força login
  const pathPermitido =
    rotasProtegidas.includes(currentPath) && !usuarioLogado
      ? "/login"
      : currentPath;

  // Mapa de rotas e seus componentes
  // Por que: Centraliza roteamento para fácil manutenção
  const pages = {
    "/": <Home />,
    "/login": <Login onLogin={handleLogin} />,
    "/questoes": <Questoes />,
    "/funcionamento": <ComoFunciona />,
  };

  // Renderiza Header se não está em login, depois a página correspondente
  // Por que: Header só aparece para usuários logados
  return (
    <>
      {pathPermitido !== "/login" && (
        <Header
          currentPath={pathPermitido}
          isLoggedIn={usuarioLogado}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {pages[pathPermitido] || <NotFound />}
    </>
  );
}

export default App;
