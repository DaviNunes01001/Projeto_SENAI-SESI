import styles from "./States.module.css";

export function Loading() {
  return <div className={styles["state-card"]}>Carregando dados...</div>;
}

export function ErrorMessage({ message }) {
  return (
    <div className={styles["state-card"] + " " + styles.error}>
      Erro: {message}
    </div>
  );
}

export function EmptyMessage({ children }) {
  return <div className={styles["state-card"]}>{children}</div>;
}
