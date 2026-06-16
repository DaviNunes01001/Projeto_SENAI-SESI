import jsPDF from "jspdf";

const MARGEM = 15;
const LARGURA_TEXTO = 180;
const Y_INICIAL = 20;
const LIMITE_PAGINA = 275;
const ANO_INICIAL_FILTRO = 2010;

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
  const anoAtual = new Date().getFullYear();
  const totalAnosPadrao = Math.max(0, anoAtual - ANO_INICIAL_FILTRO + 1);
  const anosPadrao = Array.from(
    { length: totalAnosPadrao },
    (_, index) => anoAtual - index,
  );
  const anosApi = anos
    .map((item) => Number(item.ano))
    .filter((ano) => Number.isInteger(ano) && ano > 0);

  return [...new Set([...anosApi, ...anosPadrao])].sort((a, b) => b - a);
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

export function getFormularioQuestaoVazio() {
  return {
    id: "",
    enunciado: "",
    explicacao: "",
    subtopico_id: "1",
    vestibular_id: "",
    ano: "",
    avaliacao_id: "1",
    tipo: "base",
    conteudo: "",
  };
}

export function montarFormularioQuestao(questao) {
  return {
    id: String(questao.id || ""),
    enunciado: questao.enunciado || "",
    explicacao: questao.explicacao || "",
    subtopico_id: String(questao.subtopico_id || questao.topicoid || "1"),
    vestibular_id: String(questao.vestibular_id || ""),
    ano: String(questao.ano || ""),
    avaliacao_id: String(questao.avaliacao_id || "1"),
    tipo: questao.tipo || "base",
    conteudo: questao.conteudo || "",
  };
}

function limparTexto(valor) {
  const texto = String(valor || "").trim();
  return texto || undefined;
}

function limparNumero(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}

function montarDadosFormularioQuestao(formulario) {
  const enunciado = limparTexto(formulario.enunciado);

  return {
    enunciado,
    explicacao: limparTexto(formulario.explicacao),
    subtopico_id: limparNumero(formulario.subtopico_id),
    vestibular_id: limparNumero(formulario.vestibular_id),
    ano: limparNumero(formulario.ano),
    avaliacao_id: limparNumero(formulario.avaliacao_id),
    tipo: limparTexto(formulario.tipo),
    conteudo: limparTexto(formulario.conteudo) || enunciado,
  };
}

async function lerResposta(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function salvarQuestaoProfessor(modo, formulario) {
  const editando = modo === "atualizar";
  const id = limparNumero(formulario.id);
  const dados = montarDadosFormularioQuestao(formulario);

  if (editando && !id) {
    throw new Error("ID da questão inválido.");
  }

  if (!editando && !dados.enunciado) {
    throw new Error("Informe o enunciado da questão.");
  }

  if (!editando && !dados.subtopico_id) {
    throw new Error("Informe o ID do subtópico.");
  }

  const response = await fetch(editando ? `/api/questoes/${id}` : "/api/questoes", {
    method: editando ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  const resultado = await lerResposta(response);

  if (!response.ok) {
    throw new Error(resultado.mensagem || "Não foi possível salvar a questão.");
  }

  return resultado;
}

export async function deletarQuestaoProfessor(id) {
  const response = await fetch(`/api/questoes/${id}`, {
    method: "DELETE",
  });
  const resultado = await lerResposta(response);

  if (!response.ok) {
    throw new Error(resultado.mensagem || "Não foi possível deletar a questão.");
  }

  return resultado;
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
