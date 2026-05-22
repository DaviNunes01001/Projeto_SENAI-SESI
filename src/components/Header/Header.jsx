import "./Header.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/funcionamento", label: "Como funciona" },
  { href: "/questoes", label: "Questões" },
  { href: "/login", label: "Login" },
];

function Header({ currentPath, onNavigate }) {
  return (
    <header className="header">
      <a href="/" className="brand" onClick={(e) => onNavigate(e, "/")}>
        SESI <span>SENAI</span>
      </a>

      <nav className="nav">
        {navItems.map((item) => (
  { href: "/questoes", label: "Começar agora" },
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
