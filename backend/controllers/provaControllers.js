const provaModel = require("../models/provaModels");

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
    const questoes = await provaModel.listar(busca);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar prova",
      erro: erro.message,
    });
  }
}

async function montarPorDificuldade(req, res) {
  try {
    const nivel = getQueryValue(req, ["nivel", "dificuldade"]);
    const questoes = await provaModel.montarPorDificuldade(nivel);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao montar prova por dificuldade",
      erro: erro.message,
    });
  }
}

async function montarPorVestibular(req, res) {
  try {
    const vestibular = getQueryValue(req, ["vestibular", "nome"]);
    const questoes = await provaModel.montarPorVestibular(vestibular);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao montar prova por vestibular",
      erro: erro.message,
    });
  }
}

async function montarPorTopico(req, res) {
  try {
    const topico = getQueryValue(req, ["topico", "nome"]);
    const questoes = await provaModel.montarPorTopico(topico);
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao montar prova por topico",
      erro: erro.message,
    });
  }
}

async function listarAnoRecente(req, res) {
  try {
    const questoes = await provaModel.listarAnoRecente();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar prova por ano recente",
      erro: erro.message,
    });
  }
}

async function listarAnoAntigo(req, res) {
  try {
    const questoes = await provaModel.listarAnoAntigo();
    res.status(200).json(questoes);
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao listar prova por ano antigo",
      erro: erro.message,
    });
  }
}

module.exports = {
  listar,
  montarPorDificuldade,
  montarPorVestibular,
  montarPorTopico,
  listarAnoRecente,
  listarAnoAntigo,
};
