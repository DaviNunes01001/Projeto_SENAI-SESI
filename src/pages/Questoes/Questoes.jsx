import { useState } from "react";
import useApi from "../../hooks/useApi";
import "./Questoes.css";

const API_URL = "http://localhost:3000/produtos";

export default function Questoes() {
  const [busca, setBusca] = useState("");

  const {
    data: questoes,
    loading,
    error,
    reload,
  } = useApi(API_URL);

  function pesquisarQuestoes(event) {
    event.preventDefault();

    const termo = busca.trim();

    if (!termo) {
      reload(API_URL);
      return;
    }

    reload(`${API_URL}/nome/${encodeURIComponent(termo)}`);
  }

  function limparBusca() {
    setBusca("");
    reload(API_URL);
  }

  return (
    <main className="questoes-page">
      <section className="questoes-hero">
        <span>Questões</span>

        <h1>Pesquise questões cadastradas</h1>

        <p>
          Busque pelo nome e veja os dados vindo diretamente do backend.
        </p>

        <form className="questoes-search" onSubmit={pesquisarQuestoes}>
          <input
            type="text"
            placeholder="Digite o nome da questão..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

          <button type="submit">Buscar</button>

          {busca && (
            <button type="button" className="clear-button" onClick={limparBusca}>
              Limpar
            </button>
          )}
        </form>
      </section>

      <section className="questoes-container">
        <div className="questoes-header">
          <h2>Resultados</h2>
          <p>{questoes.length} item(ns) encontrado(s)</p>
        </div>

        {loading && <p className="status">Carregando...</p>}

        {error && <p className="status error">{error}</p>}

        {!loading && !error && questoes.length === 0 && (
          <p className="status">Nenhuma questão encontrada.</p>
        )}

        {!loading && !error && questoes.length > 0 && (
          <div className="questoes-grid">
            {questoes.map((questao) => (
              <article className="questao-card" key={questao.id}>
                <span>{questao.categoria || "Sem categoria"}</span>

                <h3>{questao.nome}</h3>

                <p>
                  <strong>Preço:</strong>{" "}
                  {questao.preco != null ? `R$ ${questao.preco}` : "Não informado"}
                </p>

                <p>
                  <strong>Estoque:</strong>{" "}
                  {questao.estoque != null ? questao.estoque : "Não informado"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
