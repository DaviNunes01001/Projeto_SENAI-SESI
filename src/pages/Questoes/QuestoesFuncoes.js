import jsPDF from "jspdf";

// Constantes para configuração de PDF
// Por que: Centraliza valores mágicos para fácil ajuste de layout
const MARGEM = 15;           // Espaçamento das margens do PDF
const LARGURA_TEXTO = 180;   // Largura máxima de texto no PDF
const Y_INICIAL = 20;        // Posição Y inicial na primeira página
const LIMITE_PAGINA = 275;   // Quando atingir esta Y, cria nova página

// Função: Obtém a alternativa marcada como correta de uma questão
// O que faz: Busca no array de alternativas qual tem correta=true
// Como: Usa find com verificação de booleano
// Por que: Necessário para exibir resposta correta ao usuário
export function getRespostaCorreta(questao) {
  return questao.alternativas?.find((alternativa) => alternativa.correta) || null;
}

// Função: Escapa caracteres especiais de regex
// O que faz: Adiciona backslash antes de caracteres especiais
// Como: Usa replace com regex que encontra caracteres especiais
// Por que: Previne erros ao usar string em regex (busca de marcadores A), B), etc)
function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Função: Extrai apenas o enunciado da questão, removendo alternativas
// O que faz: Remove a parte com alternativas (A), B), C), etc) do texto
// Como: Busca posição do primeiro marcador de alternativa, corta a string
// Por que: Exibe enunciado limpo sem alternativas duplicadas
export function getEnunciadoLimpo(questao) {
  const texto = questao.enunciado?.trim() || "";
  const alternativas = questao.alternativas || [];
  const primeiraLetra = alternativas[0]?.letra;

  // Se não há texto ou alternativas, retorna texto como está
  if (!texto || !primeiraLetra) {
    return texto;
  }

  // Busca posição onde começa a primeira alternativa (ex: "A)")
  const inicioAlternativas = texto.search(
    new RegExp(`\\s+${escaparRegex(primeiraLetra)}[\\).]\\s+`, "i"),
  );

  // Se não encontrou marcador, retorna texto inteiro
  if (inicioAlternativas < 0) {
    return texto;
  }

  // Extrai apenas a parte com alternativas para validar
  const trechoAlternativas = texto.slice(inicioAlternativas);

  // Conta quantas alternativas realmente existem neste trecho
  const totalMarcadores = alternativas.filter((alternativa) => {
    if (!alternativa.letra) {
      return false;
    }

    // Valida se o marcador (ex: "A)") existe no trecho
    const marcador = new RegExp(
      `(^|\\s)${escaparRegex(alternativa.letra)}[\\).]\\s+`,
      "i",
    );

    return marcador.test(trechoAlternativas);
  }).length;

  // Se há pelo menos 2 alternativas válidas, considera que alternativas estão dentro do enunciado
  // Por isso, retorna só o enunciado sem alternativas
  return totalMarcadores >= Math.min(2, alternativas.length)
    ? texto.slice(0, inicioAlternativas).trim()
    : texto;
}

// Função: Monta URL de requisição para listar questões com filtros
// O que faz: Constrói query string com parâmetros de filtro
// Como: Usa URLSearchParams, adiciona filtros não-vazios
// Por que: Centraliza construção de URLs para requisições da API
export function montarUrlQuestoes(filtros) {
  const params = new URLSearchParams();

  // Mapa de nomes de filtros no objeto local vs parâmetro na API
  const campos = {
    q: filtros.busca,
    nivel: filtros.nivel,
    ano: filtros.ano,
    id: filtros.questaoId,
    vestibular_id: filtros.vestibularId,
  };

  // Adiciona cada filtro não-vazio aos parâmetros
  Object.entries(campos).forEach(([nome, valor]) => {
    const valorLimpo = String(valor || "").trim();

    if (valorLimpo) {
      params.set(nome, valorLimpo);
    }
  });

  // Retorna URL com query string ou apenas /api/questoes se nenhum filtro
  const query = params.toString();
  return query ? `/api/questoes?${query}` : "/api/questoes";
}

