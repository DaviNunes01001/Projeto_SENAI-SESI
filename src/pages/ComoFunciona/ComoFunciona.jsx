import styles from "./ComoFunciona.module.css";

export default function ComoFunciona() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span>Como funciona</span>
        <h1>O projeto conecta React com uma API de questões.</h1>
        <p>
          O frontend usa as rotas do backend para listar e pesquisar questões de
          matemática cadastradas no PostgreSQL.
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
          <h2>Pesquisa</h2>
          <p>A página de questões consulta a rota /api/pesquisa.</p>
        </article>

        <article>
          <strong>03</strong>
          <h2>Estudo</h2>
          <p>Os alunos visualizam questões de matemática para estudar.</p>
        </article>
      </section>
    </main>
  );
}
