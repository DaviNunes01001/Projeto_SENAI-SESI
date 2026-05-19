const pesquisaModel = require("../models/pesquisaModels");

function getQueryValue(req, names) {
  for (const name of names) {
    const value = req.query[name];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

async function listar(req, res) {
  try {
    const busca = getQueryValue(req, ["q", "busca", "enunciado"]);
    const questoes = await pesquisaModel.listar(busca);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar pesquisa",
      erro: erro.message,
    });
  }
}

async function filtrarPorDificuldade(req, res) {
  try {
    const nivel = getQueryValue(req, ["nivel", "dificuldade"]);
    const questoes = await pesquisaModel.filtrarPorDificuldade(nivel);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao filtrar pesquisa por dificuldade",
      erro: erro.message,
    });
  }
}

async function filtrarPorVestibular(req, res) {
  try {
    const vestibular = getQueryValue(req, ["vestibular", "nome"]);
    const questoes = await pesquisaModel.filtrarPorVestibular(vestibular);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao filtrar pesquisa por vestibular",
      erro: erro.message,
    });
  }
}

async function filtrarPorTopico(req, res) {
  try {
    const topico = getQueryValue(req, ["topico", "nome"]);
    const questoes = await pesquisaModel.filtrarPorTopico(topico);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao filtrar pesquisa por topico",
      erro: erro.message,
    });
  }
}

async function listarAnoRecente(req, res) {
  try {
    const questoes = await pesquisaModel.listarAnoRecente();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar pesquisa por ano recente",
      erro: erro.message,
    });
  }
}

async function listarAnoAntigo(req, res) {
  try {
    const questoes = await pesquisaModel.listarAnoAntigo();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar pesquisa por ano antigo",
      erro: erro.message,
    });
  }
}

module.exports = {
  listar,
  filtrarPorDificuldade,
  filtrarPorVestibular,
  filtrarPorTopico,
  listarAnoRecente,
  listarAnoAntigo,
};
