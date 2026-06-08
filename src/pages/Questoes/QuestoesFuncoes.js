import jsPDF from "jspdf";

const MARGEM = 15;
const LARGURA_TEXTO = 180;
const Y_INICIAL = 20;
const LIMITE_PAGINA = 275;

export function getRespostaCorreta(questao) {
  return questao.alternativas?.find((alternativa) => alternativa.correta) || null;
}

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getEnunciadoLimpo(questao) {
  const texto = questao.enunciado?.trim() || "";
  const alternativas = questao.alternativas || [];
  const primeiraLetra = alternativas[0]?.letra;

  if (!texto || !primeiraLetra) {
    return texto;
  }

  const inicioAlternativas = texto.search(
    new RegExp(`\\s+${escaparRegex(primeiraLetra)}[\\).]\\s+`, "i"),
  );

  if (inicioAlternativas < 0) {
    return texto;
  }

  const trechoAlternativas = texto.slice(inicioAlternativas);
  const totalMarcadores = alternativas.filter((alternativa) => {
    if (!alternativa.letra) {
      return false;
    }

    const marcador = new RegExp(
      `(^|\\s)${escaparRegex(alternativa.letra)}[\\).]\\s+`,
      "i",
    );

    return marcador.test(trechoAlternativas);
  }).length;

  return totalMarcadores >= Math.min(2, alternativas.length)
    ? texto.slice(0, inicioAlternativas).trim()
    : texto;
}

export function montarUrlQuestoes(filtros) {
  const params = new URLSearchParams();
  const campos = {
    q: filtros.busca,
    nivel: filtros.nivel,
    ano: filtros.ano,
    id: filtros.questaoId,
    vestibular_id: filtros.vestibularId,
  };

  Object.entries(campos).forEach(([nome, valor]) => {
    const valorLimpo = String(valor || "").trim();

    if (valorLimpo) {
      params.set(nome, valorLimpo);
    }
  });

  const query = params.toString();
  return query ? `/api/questoes?${query}` : "/api/questoes";
}

export function formatarVestibular(vestibular) {
  const partes = [vestibular.nome, vestibular.ano].filter(Boolean);
  return partes.length ? partes.join(" - ") : `Vestibular ${vestibular.id}`;
}

export function getAnosDisponiveis(anos) {
  return [...new Set(anos.map((item) => item.ano).filter(Boolean))];
}

export function getIdsDisponiveis(ids) {
  return [
    ...new Set(
      ids
        .map((item) => item.id)
        .filter((id) => id !== null && id !== undefined),
    ),
  ];
}

export function getVestibularesDisponiveis(vestibulares) {
  return vestibulares.filter((vestibular) => vestibular.id && vestibular.nome);
}

export function getQuestoesSelecionadasVisiveis(questoes, selecionadas) {
  return questoes.filter((questao) => selecionadas.includes(questao.id));
}

export function alternarItemSelecionado(itens, item) {
  return itens.includes(item)
    ? itens.filter((itemAtual) => itemAtual !== item)
    : [...itens, item];
}

export function selecionarTodasQuestoes(questoes, todasSelecionadas) {
  return todasSelecionadas ? [] : questoes.map((questao) => questao.id);
}

function criarEscritorPdf(titulo) {
  const pdf = new jsPDF();
  let y = Y_INICIAL;

  function garantirEspaco(altura = 14) {
    if (y + altura > LIMITE_PAGINA) {
      pdf.addPage();
      y = Y_INICIAL;
    }
  }

  function escreverCabecalho(texto) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(texto, MARGEM, y);
    y += 14;
  }

  function escreverTitulo(texto) {
    garantirEspaco(12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(texto, MARGEM, y);
    y += 8;
  }

  function escreverTexto(texto) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const linhas = pdf.splitTextToSize(String(texto), LARGURA_TEXTO);
    garantirEspaco(linhas.length * 7 + 5);
    pdf.text(linhas, MARGEM, y);
    y += linhas.length * 7 + 5;
  }

  function escreverTituloQuestao(texto) {
    garantirEspaco(28);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(texto, MARGEM, y);
    y += 10;
  }

  escreverCabecalho(titulo);

  return {
    escreverTitulo,
    escreverTexto,
    escreverTituloQuestao,
    pularLinha: () => {
      y += 4;
    },
    salvar: (nomeArquivo) => pdf.save(nomeArquivo),
  };
}

function getTextoVestibular(questao) {
  const vestibular = questao.vestibular || "Não informado";
  return questao.ano ? `${vestibular} - ${questao.ano}` : vestibular;
}

function getTextoResposta(questao) {
  const respostaCorreta = getRespostaCorreta(questao);

  return respostaCorreta
    ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
    : "Resposta não cadastrada.";
}

function escreverQuestaoNoPdf(escritor, questao) {
  escritor.escreverTitulo("Vestibular:");
  escritor.escreverTexto(getTextoVestibular(questao));

  escritor.escreverTitulo("Enunciado:");
  escritor.escreverTexto(getEnunciadoLimpo(questao) || "Enunciado não informado.");

  if (questao.alternativas?.length) {
    escritor.escreverTitulo("Alternativas:");

    questao.alternativas.forEach((alternativa) => {
      escritor.escreverTexto(`${alternativa.letra}) ${alternativa.texto}`);
    });
  }

  escritor.escreverTitulo("Resposta:");
  escritor.escreverTexto(getTextoResposta(questao));

  escritor.escreverTitulo("Explicação:");
  escritor.escreverTexto(questao.explicacao || "Explicação não cadastrada.");
}

export function gerarPdfQuestao(questao) {
  const escritor = criarEscritorPdf("Questão de Matemática");

  escreverQuestaoNoPdf(escritor, questao);
  escritor.salvar(`questao-${questao.id || "matematica"}.pdf`);
}

export function gerarPdfQuestoesSelecionadas(questoes) {
  if (questoes.length === 0) {
    return;
  }

  const escritor = criarEscritorPdf("Questões de Matemática");

  questoes.forEach((questao, index) => {
    escritor.escreverTituloQuestao(`Questão ${index + 1} - ID ${questao.id}`);
    escreverQuestaoNoPdf(escritor, questao);

    if (index < questoes.length - 1) {
      escritor.pularLinha();
    }
  });

  escritor.salvar(`questoes-matematica-${questoes.length}.pdf`);
}
