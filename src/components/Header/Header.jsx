import styles from "./Header.module.css";

// Array de itens de navegação do header
// Por que: Centraliza rotas para evitar hardcoding repetido
const navItems = [
  { href: "/", label: "Home" },
  { href: "/funcionamento", label: "Como funciona" },
  { href: "/questoes", label: "Questões" },
];

// Componente: Header - Barra de navegação principal
// O que faz: Renderiza logo, menu de navegação e botão de autenticação
// Como: Usa props para rotas ativas, callbacks para navegação e logout
// Por que: Header principal do aplicativo, aparece em todas as páginas logadas
export default function Header({ currentPath, isLoggedIn, onLogout, onNavigate }) {
  // Define label e handler baseado em estado de login
  // Por que: Mesmo botão alterna entre Login e Sair
  const authLabel = isLoggedIn ? "Sair" : "Login";
  const handleAuthClick = isLoggedIn ? onLogout : onNavigate;

  return (
    <header className={styles.header}>
      {/* Logo/Brand que leva para home */}
      <a
        href="/"
        className={styles.logo}
        onClick={(event) => onNavigate(event, "/")}
      >
        SESI <span className={styles.senai}>SENAI</span>
      </a>

      {/* Menu de navegação */}
      <nav className={styles.nav}>
        {/* Mapeia items de navegação para links */}
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => onNavigate(event, item.href)}
            className={`${styles.navLink} ${
              currentPath === item.href ? styles.active : ""
            }`}
          >
            {item.label}
          </a>
        ))}

        {/* Botão de autenticação (Login/Sair) */}
        <a
          href="/login"
          onClick={(event) => handleAuthClick(event, "/login")}
          className={`${styles.navLink} ${styles.loginLink} ${
            currentPath === "/login" && !isLoggedIn ? styles.active : ""
          }`}
        >
          {authLabel}
        </a>
      </nav>
    </header>
  );
}
