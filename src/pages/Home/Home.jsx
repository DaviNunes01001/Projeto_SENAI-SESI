
import styles from "./Home.module.css";

export default function Home() {


  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Estude Matemática com questões organizadas</h1>
        <p>
          Projeto SESI SENAI para busca e estudo de questões de matemática.
        </p>
      </section>

      <section className={styles.section}>


        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Tópicos</h2>
            <p>O site tem como tematica central, o estudo de geometria espacial com foco em pirâmides, assim como cobrado no ENEM e em outros vestibulares.</p>
          </article>

          <article className={styles.card}>
            <h2>Questões</h2>
            <p>Consulte nossa aba de questões disponíveis pela API, com mais de 30 questôes sobre geometria!</p>
          </article>

          <article className={styles.card}>
            <h2>Pesquisa e prova</h2>
            <p>Filtre questões e monte listas de estudo.</p>
          </article>

          
          <article className={styles.card}>
            <h2>Vantagem</h2>
            <p>Melhore, aprenda e se destaque!</p>
          </article>
          
          
          <article className={styles.card}>
            <h2>Profissionais</h2>
            <p>Veja as questões corrigidas passo a passo, com comentários detalhados feitos por nossos profissionais.</p>
          </article>

          <article className={styles.card}>
            <h2>Facilidade</h2>
            <p>Um site simples e de fácil utilização para todos!.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
