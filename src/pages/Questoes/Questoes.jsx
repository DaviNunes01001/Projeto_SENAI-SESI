import "./Questoes.css";

import PageHeader from "../../components/PageHeader/PageHeader";
import { Loading, ErrorMessage, EmptyMessage } from "../../components/States/States";
import useApi from "../../../hooks/useApi";

function Questoes() {
  const { data, loading, error } = useApi("/api/questoes");

  return (
    <main className="page questoes-page">
      <PageHeader
        badge="Banco de questões"
        title="Questões"
        description="Visualize as questões cadastradas no backend."
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data.length === 0 && (
        <EmptyMessage>Nenhuma questão encontrada.</EmptyMessage>
      )}

      <section className="list">
        {data.map((questao) => (
          <article className="card item" key={questao.id || questao.questaoid}>
            <span className="pill">{questao.tipo || "Questão"}</span>
            <h2>{questao.enunciado || "Sem enunciado"}</h2>

            <div className="meta">
              {questao.disciplina && <span>{questao.disciplina}</span>}
              {questao.vestibular && <span>{questao.vestibular}</span>}
              {questao.ano && <span>{questao.ano}</span>}
            </div>

            {questao.explicacao && <p>{questao.explicacao}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Questoes;
