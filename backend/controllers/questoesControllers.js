// Importa o modelo de questões para acesso ao banco de dados
const questaoModel = require("../models/questoesModels");

// Função: Agrupa alternativas de questões em um único objeto por ID
// O que faz: Reorganiza dados do banco em formato aninhado (questão com alternativas dentro)
// Como: Usa um Map para rastrear questões únicas e acumula alternativas
// Por que: O banco retorna uma linha por alternativa, precisa agrupar para estrutura JSON correta
function agruparAlternativas(linhas) {
  const questoes = new Map();

  linhas.forEach((linha) => {
    const questaoExistente = questoes.get(linha.id);

    const questao = questaoExistente || {
      id: linha.id,
      idc: linha.idc,
      topicoid: linha.topicoid,
      avaliacao_id: linha.avaliacao_id,
      vestibular_id: linha.vestibular_id,
      subtopico_id: linha.subtopico_id,
      enunciado: linha.enunciado,
      tipo: linha.tipo,
      conteudo: linha.conteudo,
      bloco: linha.bloco,
      explicacao: linha.explicacao,
      comentario_especialista: linha.comentario_especialista,
      link_explicacao: linha.link_explicacao,
      link_bib: linha.link_bib,
      nivel: linha.nivel,
      vestibular: linha.vestibular,
      ano: linha.ano,
      topico: linha.topico,
      alternativas: [],
    };

    // Se a linha tiver letra (alternativa), adiciona ao array
    if (linha.letra || linha.texto) {
      questao.alternativas.push({
        letra: linha.letra,
        texto: linha.texto,
        correta: linha.correta,
      });
    }

    questoes.set(linha.id, questao);
  });

  return Array.from(questoes.values());
}

// Função: Valida e converte um ano em número inteiro
// O que faz: Garante que o valor é um ano válido (4 dígitos)
// Como: Converte string para número e valida com regex
// Por que: Previne erros de SQL injection e operações inválidas
function obterAno(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  const anoTexto = String(valor).trim();

  if (!/^\d{4}$/.test(anoTexto)) {
    return null;
  }

  return Number(anoTexto);
}

// Função: Valida e converte um ID em número positivo
// O que faz: Garante que o ID é um inteiro positivo
// Como: Valida com regex e verifica se é > 0
// Por que: Protege contra IDs inválidos (negativos, não-numéricos)
function obterId(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  const idTexto = String(valor).trim();

  if (!/^\d+$/.test(idTexto)) {
    return null;
  }

  const id = Number(idTexto);
  return id > 0 ? id : null;
}

