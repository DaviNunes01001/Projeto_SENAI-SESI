import { useState } from "react";
import jsPDF from "jspdf";
import useApi from "../../hooks/useApi";
import styles from "./Questoes.module.css";

export default function Questoes() {
  const [busca, setBusca] = useState("");
  const { data: questoes, loading, error, reload } = useApi("/api/pesquisa");

  function pesquisarQuestoes(event) {
    event.preventDefault();

    const termo = busca.trim();

    if (!termo) {
      reload("/api/pesquisa");
      return;
    }

    reload(`/api/pesquisa?q=${encodeURIComponent(termo)}`);
  }

  function limparBusca() {
    setBusca("");
    reload("/api/pesquisa");
  }

  function gerarPdfQuestao(questao) {
      const pdf = new jsPDF();

      const margem = 15;
      const larguraTexto = 180;
      let y = 20;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Questão de Matemática", margem, y);

      y += 12;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      if (questao.topico) {
        pdf.text(`Tópico: ${questao.topico}`, margem, y);
        y += 7;
      }

      if (questao.subtopico) {
        pdf.text(`Subtópico: ${questao.subtopico}`, margem, y);
        y += 7;
      }

      if (questao.nivel) {
        pdf.text(`Nível: ${questao.nivel}`, margem, y);
        y += 7;
      }

      if (questao.vestibular) {
        pdf.text(`Vestibular: ${questao.vestibular}`, margem, y);
        y += 7;
      }

      if (questao.ano) {
        pdf.text(`Ano: ${questao.ano}`, margem, y);
        y += 7;
      }

      y += 6;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Enunciado:", margem, y);

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      const enunciado = pdf.splitTextToSize(
        questao.enunciado || "Enunciado não informado.",
        larguraTexto
      );

      pdf.text(enunciado, margem, y);
      y += enunciado.length * 7 + 6;

      if (questao.alternativas && questao.alternativas.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Alternativas:", margem, y);
        y += 8;

        pdf.setFont("helvetica", "normal");

        questao.alternativas.forEach((alternativa) => {
          const textoAlternativa = `${alternativa.letra}) ${alternativa.texto}`;
          const linhas = pdf.splitTextToSize(textoAlternativa, larguraTexto);

          if (y > 270) {
            pdf.addPage();
            y = 20;
          }

          pdf.text(linhas, margem, y);
          y += linhas.length * 7;
        });

        y += 6;
      }

      if (questao.explicacao) {
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text("Explicação:", margem, y);

        y += 8;

        pdf.setFont("helvetica", "normal");

        const explicacao = pdf.splitTextToSize(questao.explicacao, larguraTexto);
        pdf.text(explicacao, margem, y);
      }

      const nomeArquivo = `questao-${questao.id || "matematica"}.pdf`;

      pdf.save(nomeArquivo);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>Matemática</span>

        <h1>Questões de Matemática</h1>

        <p>
          Pesquise questões cadastradas no banco de dados pelo enunciado.
        </p>

        <form className={styles.searchForm} onSubmit={pesquisarQuestoes}>
          <input
            type="text"
            placeholder="Pesquisar por enunciado..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

          <button type="submit">Buscar</button>

          {busca && (
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
            {questoes.map((questao) => (
              <article className={styles.card} key={questao.id}>
                <div className={styles.meta}>
                  {questao.topico && <span>{questao.topico}</span>}
                  {questao.subtopico && <span>{questao.subtopico}</span>}
                  {questao.nivel && <span>{questao.nivel}</span>}
                </div>

                <h3>{questao.enunciado}</h3>

                <div className={styles.details}>
                  {questao.vestibular && <p>Vestibular: {questao.vestibular}</p>}
                  {questao.ano && <p>Ano: {questao.ano}</p>}
                  {questao.explicacao && <p>Explicação: {questao.explicacao}</p>}
                </div>

                <button
                  type="button"
                  className={styles.pdfButton}
                  onClick={() => gerarPdfQuestao(questao)}
                >
                  Baixar PDF
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
