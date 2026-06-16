const questaoModel = require("../models/questoesModels");

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

function temValor(valor) {
  return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

async function listarTodas(req, res) {
  try {
    const ano = obterAno(req.query.ano);
    const id = obterId(req.query.id);
    const vestibularId = obterId(req.query.vestibular_id);
    const vestibular =
      typeof req.query.vestibular === "string" ? req.query.vestibular.trim() : "";

    if (req.query.ano && !ano) {
      return res.status(400).json({ mensagem: "Ano invalido" });
    }

    if (req.query.id && !id) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    if (req.query.vestibular_id && !vestibularId) {
      return res.status(400).json({ mensagem: "Vestibular invalido" });
    }

    const linhas = await questaoModel.listarTodas({
      busca: req.query.q,
      nivel: req.query.nivel,
      ano,
      id,
      vestibularId,
      vestibular,
    });

    res.status(200).json(agruparAlternativas(linhas));
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar questoes",
      erro: erro.message,
    });
  }
}

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

async function res(req, res) {
  try {
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

async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

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

function montarDadosQuestao(body) {
  return {
    avaliacao_id: body.avaliacao_id,
    vestibular_id: body.vestibular_id,
    ano: obterAno(body.ano),
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

async function criar(req, res) {
  try {
    const dados = montarDadosQuestao(req.body);

    if (temValor(req.body.ano) && !dados.ano) {
      return res.status(400).json({ mensagem: "Ano invalido" });
    }

    if (!dados.enunciado || (!dados.subtopico_id && !dados.topicoid)) {
      return res.status(400).json({
        mensagem: "Campos obrigatorios: enunciado e subtopico_id ou topicoid",
      });
    }

    const novaQuestao = await questaoModel.criar(dados);
    res.status(201).json(novaQuestao);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao criar questao",
      erro: erro.message,
    });
  }
}

async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const dados = montarDadosQuestao(req.body);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

    if (temValor(req.body.ano) && !dados.ano) {
      return res.status(400).json({ mensagem: "Ano invalido" });
    }

    const atualizada = await questaoModel.atualizar(id, dados);

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

async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

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

async function buscarPorTopico(req, res) {
  try {
    const topicoid = parseInt(req.params.topicoid);

    if (isNaN(topicoid)) {
      return res.status(400).json({ mensagem: "ID do topico invalido" });
    }

    const questoes = await questaoModel.buscarPorTopico(topicoid);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar questoes por topico",
      erro: erro.message,
    });
  }
}

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
