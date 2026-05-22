import useApi from "../../hooks/useApi";
import styles from "./Home.module.css";

export default function Home() {
  const { data, loading, error } = useApi("/api/");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Estude Matemática com questões organizadas</h1>
        <p>
          Projeto SESI SENAI para busca e estudo de questões de matemática.
        </p>
      </section>

      <section className={styles.section}>
        <article className={styles.backendCard}>
          <h2>Status do backend</h2>

          {loading && <p>Conectando...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && (
            <p>{data[0]?.mensagem || "Backend conectado com sucesso."}</p>
          )}
        </article>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Tópicos</h2>
            <p>Veja conteúdos matemáticos cadastrados no banco de dados.</p>
          </article>

          <article className={styles.card}>
            <h2>Questões</h2>
            <p>Consulte questões disponíveis pela API.</p>
          </article>

          <article className={styles.card}>
            <h2>Pesquisa e prova</h2>
            <p>Filtre questões e monte listas de estudo.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
