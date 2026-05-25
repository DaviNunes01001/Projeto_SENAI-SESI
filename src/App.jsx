import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import NotFound from "./pages/404/NotFound";
import ComoFunciona from "./pages/ComoFunciona/ComoFunciona";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Questoes from "./pages/Questoes/Questoes";

import { isAuthenticated } from "./hooks/auth";

function getCurrentPath() {
  return window.location.pathname || "/";
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

   useEffect(() => {
    const rotasProtegidas = ["/", "/questoes", "/funcionamento"];

    if (
      rotasProtegidas.includes(currentPath) &&
      !isAuthenticated()
    ) {
      window.history.pushState({}, "", "/login");
      setCurrentPath("/login");
    }
  }, [currentPath]);

  function handleNavigate(event, href) {
    event.preventDefault();

    const rotasProtegidas = ["/", "/questoes", "/funcionamento"];

    if (rotasProtegidas.includes(href) && !isAuthenticated()) {
      window.history.pushState({}, "", "/login");
      setCurrentPath("/login");
      return;
    }

    window.history.pushState({}, "", href);
    setCurrentPath(href);
  }

    const pages = {
    "/": <Home />,
    "/login": <Login setCurrentPath={setCurrentPath} />,
    "/questoes": <Questoes />,
    "/funcionamento": <ComoFunciona />,
  };

  return (
    <>
      {currentPath !== "/login" && (
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      )}

      {pages[currentPath] || <NotFound />}
    </>
  );
}

export default App;