// Função: Formata dados de vestibular para exibição
// O que faz: Combina nome do vestibular com ano (ex: "ENEM - 2023")
// Como: Filtra valores não-vazios e junta com " - "
// Por que: Exibe informação clara sobre origem da questão
export function formatarVestibular(vestibular) {
  const partes = [vestibular.nome, vestibular.ano].filter(Boolean);
  return partes.length ? partes.join(" - ") : `Vestibular ${vestibular.id}`;
}

// Função: Obtém lista única de anos disponíveis
// O que faz: Remove duplicatas de anos do array de objetos
// Como: Usa Set com map para extrair anos únicos
// Por que: Necessário para dropdown de filtro de anos sem repetição
export function getAnosDisponiveis(anos) {
  return [...new Set(anos.map((item) => item.ano).filter(Boolean))];
}

// Função: Obtém lista única de IDs disponíveis
// O que faz: Remove duplicatas e valores inválidos de IDs
// Como: Usa Set com filter para remover null/undefined/duplicatas
// Por que: Necessário para validação e dropdown sem repetição
export function getIdsDisponiveis(ids) {
  return [
    ...new Set(
      ids
        .map((item) => item.id)
        .filter((id) => id !== null && id !== undefined),
    ),
  ];
}

// Função: Filtra vestibulares válidos (que têm id e nome)
// O que faz: Remove vestibulares incompletos
// Como: Retorna apenas vestibulares que têm id E nome
// Por que: Evita exibir vestibulares sem informação no dropdown
export function getVestibularesDisponiveis(vestibulares) {
  return vestibulares.filter((vestibular) => vestibular.id && vestibular.nome);
}

// Função: Filtra questões que estão no array de selecionadas
// O que faz: Retorna apenas questões cujo ID está em selecionadas
// Como: Usa filter com includes
// Por que: Obter apenas questões para download/impressão selecionadas
export function getQuestoesSelecionadasVisiveis(questoes, selecionadas) {
  return questoes.filter((questao) => selecionadas.includes(questao.id));
}

// Função: Alterna (adiciona ou remove) um item de uma lista
// O que faz: Se item existe, remove; se não existe, adiciona
// Como: Usa includes e filter ou spread operator
// Por que: Implementa toggle para checkbox de seleção de questão
export function alternarItemSelecionado(itens, item) {
  return itens.includes(item)
    ? itens.filter((itemAtual) => itemAtual !== item)
    : [...itens, item];
}

// Função: Seleciona todas as questões ou nenhuma
// O que faz: Se todasSelecionadas é true, limpa lista; se false, adiciona todas
// Como: Retorna array vazio ou array de todos os IDs
// Por que: Implementa checkbox "Selecionar Tudo"
export function selecionarTodasQuestoes(questoes, todasSelecionadas) {
  return todasSelecionadas ? [] : questoes.map((questao) => questao.id);
}

// Função: Retorna objeto de formulário vazio para criar nova questão
// O que faz: Cria template com campos vazios e valores padrão
// Como: Retorna objeto com campos de questão
// Por que: Inicializa formulário quando professor clica "Criar Questão"
export function getFormularioQuestaoVazio() {
  return {
    id: "",
    enunciado: "",
    explicacao: "",
    subtopico_id: "1",
    vestibular_id: "1",
    avaliacao_id: "1",
    tipo: "base",
    conteudo: "",
  };
}

// Função: Converte questão do banco para objeto de formulário
// O que faz: Mapeia campos de questão para estrutura de form
// Como: Converte valores para string e usa defaults
// Por que: Preenche formulário quando professor edita questão
export function montarFormularioQuestao(questao) {
  return {
    id: String(questao.id || ""),
    enunciado: questao.enunciado || "",
    explicacao: questao.explicacao || "",
    subtopico_id: String(questao.subtopico_id || questao.topicoid || "1"),
    vestibular_id: String(questao.vestibular_id || "1"),
    avaliacao_id: String(questao.avaliacao_id || "1"),
    tipo: questao.tipo || "base",
    conteudo: questao.conteudo || "",
  };
}

