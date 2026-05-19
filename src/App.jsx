import { useEffect, useState } from "react";
import "./App.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pesquisa", label: "Pesquisa" },
  { href: "/prova", label: "Prova" },
];

function getCurrentPath() {
  return window.location.pathname || "/";
}

function Header({ currentPath, onNavigate }) {
  return (
    <header className="home-header">
      <a className="brand" href="/" onClick={(event) => onNavigate(event, "/")}>
        Projeto SESI SENAI
      </a>

      <nav className="main-nav" aria-label="Navegacao principal">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={currentPath === item.href ? "active" : undefined}
            onClick={(event) => onNavigate(event, item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Home() {
  const [apiMessage, setApiMessage] = useState("Conectando ao backend...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/")
      .then((res) => {
        if (!res.ok) throw new Error("Resposta invalida do backend");
        return res.json();
      })
      .then((data) => {
        setApiMessage(data.mensagem || "Backend conectado");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="home">
      <div className="home-content">
        <h1>Projeto SESI SENAI</h1>
        <p>Bem-vindo a pagina inicial do React conectada ao backend Express.</p>

        <div className="status-card">
          <strong>Backend status</strong>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="error">Erro: {error}</p>
          ) : (
            <p>{apiMessage}</p>
          )}
        </div>

        <div className="links">
          <a href="/api/topicos">Ver topicos</a>
          <a href="/api/questoes">Ver questoes</a>
          <a href="/api/pesquisa">Ver pesquisa</a>
          <a href="/api/provas">Ver prova</a>
        </div>
      </div>
    </section>
  );
}

function EmptyPage() {
  return <section className="empty-page" aria-label="Pagina em construcao" />;
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

  const page = currentPath === "/" ? <Home /> : <EmptyPage />;

  return (
    <main className="app-shell">
      <Header currentPath={currentPath} onNavigate={handleNavigate} />
      {page}
    </main>
  );
}

export default App;
