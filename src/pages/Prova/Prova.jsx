import "./Prova.css";

import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { Loading, ErrorMessage, EmptyMessage } from "../../components/States/States";
import useApi from "../../../hooks/useApi";

function Prova() {
  const [filter, setFilter] = useState("todos");
  const { data, loading, error, reload } = useApi("/api/prova");

  const endpoints = useMemo(
    () => ({
      todos: "/api/prova",
      recente: "/api/prova/ano/recente",
      antigo: "/api/prova/ano/antigo",
    }),
    []
  );

  function handleFilter(value) {
    setFilter(value);
    reload(endpoints[value]);
  }

  return (
    <main className="page prova-page">
      <PageHeader
        badge="Simulado"
        title="Montar prova"
        description="Use as questões retornadas pelo backend para montar uma prova ou lista de estudos."
      />

      <div className="toolbar">
        <button
          className={filter === "todos" ? "selected" : ""}
          onClick={() => handleFilter("todos")}
        >
          Todas
        </button>

        <button
          className={filter === "recente" ? "selected" : ""}
          onClick={() => handleFilter("recente")}
        >
          Mais recentes
        </button>

        <button
          className={filter === "antigo" ? "selected" : ""}
          onClick={() => handleFilter("antigo")}
        >
          Mais antigas
        </button>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data.length === 0 && (
        <EmptyMessage>Nenhuma questão para montar a prova.</EmptyMessage>
      )}

      <section className="list">
        {data.map((questao, index) => (
          <article
            className="card item prova-item"
            key={questao.id || questao.questaoid || index}
          >
            <div className="question-number">{index + 1}</div>

            <div>
              <span className="pill">
                {questao.dificuldade || questao.tipo || "Questão"}
              </span>

              <h2>{questao.enunciado || "Questão sem enunciado"}</h2>

              <div className="meta">
                {questao.vestibular && <span>{questao.vestibular}</span>}
                {questao.ano && <span>{questao.ano}</span>}
                {questao.topico && <span>{questao.topico}</span>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Prova;
