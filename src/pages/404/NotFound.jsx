import styles from "./NotFound.module.css";

// Componente: NotFound - Página 404 para rotas inválidas
// O que faz: Exibe mensagem amigável quando usuário acessa rota inexistente
// Como: Oferece botões para ir para home ou voltar no histórico
// Por que: Melhora UX quando usuário digita URL errada ou acessa rota removida
function NotFound() {
  // Função: Navega para a página inicial
  // O que faz: Usa History API para ir para "/"
  // Como: PushState para adicionar ao histórico, dispatchEvent para triggar popstate
  // Por que: Navega sem recarregar página, com History API sincronizado
  function goHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  // Função: Volta para a página anterior
  // O que faz: Volta no histórico ou vai para home se não há histórico
  // Como: Checa window.history.length, usa back() ou chama goHome()
  // Por que: Oferece opção natural de voltar, com fallback para home
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
        {/* Número 404 em grande destaque */}
        <div className={styles.code} aria-hidden="true">
          404
        </div>

        {/* Conteúdo da mensagem de erro */}
        <div className={styles.content}>
          <span className={styles.badge}>Rota inválida</span>
          <h1>Página não encontrada</h1>
          <p>
            O endereço acessado não existe ou foi movido. Volte para uma página
            conhecida para continuar estudando.
          </p>

          {/* Botões de ação */}
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
