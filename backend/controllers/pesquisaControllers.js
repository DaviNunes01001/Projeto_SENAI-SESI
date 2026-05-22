const pesquisaModel = require("../models/pesquisaModels");

function agruparAlternativas(linhas) {
  const questoes = new Map();

  linhas.forEach((linha) => {
    const questaoExistente = questoes.get(linha.id);

    const questao =
      questaoExistente ||
      {
        id: linha.id,
        enunciado: linha.enunciado,
        explicacao: linha.explicacao,
        comentario_especialista: linha.comentario_especialista,
        link_explicacao: linha.link_explicacao,
        vestibular: linha.vestibular || linha.nome,
        ano: linha.ano,
        topico: linha.topico,
        subtopico: linha.subtopico,
        nivel: linha.nivel,
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

async function responderPesquisa(res, consulta) {
  try {
    const linhas = await consulta();
    res.status(200).json(agruparAlternativas(linhas));
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao pesquisar questoes",
      erro: erro.message,
    });
  }
}

function listar(req, res) {
  return responderPesquisa(res, () =>
    pesquisaModel.listar(req.query.q, req.query.nivel)
  );
}

function filtrarPorDificuldade(req, res) {
  const nivel = req.params.nivel || req.query.nivel;
  return responderPesquisa(res, () => pesquisaModel.filtrarPorDificuldade(nivel));
}

function filtrarPorVestibular(req, res) {
  const vestibular = req.params.vestibular || req.query.vestibular;
  return responderPesquisa(res, () =>
    pesquisaModel.filtrarPorVestibular(vestibular)
  );
}

function filtrarPorTopico(req, res) {
  const topico = req.params.topico || req.query.topico;
  return responderPesquisa(res, () => pesquisaModel.filtrarPorTopico(topico));
}

function listarAnoRecente(req, res) {
  return responderPesquisa(res, pesquisaModel.listarAnoRecente);
}

function listarAnoAntigo(req, res) {
  return responderPesquisa(res, pesquisaModel.listarAnoAntigo);
}

module.exports = {
  listar,
  filtrarPorDificuldade,
  filtrarPorVestibular,
  filtrarPorTopico,
  listarAnoRecente,
  listarAnoAntigo,
};
