import "./Pesquisa.css";

import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { Loading, ErrorMessage, EmptyMessage } from "../../components/States/States";
import useApi from "../../../hooks/useApi";

function Pesquisa() {
  const [search, setSearch] = useState("");
  const { data, loading, error, reload } = useApi("/api/pesquisa");

  function handleSubmit(e) {
    e.preventDefault();

    const query = search.trim();

    const url = query
      ? `/api/pesquisa?q=${encodeURIComponent(query)}`
      : "/api/pesquisa";

    reload(url);
  }

  return (
    <main className="page pesquisa-page">
      <PageHeader
        badge="Busca"
        title="Pesquisar questões"
        description="Use a rota de pesquisa para encontrar questões por palavra-chave."
      />

      <form className="search-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pesquisar por enunciado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Pesquisar</button>
      </form>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data.length === 0 && (
        <EmptyMessage>Nenhum resultado encontrado.</EmptyMessage>
      )}

      <section className="list">
        {data.map((item, index) => (
          <article
            className="card item"
            key={item.id || item.questaoid || index}
          >
            <span className="pill">
              {item.dificuldade || item.tipo || "Resultado"}
            </span>

            <h2>{item.enunciado || "Questão sem enunciado"}</h2>

            <div className="meta">
              {item.topico && <span>{item.topico}</span>}
              {item.vestibular && <span>{item.vestibular}</span>}
              {item.ano && <span>{item.ano}</span>}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Pesquisa;