// Função auxiliar: Limpa string removendo espaços e retornando undefined se vazia
// O que faz: Normaliza valor de texto
// Como: Trim, retorna undefined se vazio
// Por que: Evita enviar strings vazias para API
function limparTexto(valor) {
  const texto = String(valor || "").trim();
  return texto || undefined;
}

// Função auxiliar: Converte para número inteiro positivo
// O que faz: Valida número e retorna undefined se inválido
// Como: Number(), verifica isInteger e > 0
// Por que: Garante que IDs/números são válidos antes de enviar
function limparNumero(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}

// Função: Monta dados de questão do formulário para enviar ao servidor
// O que faz: Limpa e valida todos os campos do formulário
// Como: Chama limparTexto/limparNumero para cada campo
// Por que: Garante que dados enviados são válidos antes do POST/PUT
function montarDadosFormularioQuestao(formulario) {
  const enunciado = limparTexto(formulario.enunciado);

  return {
    enunciado,
    explicacao: limparTexto(formulario.explicacao),
    subtopico_id: limparNumero(formulario.subtopico_id),
    vestibular_id: limparNumero(formulario.vestibular_id),
    avaliacao_id: limparNumero(formulario.avaliacao_id),
    tipo: limparTexto(formulario.tipo),
    conteudo: limparTexto(formulario.conteudo) || enunciado,
  };
}

