const questaoModel = require("../models/questoesModels");

async function listarTodas(req, res) {
  try {
    const questoes = await questaoModel.listarTodas();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar questoes",
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

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID invalido" });
    }

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
  buscarPorId,
  criar,
  atualizar,
  deletar,
  infos_view,
  res,
  vw_questoes_com_topicos,
};
