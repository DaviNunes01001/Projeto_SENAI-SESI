import "./Topicos.css";

import PageHeader from "../../components/PageHeader/PageHeader";
import { Loading, ErrorMessage, EmptyMessage } from "../../components/States/States";
import useApi from "../../../hooks/useApi";

function Topicos() {
  const { data, loading, error } = useApi("/api/topicos");

  return (
    <main className="page topicos-page">
      <PageHeader
        badge="Conteúdos"
        title="Tópicos cadastrados"
        description="Lista dos tópicos disponíveis no sistema."
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data.length === 0 && (
        <EmptyMessage>Nenhum tópico encontrado.</EmptyMessage>
      )}

      <section className="list">
        {data.map((topico) => (
          <article className="card item" key={topico.id || topico.topicoid}>
            <span className="pill">{topico.disciplina || "Disciplina"}</span>
            <h2>{topico.descricao_topico || topico.nome || "Tópico"}</h2>
            <p>Professor: {topico.professor || "Não informado"}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Topicos;
