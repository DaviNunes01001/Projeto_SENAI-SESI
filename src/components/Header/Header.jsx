import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/funcionamento", label: "Como funciona" },
  { href: "/questoes", label: "Questões" },
];

export default function Header({ currentPath, isLoggedIn, onLogout, onNavigate }) {
  const authLabel = isLoggedIn ? "Sair" : "Login";
  const handleAuthClick = isLoggedIn ? onLogout : onNavigate;

  return (
    <header className={styles.header}>
      <a
        href="/"
        className={styles.logo}
        onClick={(event) => onNavigate(event, "/")}
      >
        SESI <span className={styles.senai}>SENAI</span>
      </a>

      <nav className={styles.nav}>
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
