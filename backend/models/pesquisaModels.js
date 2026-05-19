const pool = require("../config/database");

function isUndefinedRelation(erro) {
  return erro && erro.code === "42P01";
}

async function listar(busca) {
  const params = [];
  let sql = "SELECT * FROM view_busca_questao_PES";

  if (busca) {
    params.push(`%${busca}%`);
    sql += " WHERE unaccent(LOWER(enunciado)) LIKE unaccent(LOWER($1))";
  }

  sql += " ORDER BY id";

  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (erro) {
    if (!isUndefinedRelation(erro)) {
      throw erro;
    }
  }

  return listarSemView(busca);
}

async function listarSemView(busca) {
  const params = [];
  let sql = `
    SELECT
      questao.id,
      questao.enunciado,
      questao.explicacao,
      questao.comentario_especialista,
      questao.link_explicacao,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta,
      vestibular.nome AS vestibular,
      subtopico.nome AS subtopico,
      avaliacao.nivel
    FROM questao
    INNER JOIN vestibular
      ON questao.vestibular_id = vestibular.id
    INNER JOIN subtopico
      ON questao.subtopico_id = subtopico.id
    INNER JOIN avaliacao
      ON questao.avaliacao_id = avaliacao.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
  `;

  if (busca) {
    params.push(`%${busca}%`);
    sql += " WHERE unaccent(LOWER(questao.enunciado)) LIKE unaccent(LOWER($1))";
  }

  sql += " ORDER BY questao.id, alternativa.letra";

  const result = await pool.query(sql, params);
  return result.rows;
}

async function filtrarPorDificuldade(nivel = "base") {
  const result = await pool.query(
    `
    SELECT
      questao.id,
      questao.enunciado,
      avaliacao.nivel,
      questao.comentario_especialista,
      questao.link_explicacao,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao
    INNER JOIN avaliacao
      ON questao.avaliacao_id = avaliacao.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
    WHERE unaccent(LOWER(avaliacao.nivel)) = unaccent(LOWER($1))
    ORDER BY questao.id, alternativa.letra
    `,
    [nivel]
  );

  return result.rows;
}

async function filtrarPorVestibular(vestibular = "ENEM") {
  const result = await pool.query(
    `
    SELECT
      questao.id,
      questao.enunciado,
      questao.comentario_especialista,
      questao.link_explicacao,
      vestibular.nome,
      vestibular.ano,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao
    INNER JOIN vestibular
      ON questao.vestibular_id = vestibular.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
    WHERE unaccent(LOWER(vestibular.nome)) = unaccent(LOWER($1))
    ORDER BY questao.id, alternativa.letra
    `,
    [vestibular]
  );

  return result.rows;
}

async function filtrarPorTopico(topico = "Pir\u00e2mides") {
  const result = await pool.query(
    `
    SELECT
      questao.id,
      questao.enunciado,
      questao.comentario_especialista,
      questao.link_explicacao,
      subtopico.nome AS topico,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao
    INNER JOIN subtopico
      ON questao.subtopico_id = subtopico.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
    WHERE unaccent(LOWER(subtopico.nome)) = unaccent(LOWER($1))
    ORDER BY questao.id, alternativa.letra
    `,
    [topico]
  );

  return result.rows;
}

async function listarAnoRecente() {
  try {
    const result = await pool.query("SELECT * FROM view_filtro_ano_recente_pesquisa");
    return result.rows;
  } catch (erro) {
    if (!isUndefinedRelation(erro)) {
      throw erro;
    }
  }

  const result = await pool.query(
    `
    SELECT
      questao.id,
      questao.enunciado,
      vestibular.nome AS vestibular,
      vestibular.ano,
      questao.explicacao,
      questao.link_explicacao,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao
    INNER JOIN vestibular
      ON questao.vestibular_id = vestibular.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
    ORDER BY vestibular.ano DESC
    `
  );

  return result.rows;
}

async function listarAnoAntigo() {
  try {
    const result = await pool.query("SELECT * FROM view_filtro_ano_antigo_pesquisa");
    return result.rows;
  } catch (erro) {
    if (!isUndefinedRelation(erro)) {
      throw erro;
    }
  }

  const result = await pool.query(
    `
    SELECT
      questao.id,
      questao.enunciado,
      vestibular.nome AS vestibular,
      vestibular.ano,
      questao.explicacao,
      questao.link_explicacao,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao
    INNER JOIN vestibular
      ON questao.vestibular_id = vestibular.id
    INNER JOIN alternativa
      ON questao.id = alternativa.questao_id
    ORDER BY vestibular.ano ASC
    `
  );

  return result.rows;
}

module.exports = {
  listar,
  filtrarPorDificuldade,
  filtrarPorVestibular,
  filtrarPorTopico,
  listarAnoRecente,
  listarAnoAntigo,
};
