import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import NotFound from "./pages/404/NotFound";
import ComoFunciona from "./pages/ComoFunciona/ComoFunciona";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Questoes from "./pages/Questoes/Questoes";

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

  function handleNavigate(event, href) {
    event.preventDefault();
    window.history.pushState({}, "", href);
    setCurrentPath(href);
  }

  const pages = {
    "/": <Home />,
    "/login": <Login />,
    "/questoes": <Questoes />,
    "/funcionamento": <ComoFunciona />,
  };

  return (
    <>
      <Header currentPath={currentPath} onNavigate={handleNavigate} />
      {pages[currentPath] || <NotFound />}
    </>
  );
}

export default App;
