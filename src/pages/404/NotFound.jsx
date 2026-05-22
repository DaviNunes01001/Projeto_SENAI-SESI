import styles from "./NotFound.module.css";

function NotFound() {
  function goHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    goHome();
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.code} aria-hidden="true">
          404
        </div>

        <div className={styles.content}>
          <span className={styles.badge}>Rota inválida</span>
          <h1>Página não encontrada</h1>
          <p>
            O endereço acessado não existe ou foi movido. Volte para uma página
            conhecida para continuar estudando.
          </p>

          <div className={styles.actions}>
            <button type="button" onClick={goHome}>
              Ir para o início
            </button>
            <button type="button" className={styles.secondary} onClick={goBack}>
              Voltar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
