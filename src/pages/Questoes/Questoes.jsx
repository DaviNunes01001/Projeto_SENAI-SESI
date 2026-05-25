import jsPDF from "jspdf";
import { useState } from "react";
import useApi from "../../hooks/useApi";
import styles from "./Questoes.module.css";

function getRespostaCorreta(questao) {
  return questao.alternativas?.find((alternativa) => alternativa.correta);
}

function montarUrlQuestoes(busca, nivel, ano) {
  const params = new URLSearchParams();
  const termo = busca.trim();
  const anoFiltro = ano.trim();

  if (termo) {
    params.set("q", termo);
  }

  if (nivel) {
    params.set("nivel", nivel);
  }

  if (anoFiltro) {
    params.set("ano", anoFiltro);
  }

  const query = params.toString();
  return query ? `/api/questoes?${query}` : "/api/questoes";
}

export default function Questoes() {
  const [busca, setBusca] = useState("");
  const [nivel, setNivel] = useState("");
  const [ano, setAno] = useState("");
  const [questaoAberta, setQuestaoAberta] = useState(null);
  const { data: questoes, loading, error, reload } = useApi("/api/questoes");
  const { data: anos } = useApi("/api/questoes/anos");
  const anosDisponiveis = [
    ...new Set(anos.map((item) => item.ano).filter(Boolean)),
  ];

  function pesquisarQuestoes(event) {
    event.preventDefault();
    setQuestaoAberta(null);
    reload(montarUrlQuestoes(busca, nivel, ano));
  }

  function limparBusca() {
    setBusca("");
    setNivel("");
    setAno("");
    setQuestaoAberta(null);
    reload("/api/questoes");
  }

  function alternarResposta(id) {
    setQuestaoAberta((atual) => (atual === id ? null : id));
  }

  function gerarPdfQuestao(questao) {
    const pdf = new jsPDF();
    const margem = 15;
    const larguraTexto = 180;
    let y = 20;

    function escreverTitulo(texto) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(texto, margem, y);
      y += 8;
    }

    function escreverTexto(texto) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const linhas = pdf.splitTextToSize(texto, larguraTexto);
      pdf.text(linhas, margem, y);
      y += linhas.length * 7 + 5;
    }

    function garantirEspaco() {
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Questão de Matemática", margem, y);
    y += 14;

    escreverTitulo("Vestibular:");
    escreverTexto(
      `${questao.vestibular || " Não informado "}${
        questao.ano ? ` - ${questao.ano}` : " "
      }`,
    );

    escreverTitulo("Enunciado:");
    escreverTexto(questao.enunciado || "Enunciado não informado.");

    if (questao.alternativas?.length) {
      escreverTitulo("Alternativas:");

      questao.alternativas.forEach((alternativa) => {
        garantirEspaco();
        escreverTexto(`${alternativa.letra}) ${alternativa.texto}`);
      });
    }

    garantirEspaco();
    escreverTitulo("Resposta:");

    const respostaCorreta = getRespostaCorreta(questao);
    escreverTexto(
      respostaCorreta
        ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
        : "Resposta não cadastrada.",
    );

    garantirEspaco();
    escreverTitulo("Explicação:");
    escreverTexto(questao.explicacao || "Explicação não cadastrada.");

    pdf.save(`questao-${questao.id || "matematica"}.pdf`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>Matemática</span>

        <h1>Questões de Matemática</h1>

        <p>Pesquise questões cadastradas no banco de dados pelo enunciado.</p>

        <form className={styles.searchForm} onSubmit={pesquisarQuestoes}>
          <input
            type="text"
            placeholder="Pesquisar por enunciado..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

          <label className={styles.levelFilter}>
            <span>Nível</span>
            <select
              value={nivel}
              onChange={(event) => setNivel(event.target.value)}
            >
              <option value="">Todos</option>
              <option value="base">Base</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </label>

          <label className={styles.levelFilter}>
            <span>Ano</span>
            <select
              value={ano}
              onChange={(event) => setAno(event.target.value)}
            >
              <option value="">Todos</option>
              {anosDisponiveis.map((anoDisponivel) => (
                <option key={anoDisponivel} value={anoDisponivel}>
                  {anoDisponivel}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Buscar</button>

          {(busca || nivel || ano) && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={limparBusca}
            >
              Limpar
            </button>
          )}
        </form>
      </section>

      <section className={styles.content}>
        <div className={styles.contentHeader}>
          <h2>Resultados</h2>
          <p>{questoes.length} questão(ões)</p>
        </div>

        {loading && <p className={styles.status}>Carregando...</p>}

        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

        {!loading && !error && questoes.length === 0 && (
          <p className={styles.status}>Nenhuma questão encontrada.</p>
        )}

        {!loading && !error && questoes.length > 0 && (
          <div className={styles.list}>
            {questoes.map((questao) => {
              const respostaCorreta = getRespostaCorreta(questao);
              const aberta = questaoAberta === questao.id;

              return (
                <article className={styles.card} key={questao.id}>
                  <div className={styles.vestibular}>
                    <span>Vestibular</span>
                    <strong>{questao.vestibular || "Não informado"}</strong>
                    {questao.ano && <small>{questao.ano}</small>}
                    {questao.nivel && <small>{questao.nivel}</small>}
                  </div>

                  <div className={styles.enunciado}>
                    <span>Enunciado</span>
                    <h3>{questao.enunciado}</h3>

                    {questao.alternativas?.length > 0 && (
                      <div className={styles.alternativas}>
                        {questao.alternativas.map((alternativa) => (
                          <p key={`${questao.id}-${alternativa.letra}`}>
                            <strong>{alternativa.letra})</strong>{" "}
                            {alternativa.texto}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.answerButton}
                      onClick={() => alternarResposta(questao.id)}
                      aria-expanded={aberta}
                    >
                      {aberta
                        ? "Ocultar resposta"
                        : "Mostrar resposta e explicação"}
                    </button>

                    <button
                      type="button"
                      className={styles.pdfButton}
                      onClick={() => gerarPdfQuestao(questao)}
                    >
                      Baixar PDF
                    </button>
                  </div>

                  {aberta && (
                    <div className={styles.answerBox}>
                      <div>
                        <span>Resposta</span>
                        <p>
                          {respostaCorreta
                            ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
                            : "Resposta não cadastrada."}
                        </p>
                      </div>

                      <div>
                        <span>Explicação</span>
                        <p>
                          {questao.explicacao || "Explicação não cadastrada."}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