// Função auxiliar: Parseia JSON de resposta com fallback
// O que faz: Tenta parsear JSON, retorna {} se falhar
// Como: Try/catch JSON.parse
// Por que: Garante que sempre tem um objeto para acessar mensagens de erro
async function lerResposta(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// Função: Salva nova questão ou atualiza existente (professor)
// O que faz: Faz POST (criar) ou PUT (atualizar) de questão
// Como: Valida dados, monta request, envia para API
// Por que: Permite profesores criarem/editarem questões
export async function salvarQuestaoProfessor(modo, formulario) {
  const editando = modo === "atualizar";
  const id = limparNumero(formulario.id);
  const dados = montarDadosFormularioQuestao(formulario);

  // Se editando, ID é obrigatório
  if (editando && !id) {
    throw new Error("ID da questão inválido.");
  }

  // Se criando, enunciado é obrigatório
  if (!editando && !dados.enunciado) {
    throw new Error("Informe o enunciado da questão.");
  }

  // Se criando, subtópico é obrigatório
  if (!editando && !dados.subtopico_id) {
    throw new Error("Informe o ID do subtópico.");
  }

  // Faz requisição PUT (atualizar) ou POST (criar)
  const response = await fetch(editando ? `/api/questoes/${id}` : "/api/questoes", {
    method: editando ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  const resultado = await lerResposta(response);

  // Se falhar, lança erro com mensagem do servidor
  if (!response.ok) {
    throw new Error(resultado.mensagem || "Não foi possível salvar a questão.");
  }

  return resultado;
}

// Função: Deleta uma questão (professor)
// O que faz: Faz DELETE request para remover questão
// Como: Envia DELETE para /api/questoes/{id}
// Por que: Permite professores removerem questões
export async function deletarQuestaoProfessor(id) {
  const response = await fetch(`/api/questoes/${id}`, {
    method: "DELETE",
  });
  const resultado = await lerResposta(response);

  // Se falhar, lança erro com mensagem do servidor
  if (!response.ok) {
    throw new Error(resultado.mensagem || "Não foi possível deletar a questão.");
  }

  return resultado;
}

// Função: Cria objeto com métodos para escrever em PDF
// O que faz: Inicializa PDF, fornece funções para escrever diferentes tipos de texto
// Como: Usa jsPDF, rastreia posição Y, garante espaço para próximo elemento
// Por que: Centraliza lógica de escrita em PDF para evitar repetição
function criarEscritorPdf(titulo) {
  const pdf = new jsPDF();
  let y = Y_INICIAL;

  // Função interna: Garante que há espaço para novo elemento, cria página se necessário
  // O que faz: Se próximo elemento não cabe, cria nova página e reseta Y
  // Como: Verifica se y + altura > LIMITE_PAGINA
  // Por que: Evita que texto saia da página
  function garantirEspaco(altura = 14) {
    if (y + altura > LIMITE_PAGINA) {
      pdf.addPage();
      y = Y_INICIAL;
    }
  }

  // Função interna: Escreve cabeçalho (título principal)
  function escreverCabecalho(texto) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(texto, MARGEM, y);
    y += 14;
  }

  // Função interna: Escreve título de seção
  function escreverTitulo(texto) {
    garantirEspaco(12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(texto, MARGEM, y);
    y += 8;
  }

  // Função interna: Escreve corpo de texto com quebra automática de linhas
  function escreverTexto(texto) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    // Quebra texto para caber na largura máxima
    const linhas = pdf.splitTextToSize(String(texto), LARGURA_TEXTO);
    garantirEspaco(linhas.length * 7 + 5);
    pdf.text(linhas, MARGEM, y);
    y += linhas.length * 7 + 5;
  }

  // Função interna: Escreve título de questão individual
  function escreverTituloQuestao(texto) {
    garantirEspaco(28);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(texto, MARGEM, y);
    y += 10;
  }

  // Escreve cabeçalho do documento
  escreverCabecalho(titulo);

  // Retorna objeto com métodos públicos para escritor
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

// Função auxiliar: Formata texto do vestibular para exibição no PDF
// O que faz: Combina nome do vestibular com ano
// Como: Concatena ou retorna apenas nome se ano não existe
// Por que: Exibe informação clara da origem da questão
function getTextoVestibular(questao) {
  const vestibular = questao.vestibular || "Não informado";
  return questao.ano ? `${vestibular} - ${questao.ano}` : vestibular;
}

// Função auxiliar: Formata resposta correta para exibição
// O que faz: Retorna "letra) texto" da resposta ou mensagem se não tem
// Como: Busca resposta correta e formata
// Por que: Exibe resposta de forma clara no PDF
function getTextoResposta(questao) {
  const respostaCorreta = getRespostaCorreta(questao);

  return respostaCorreta
    ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
    : "Resposta não cadastrada.";
}

// Função auxiliar: Escreve uma questão completa no PDF
// O que faz: Escreve vestibular, enunciado, alternativas, resposta, explicação
// Como: Chama métodos do escritor para cada seção
// Por que: Reutiliza lógica quando gera PDF de múltiplas questões
function escreverQuestaoNoPdf(escritor, questao) {
  escritor.escreverTitulo("Vestibular:");
  escritor.escreverTexto(getTextoVestibular(questao));

  escritor.escreverTitulo("Enunciado:");
  escritor.escreverTexto(getEnunciadoLimpo(questao) || "Enunciado não informado.");

  // Se existem alternativas, escreve cada uma
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

// Função: Gera PDF de uma única questão
// O que faz: Cria arquivo PDF com dados da questão
// Como: Cria escritor, escreve questão, salva com nome "questao-{id}.pdf"
// Por que: Permite download de questão individual
export function gerarPdfQuestao(questao) {
  const escritor = criarEscritorPdf("Questão de Matemática");

  escreverQuestaoNoPdf(escritor, questao);
  escritor.salvar(`questao-${questao.id || "matematica"}.pdf`);
}

// Função: Gera PDF com múltiplas questões selecionadas
// O que faz: Cria arquivo PDF com várias questões
// Como: Cria escritor, itera questões, escreve cada uma, salva como "questoes-matematica-{quantidade}.pdf"
// Por que: Permite download de múltiplas questões para impressão/estudo
export function gerarPdfQuestoesSelecionadas(questoes) {
  // Se não há questões selecionadas, não faz nada
  if (questoes.length === 0) {
    return;
  }

  const escritor = criarEscritorPdf("Questões de Matemática");

  // Escreve cada questão com número e ID
  questoes.forEach((questao, index) => {
    escritor.escreverTituloQuestao(`Questão ${index + 1} - ID ${questao.id}`);
    escreverQuestaoNoPdf(escritor, questao);

    // Pula linha entre questões, mas não após a última
    if (index < questoes.length - 1) {
      escritor.pularLinha();
    }
  });

  // Salva PDF com nome incluindo quantidade de questões
  escritor.salvar(`questoes-matematica-${questoes.length}.pdf`);
}
