import jsPDF from "jspdf";
import { useState } from "react";
import useApi from "../../hooks/useApi";
import styles from "./Questoes.module.css";

function getRespostaCorreta(questao) {
  return questao.alternativas?.find((alternativa) => alternativa.correta);
}

function escapeRegExp(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getEnunciadoLimpo(questao) {
  const texto = questao.enunciado?.trim() || "";
  const alternativas = questao.alternativas || [];
  const primeiraLetra = alternativas[0]?.letra;

  if (!texto || !primeiraLetra) {
    return texto;
  }

  const primeiroMarcador = new RegExp(
    `\\s+${escapeRegExp(primeiraLetra)}[\\).]\\s+`,
    "i",
  );
  const inicioAlternativas = texto.search(primeiroMarcador);

  if (inicioAlternativas < 0) {
    return texto;
  }

  const trechoAlternativas = texto.slice(inicioAlternativas);
  const totalMarcadores = alternativas.reduce((total, alternativa) => {
    if (!alternativa.letra) {
      return total;
    }

    const marcador = new RegExp(
      `(^|\\s)${escapeRegExp(alternativa.letra)}[\\).]\\s+`,
      "i",
    );

    return marcador.test(trechoAlternativas) ? total + 1 : total;
  }, 0);

  if (totalMarcadores < Math.min(2, alternativas.length)) {
    return texto;
  }

  return texto.slice(0, inicioAlternativas).trim();
}

function montarUrlQuestoes(busca, nivel, ano, questaoId, vestibularId) {
  const params = new URLSearchParams();
  const termo = busca.trim();
  const anoFiltro = ano.trim();
  const idFiltro = questaoId.trim();
  const vestibularFiltro = vestibularId.trim();

  if (termo) {
    params.set("q", termo);
  }

  if (nivel) {
    params.set("nivel", nivel);
  }

  if (anoFiltro) {
    params.set("ano", anoFiltro);
  }

  if (idFiltro) {
    params.set("id", idFiltro);
  }

  if (vestibularFiltro) {
    params.set("vestibular_id", vestibularFiltro);
  }

  const query = params.toString();
  return query ? `/api/questoes?${query}` : "/api/questoes";
}

function formatarVestibular(vestibular) {
  const partes = [vestibular.nome, vestibular.ano].filter(Boolean);
  return partes.length ? partes.join(" - ") : `Vestibular ${vestibular.id}`;
}

export default function Questoes() {
  const [busca, setBusca] = useState("");
  const [questaoId, setQuestaoId] = useState("");
  const [vestibularId, setVestibularId] = useState("");
  const [nivel, setNivel] = useState("");
  const [ano, setAno] = useState("");
  const [questaoAberta, setQuestaoAberta] = useState(null);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const { data: questoes, loading, error, reload } = useApi("/api/questoes");
  const { data: anos } = useApi("/api/questoes/anos");
  const { data: ids } = useApi("/api/questoes/ids");
  const { data: vestibulares } = useApi("/api/questoes/vestibulares");
  const anosDisponiveis = [
    ...new Set(anos.map((item) => item.ano).filter(Boolean)),
  ];
  const idsDisponiveis = [...new Set(ids.map((item) => item.id))];
  const vestibularesDisponiveis = vestibulares.filter(
    (vestibular) => vestibular.id && vestibular.nome,
  );
  const questoesSelecionadasVisiveis = questoes.filter((questao) =>
    questoesSelecionadas.includes(questao.id),
  );
  const todasQuestoesSelecionadas =
    questoes.length > 0 && questoesSelecionadasVisiveis.length === questoes.length;

  function pesquisarQuestoes(event) {
    event.preventDefault();
    setQuestaoAberta(null);
    setQuestoesSelecionadas([]);
    reload(montarUrlQuestoes(busca, nivel, ano, questaoId, vestibularId));
  }

  function limparBusca() {
    setBusca("");
    setQuestaoId("");
    setVestibularId("");
    setNivel("");
    setAno("");
    setQuestaoAberta(null);
    setQuestoesSelecionadas([]);
    reload("/api/questoes");
  }

  function alternarResposta(id) {
    setQuestaoAberta((atual) => (atual === id ? null : id));
  }

  function alternarSelecaoQuestao(id) {
    setQuestoesSelecionadas((atuais) =>
      atuais.includes(id)
        ? atuais.filter((questaoIdSelecionada) => questaoIdSelecionada !== id)
        : [...atuais, id],
    );
  }

  function alternarTodasQuestoes() {
    setQuestoesSelecionadas(
      todasQuestoesSelecionadas ? [] : questoes.map((questao) => questao.id),
    );
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
    escreverTexto(getEnunciadoLimpo(questao) || "Enunciado não informado.");

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

  function gerarPdfQuestoesSelecionadas() {
    const questoesParaPdf = questoesSelecionadasVisiveis;

    if (questoesParaPdf.length === 0) {
      return;
    }

    const pdf = new jsPDF();
    const margem = 15;
    const larguraTexto = 180;
    let y = 20;

    function garantirEspaco(altura = 14) {
      if (y + altura > 275) {
        pdf.addPage();
        y = 20;
      }
    }

    function escreverTitulo(texto) {
      garantirEspaco(12);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(texto, margem, y);
      y += 8;
    }

    function escreverTexto(texto) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const linhas = pdf.splitTextToSize(String(texto), larguraTexto);
      garantirEspaco(linhas.length * 7 + 5);
      pdf.text(linhas, margem, y);
      y += linhas.length * 7 + 5;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Questões de Matemática", margem, y);
    y += 14;

    questoesParaPdf.forEach((questao, index) => {
      garantirEspaco(28);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.text(`Questão ${index + 1} - ID ${questao.id}`, margem, y);
      y += 10;

      escreverTitulo("Vestibular:");
      escreverTexto(
        `${questao.vestibular || "Não informado"}${
          questao.ano ? ` - ${questao.ano}` : ""
        }`,
      );

      escreverTitulo("Enunciado:");
      escreverTexto(getEnunciadoLimpo(questao) || "Enunciado não informado.");

      if (questao.alternativas?.length) {
        escreverTitulo("Alternativas:");

        questao.alternativas.forEach((alternativa) => {
          escreverTexto(`${alternativa.letra}) ${alternativa.texto}`);
        });
      }

      const respostaCorreta = getRespostaCorreta(questao);
      escreverTitulo("Resposta:");
      escreverTexto(
        respostaCorreta
          ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
          : "Resposta não cadastrada.",
      );

      escreverTitulo("Explicação:");
      escreverTexto(questao.explicacao || "Explicação não cadastrada.");

      if (index < questoesParaPdf.length - 1) {
        y += 4;
      }
    });

    pdf.save(`questoes-matematica-${questoesParaPdf.length}.pdf`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>Matemática</span>

        <h1>Questões de Matemática</h1>

        <p>Pesquise questões cadastradas no banco de dados pelo enunciado, vestibular, ano ou nível.</p>

        <form className={styles.searchForm} onSubmit={pesquisarQuestoes}>
          <input
            type="text"
            placeholder="Pesquisar por enunciado..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

          <label className={styles.levelFilter}>
            <span>ID</span>
            <select
              value={questaoId}
              onChange={(event) => setQuestaoId(event.target.value)}
            >
              <option value="">Todos</option>
              {idsDisponiveis.map((idDisponivel) => (
                <option key={idDisponivel} value={idDisponivel}>
                  {idDisponivel}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.levelFilter}>
            <span>Vestibular</span>
            <select
              value={vestibularId}
              onChange={(event) => setVestibularId(event.target.value)}
            >
              <option value="">Todos</option>
              {vestibularesDisponiveis.map((vestibular) => (
                <option key={vestibular.id} value={vestibular.id}>
                  {formatarVestibular(vestibular)}
                </option>
              ))}
            </select>
          </label>

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

          {(busca || questaoId || vestibularId || nivel || ano) && (
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
          <div className={styles.contentTitle}>
            <h2>Resultados</h2>
            <p>{questoes.length} questão(ões)</p>
          </div>

          {!loading && !error && questoes.length > 0 && (
            <div className={styles.downloadControls}>
              <label className={styles.bulkSelect}>
                <input
                  type="checkbox"
                  checked={todasQuestoesSelecionadas}
                  onChange={alternarTodasQuestoes}
                />
                <span>Selecionar todas</span>
              </label>

              <span className={styles.selectedCount}>
                {questoesSelecionadasVisiveis.length} selecionada(s)
              </span>

              <button
                type="button"
                onClick={gerarPdfQuestoesSelecionadas}
                disabled={questoesSelecionadasVisiveis.length === 0}
              >
                Baixar selecionadas
              </button>

              {questoesSelecionadasVisiveis.length > 0 && (
                <button
                  type="button"
                  className={styles.clearSelectionButton}
                  onClick={() => setQuestoesSelecionadas([])}
                >
                  Limpar seleção
                </button>
              )}
            </div>
          )}
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
              const selecionada = questoesSelecionadas.includes(questao.id);

              return (
                <article
                  className={`${styles.card} ${
                    selecionada ? styles.selectedCard : ""
                  }`}
                  key={questao.id}
                >
                  <div className={styles.vestibular}>
                    <label className={styles.cardCheckbox}>
                      <input
                        type="checkbox"
                        checked={selecionada}
                        onChange={() => alternarSelecaoQuestao(questao.id)}
                        aria-label={`Selecionar questão ${questao.id}`}
                      />
                      <span>Selecionar</span>
                    </label>

                    <span>Vestibular</span>
                    <strong>{questao.vestibular || "Não informado"}</strong>
                    {questao.ano && <small>{questao.ano}</small>}
                    {questao.nivel && <small>{questao.nivel}</small>}
                  </div>

                  <div className={styles.enunciado}>
                    <span>Enunciado</span>
                    <h3>
                      {getEnunciadoLimpo(questao) || "Enunciado não informado."}
                    </h3>

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