// Rota: GET /api/questoes - Lista todas as questões com filtros opcionais
// O que faz: Retorna questões do banco de dados com filtros (busca, nível, ano, ID, vestibular)
// Como: Valida parâmetros de query, chama model, agrupa alternativas
// Por que: Endpoint principal para listar e filtrar questões na aplicação
async function listarTodas(req, res) {
  try {
    // Valida e extrai parâmetros de query com segurança
    const ano = obterAno(req.query.ano);
    const id = obterId(req.query.id);
    const vestibularId = obterId(req.query.vestibular_id);
    const vestibular =
      typeof req.query.vestibular === "string" ? req.query.vestibular.trim() : "";

    // Retorna erro se o ano foi enviado mas é inválido
    if (req.query.ano && !ano) {
      return res.status(400).json({ mensagem: "Ano invalido" });
    }

    // Retorna erro se o ID foi enviado mas é inválido
    if (req.query.id && !id) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    // Retorna erro se o vestibular_id foi enviado mas é inválido
    if (req.query.vestibular_id && !vestibularId) {
      return res.status(400).json({ mensagem: "Vestibular invalido" });
    }

    // Busca no banco com filtros validados
    const linhas = await questaoModel.listarTodas({
      busca: req.query.q,
      nivel: req.query.nivel,
      ano,
      id,
      vestibularId,
      vestibular,
    });

    // Agrupa alternativas e retorna como JSON
    res.status(200).json(agruparAlternativas(linhas));
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar questoes",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/anos - Lista todos os anos disponíveis no banco
// O que faz: Retorna lista única de anos com questões cadastradas
// Como: Consulta modelo para obter anos distintos
// Por que: Usado para popular dropdown de filtro de anos na interface
async function listarAnos(req, res) {
  try {
    const anos = await questaoModel.listarAnos();
    res.status(200).json(anos);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar anos",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/ids - Lista todos os IDs de questões
// O que faz: Retorna lista de todos os IDs de questões cadastradas
// Como: Consulta modelo para obter IDs
// Por que: Usado para validações e preenchimento de filtros
async function listarIds(req, res) {
  try {
    const ids = await questaoModel.listarIds();
    res.status(200).json(ids);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar ids",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/vestibulares - Lista todos os vestibulares disponíveis
// O que faz: Retorna lista de vestibulares com questões cadastradas
// Como: Consulta modelo para obter vestibulares distintos
// Por que: Usado para popular dropdown de filtro de vestibulares
async function listarVestibulares(req, res) {
  try {
    const vestibulares = await questaoModel.listarVestibulares();
    res.status(200).json(vestibulares);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar vestibulares",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/primeiroSelect - Retorna informações para primeira view
// O que faz: Retorna questões com subtópicos para preenchimento de seletor
// Como: Consulta modelo específica (view)
// Por que: Suporta fluxo de seleção em cascata na interface (primeiro seletor)
async function infos_view(req, res) {
  try {
    const questoes = await questaoModel.infos_view();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar questoes",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/segundoSelect/:chave - Busca questões por palavra-chave e retorna respostas
// O que faz: Busca questões cujo enunciado contém a chave e retorna a resposta correta
// Como: Recebe parâmetro :chave e faz busca case-insensitive com ILIKE
// Por que: Suporta fluxo de seleção em cascata (segundo seletor) para encontrar resposta
async function res(req, res) {
  try {
    // Extrai a chave de busca dos parâmetros de rota
    const chave = req.params.chave;
    const questoes = await questaoModel.res(chave);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/terceiroSelect - Retorna questões agrupadas por tópicos
// O que faz: Retorna todas as questões com seus tópicos/subtópicos para terceiro seletor
// Como: Consulta modelo para obter vista com tópicos
// Por que: Suporta fluxo de seleção em cascata (terceiro seletor)
async function vw_questoes_com_topicos(req, res) {
  try {
    const questoes = await questaoModel.vw_questoes_com_topicos();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar questoes",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/:id - Busca uma questão específica por ID
// O que faz: Retorna uma única questão com todas suas alternativas
// Como: Valida ID, consulta modelo, retorna resultado
// Por que: Necessário para ver detalhes completos de uma questão
async function buscarPorId(req, res) {
  try {
    // Converte e valida o ID
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    // Busca a questão no banco
    const questao = await questaoModel.buscarPorId(id);

    if (questao) {
      res.status(200).json(questao);
    } else {
      res.status(404).json({ mensagem: `Questao ${id} nao encontrada` });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar questao",
      erro: erro.message,
    });
  }
}

// Função auxiliar: Monta objeto com dados de questão do corpo da requisição
// O que faz: Extrai e organiza campos do body da requisição
// Como: Acessa propriedades do objeto body e as copia para novo objeto
// Por que: Padroniza os dados antes de enviar para o modelo (CREATE/UPDATE)
function montarDadosQuestao(body) {
  return {
    avaliacao_id: body.avaliacao_id,
    vestibular_id: body.vestibular_id,
    subtopico_id: body.subtopico_id,
    topicoid: body.topicoid,
    enunciado: body.enunciado,
    tipo: body.tipo,
    conteudo: body.conteudo,
    bloco: body.bloco,
    explicacao: body.explicacao,
    comentario_especialista: body.comentario_especialista,
    link_explicacao: body.link_explicacao,
    link_bib: body.link_bib,
  };
}

// Rota: POST /api/questoes - Cria uma nova questão (professor)
// O que faz: Insere uma questão no banco de dados
// Como: Valida dados obrigatórios, monta objeto, chama model, retorna nova questão
// Por que: Permite professores criarem questões no sistema
async function criar(req, res) {
  try {
    // Monta e valida dados da questão
    const dados = montarDadosQuestao(req.body);

    // Enunciado é obrigatório; subtópico ou tópico é obrigatório
    if (!dados.enunciado || (!dados.subtopico_id && !dados.topicoid)) {
      return res.status(400).json({
        mensagem: "Campos obrigatorios: enunciado e subtopico_id ou topicoid",
      });
    }

    // Cria questão no banco e retorna
    const novaQuestao = await questaoModel.criar(dados);
    res.status(201).json(novaQuestao);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao criar questao",
      erro: erro.message,
    });
  }
}

// Rota: PUT /api/questoes/:id - Atualiza uma questão (professor)
// O que faz: Modifica um questão existente no banco
// Como: Valida ID, monta dados, chama model, retorna questão atualizada
// Por que: Permite professores editarem questões já cadastradas
async function atualizar(req, res) {
  try {
    // Converte e valida o ID
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    // Atualiza no banco
    const atualizada = await questaoModel.atualizar(
      id,
      montarDadosQuestao(req.body)
    );

    if (atualizada) {
      res.status(200).json(atualizada);
    } else {
      res.status(404).json({ mensagem: `Questao ${id} nao encontrada` });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao atualizar questao",
      erro: erro.message,
    });
  }
}

// Rota: DELETE /api/questoes/:id - Deleta uma questão (professor)
// O que faz: Remove uma questão e suas alternativas do banco
// Como: Valida ID, chama model para deletar, retorna confirmação
// Por que: Permite professores removerem questões incorretas ou desnecessárias
async function deletar(req, res) {
  try {
    // Converte e valida o ID
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    // Deleta questão do banco
    const deletado = await questaoModel.deletar(id);

    if (deletado) {
      res.status(200).json({
        mensagem: `Questao ${id} removida com sucesso`,
      });
    } else {
      res.status(404).json({
        mensagem: `Questao ${id} nao encontrada`,
      });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao deletar questao",
      erro: erro.message,
    });
  }
}

// Rota: GET /api/questoes/topico/:topicoid - Lista questões por tópico
// O que faz: Retorna todas as questões de um tópico/subtópico específico
// Como: Valida topicoid, consulta modelo, retorna questões do tópico
// Por que: Permite filtrar questões por tópico específico
async function buscarPorTopico(req, res) {
  try {
    // Converte e valida o ID do tópico
    const topicoid = parseInt(req.params.topicoid);

    if (isNaN(topicoid)) {
      return res.status(400).json({ mensagem: "ID do topico invalido" });
    }

    // Busca questões do tópico
    const questoes = await questaoModel.buscarPorTopico(topicoid);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar questoes por topico",
      erro: erro.message,
    });
  }
}

// Exporta todos os controladores como funções nomeadas
module.exports = {
  buscarPorTopico,
  listarTodas,
  listarAnos,
  listarIds,
  listarVestibulares,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  infos_view,
  res,
  vw_questoes_com_topicos,
};
