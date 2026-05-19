const topicoModel = require("../models/topicosModels");

async function listarTodos(req, res) {
  try {
    const topicos = await topicoModel.listarTodos();
    res.status(200).json(topicos);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar tópicos",
      erro: erro.message,
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const topico = await topicoModel.buscarPorId(id);

    if (topico) {
      res.status(200).json(topico);
    } else {
      res.status(404).json({ mensagem: `Tópico ${id} não encontrado` });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar tópico",
      erro: erro.message,
    });
  }
}

async function criar(req, res) {
  try {
    const { disciplina, professor, descricao_topico } = req.body;

    if (!disciplina || !professor || !descricao_topico) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios",
      });
    }

    const novoTopico = await topicoModel.criar({
      disciplina,
      professor,
      descricao_topico,
    });

    res.status(201).json(novoTopico);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao criar tópico",
      erro: erro.message,
    });
  }
}

async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { disciplina, professor, descricao_topico } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    if (!disciplina || !professor || !descricao_topico) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios",
      });
    }

    const atualizado = await topicoModel.atualizar(id, {
      disciplina,
      professor,
      descricao_topico,
    });

    if (atualizado) {
      res.status(200).json(atualizado);
    } else {
      res.status(404).json({ mensagem: `Tópico ${id} não encontrado` });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao atualizar tópico",
      erro: erro.message,
    });
  }
}

async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const deletado = await topicoModel.deletar(id);

    if (deletado) {
      res.status(200).json({
        mensagem: `Tópico ${id} removido com sucesso`,
      });
    } else {
      res.status(404).json({
        mensagem: `Tópico ${id} não encontrado`,
      });
    }
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao deletar tópico",
      erro: erro.message,
    });
  }
}

// select
// geo
async function selectgeo1(req, res) {
  try {
    const topico = await topicoModel.selectgeo1();
    res.status(200).json(topico);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar tópico", 
      erro: erro.message,
    });
  }
}

async function selectgeo2(req, res) {
  try {
    const chave = req.params.chave;
    const questoes = await topicoModel.selectgeo2(chave);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro",
      erro: erro.message,
    });
  }
}

// ingles
async function selecting1(req, res) {
  try {
    const topicos = await topicoModel.selecting1();
    res.status(200).json(topicos);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao buscar tópicos", 
      erro: erro.message,
    });
  }
}

async function selecting2(req, res) {
  try {
    const chave = req.params.chave;
    const questoes = await topicoModel.selecting2(chave);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro",
      erro: erro.message,
    });
  }
}


module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  selectgeo1,
  selectgeo2,
  selecting1,
  selecting2
};