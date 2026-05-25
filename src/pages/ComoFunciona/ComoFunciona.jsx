import styles from "./ComoFunciona.module.css";

export default function ComoFunciona() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span>Como funciona</span>
        <h1>O projeto conecta React com uma API de questoes.</h1>
        <p>
          O frontend usa as rotas do backend para listar e pesquisar questoes de
          matematica cadastradas no PostgreSQL.
        </p>
      </section>

      <section className={styles.steps}>
        <article>
          <strong>01</strong>
          <h2>Backend</h2>
          <p>O Express disponibiliza as rotas da API.</p>
        </article>

        <article>
          <strong>02</strong>
          <h2>Questoes</h2>
          <p>A pagina de questoes consulta a rota /api/questoes.</p>
        </article>

        <article>
          <strong>03</strong>
          <h2>Estudo</h2>
          <p>Os alunos visualizam questoes de matematica para estudar.</p>
        </article>
      </section>
    </main>
  );
}
