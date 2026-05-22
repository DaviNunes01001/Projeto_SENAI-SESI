import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/funcionamento", label: "Como funciona" },
  { href: "/questoes", label: "Questões" },
  { href: "/login", label: "Login" },
];

export default function Header({ currentPath, onNavigate }) {
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
            } ${item.href === "/login" ? styles.loginLink : ""}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
