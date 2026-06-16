import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import NotFound from "./pages/404/NotFound";
import ComoFunciona from "./pages/ComoFunciona/ComoFunciona";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Questoes from "./pages/Questoes/Questoes";

import { isAuthenticated, logout } from "./hooks/auth";

const rotasProtegidas = ["/", "/questoes", "/funcionamento"];

function getCurrentPath() {
  return window.location.pathname || "/";
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const [usuarioLogado, setUsuarioLogado] = useState(isAuthenticated);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (rotasProtegidas.includes(currentPath) && !usuarioLogado) {
      window.history.replaceState({}, "", "/login");
    }
  }, [currentPath, usuarioLogado]);

  function handleNavigate(event, href) {
    event.preventDefault();

    if (rotasProtegidas.includes(href) && !usuarioLogado) {
      window.history.pushState({}, "", "/login");
      setCurrentPath("/login");
      return;
    }

    window.history.pushState({}, "", href);
    setCurrentPath(href);
  }

  function handleLogin() {
    setUsuarioLogado(true);
    window.history.pushState({}, "", "/");
    setCurrentPath("/");
  }

  function handleLogout(event) {
    event.preventDefault();
    logout();
    setUsuarioLogado(false);
    window.history.pushState({}, "", "/login");
    setCurrentPath("/login");
  }

  const pathPermitido =
    rotasProtegidas.includes(currentPath) && !usuarioLogado
      ? "/login"
      : currentPath;

  const pages = {
    "/": <Home />,
    "/login": <Login onLogin={handleLogin} />,
    "/questoes": <Questoes />,
    "/funcionamento": <ComoFunciona />,
  };

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
