import "./Header.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/topicos", label: "Tópicos" },
  { href: "/questoes", label: "Questões" },
  { href: "/pesquisa", label: "Pesquisa" },
  { href: "/prova", label: "Prova" },
];

function Header({ currentPath, onNavigate }) {
  return (
    <header className="header">
      <a href="/" className="brand" onClick={(e) => onNavigate(e, "/")}>
        SESI SENAI
      </a>

      <nav className="nav">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={currentPath === item.href ? "active" : ""}
            onClick={(e) => onNavigate(e, item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Header;
