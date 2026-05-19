import "./Home.css";

import PageHeader from "../../components/PageHeader/PageHeader";
import useApi from "../../../hooks/useApi";

function Home() {
  const { data, loading, error } = useApi("/api/");

  return (
    <main className="page home-page">
      <PageHeader
        badge="Plataforma de estudos"
        title="Projeto SESI SENAI"
        description="Sistema para visualizar tópicos, questões, pesquisas e provas usando o backend Express com PostgreSQL."
      />

      <section className="grid">
        <article className="card featured">
          <h2>Status do backend</h2>

          {loading && <p>Conectando...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <p>{data[0]?.mensagem || "Backend conectado com sucesso."}</p>
          )}
        </article>

        <article className="card">
          <h2>Tópicos</h2>
          <p>Veja disciplinas, professores e conteúdos cadastrados.</p>
        </article>

        <article className="card">
          <h2>Questões</h2>
          <p>Consulte questões disponíveis no banco de dados.</p>
        </article>

        <article className="card">
          <h2>Pesquisa e prova</h2>
          <p>Filtre questões e monte listas de estudo.</p>
        </article>
      </section>
    </main>
  );
}

export default Home;
