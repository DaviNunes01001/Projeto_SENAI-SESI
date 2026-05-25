const pool = require("../config/database");

const questaoSelect = `
  SELECT
    q.id,
    q.id AS idc,
    q.subtopico_id AS topicoid,
    q.avaliacao_id,
    q.vestibular_id,
    q.subtopico_id,
    q.enunciado,
    q.tipo,
    q.conteudo,
    q.bloco,
    q.explicacao,
    q.comentario_especialista,
    q.link_explicacao,
    q.link_explicacao AS link_bib,
    avaliacao.nivel,
    vestibular.nome AS vestibular,
    vestibular.ano,
    subtopico.nome AS topico
  FROM questao q
  LEFT JOIN avaliacao
    ON q.avaliacao_id = avaliacao.id
  LEFT JOIN vestibular
    ON q.vestibular_id = vestibular.id
  LEFT JOIN subtopico
    ON q.subtopico_id = subtopico.id
`;

async function listarTodas(filtros = {}) {
  const params = [];
  const condicoes = [];

  if (filtros.busca) {
    params.push(`%${filtros.busca}%`);
    condicoes.push(
      `unaccent(LOWER(q.enunciado)) LIKE unaccent(LOWER($${params.length}))`
    );
  }

  if (filtros.nivel) {
    params.push(filtros.nivel);
    condicoes.push(
      `unaccent(LOWER(avaliacao.nivel)) = unaccent(LOWER($${params.length}))`
    );
  }

  if (filtros.ano) {
    params.push(filtros.ano);
    condicoes.push(`vestibular.ano = $${params.length}`);
  }

  if (filtros.id) {
    params.push(filtros.id);
    condicoes.push(`q.id = $${params.length}`);
  }

  let sql = `
    SELECT
      q.id,
      q.id AS idc,
      q.subtopico_id AS topicoid,
      q.avaliacao_id,
      q.vestibular_id,
      q.subtopico_id,
      q.enunciado,
      q.tipo,
      q.conteudo,
      q.bloco,
      q.explicacao,
      q.comentario_especialista,
      q.link_explicacao,
      q.link_explicacao AS link_bib,
      avaliacao.nivel,
      vestibular.nome AS vestibular,
      vestibular.ano,
      subtopico.nome AS topico,
      alternativa.letra,
      alternativa.texto,
      alternativa.correta
    FROM questao q
    LEFT JOIN avaliacao
      ON q.avaliacao_id = avaliacao.id
    LEFT JOIN vestibular
      ON q.vestibular_id = vestibular.id
    LEFT JOIN subtopico
      ON q.subtopico_id = subtopico.id
    LEFT JOIN alternativa
      ON q.id = alternativa.questao_id
  `;

  if (condicoes.length > 0) {
    sql += ` WHERE ${condicoes.join(" AND ")}`;
  }

  sql += " ORDER BY q.id, alternativa.letra";

  const result = await pool.query(sql, params);
  return result.rows;
}

async function listarAnos() {
  const result = await pool.query(
    `
    SELECT DISTINCT vestibular.ano
    FROM vestibular
    INNER JOIN questao
      ON questao.vestibular_id = vestibular.id
    WHERE vestibular.ano IS NOT NULL
    ORDER BY vestibular.ano DESC
    `
  );

  return result.rows;
}

async function listarIds() {
  const result = await pool.query(
    `
    SELECT id
    FROM questao
    ORDER BY id
    `
  );

  return result.rows;
}

async function infos_view() {
  const result = await pool.query(
    `
    SELECT
      subtopico.nome AS descricao_topico,
      q.id AS idc,
      q.enunciado
    FROM questao q
    INNER JOIN subtopico
      ON q.subtopico_id = subtopico.id
    WHERE q.subtopico_id = 1
    ORDER BY q.id
    `
  );

  return result.rows;
}

async function res(chave) {
  const result = await pool.query(
    `
    SELECT
      q.enunciado,
      alternativa.texto AS resposta
    FROM questao q
    LEFT JOIN alternativa
      ON q.id = alternativa.questao_id
      AND alternativa.correta = true
    WHERE q.enunciado ILIKE $1
    ORDER BY q.id
    `,
    [`%${chave}%`]
  );

  return result.rows;
}

async function vw_questoes_com_topicos() {
  const result = await pool.query(
    `
    SELECT
      subtopico.nome AS nome_topico,
      q.enunciado,
      q.explicacao,
      q.link_explicacao AS link_bib,
      q.comentario_especialista
    FROM questao q
    INNER JOIN subtopico
      ON q.subtopico_id = subtopico.id
    ORDER BY q.id
    `
  );

  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(`${questaoSelect} WHERE q.id = $1`, [id]);
  return result.rows[0];
}

async function buscarPorTopico(topicoid) {
  const result = await pool.query(
    `${questaoSelect} WHERE q.subtopico_id = $1 ORDER BY q.id`,
    [topicoid]
  );

  return result.rows;
}

async function criar(dados) {
  const {
    avaliacao_id,
    vestibular_id,
    subtopico_id,
    topicoid,
    enunciado,
    tipo,
    conteudo,
    bloco,
    explicacao,
    comentario_especialista,
    link_explicacao,
    link_bib,
  } = dados;

  const result = await pool.query(
    `
    INSERT INTO questao (
      avaliacao_id,
      vestibular_id,
      subtopico_id,
      enunciado,
      tipo,
      conteudo,
      bloco,
      explicacao,
      comentario_especialista,
      link_explicacao
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
    `,
    [
      avaliacao_id || 1,
      vestibular_id || 1,
      subtopico_id || topicoid,
      enunciado,
      tipo || "base",
      conteudo || enunciado,
      bloco || null,
      explicacao || null,
      comentario_especialista || null,
      link_explicacao || link_bib || null,
    ]
  );

  return result.rows[0];
}

async function atualizar(id, dados) {
  const {
    avaliacao_id,
    vestibular_id,
    subtopico_id,
    topicoid,
    enunciado,
    tipo,
    conteudo,
    bloco,
    explicacao,
    comentario_especialista,
    link_explicacao,
    link_bib,
  } = dados;

  const result = await pool.query(
    `
    UPDATE questao
    SET avaliacao_id = COALESCE($1, avaliacao_id),
        vestibular_id = COALESCE($2, vestibular_id),
        subtopico_id = COALESCE($3, subtopico_id),
        enunciado = COALESCE($4, enunciado),
        tipo = COALESCE($5, tipo),
        conteudo = COALESCE($6, conteudo),
        bloco = COALESCE($7, bloco),
        explicacao = COALESCE($8, explicacao),
        comentario_especialista = COALESCE($9, comentario_especialista),
        link_explicacao = COALESCE($10, link_explicacao)
    WHERE id = $11
    RETURNING *
    `,
    [
      avaliacao_id || null,
      vestibular_id || null,
      subtopico_id || topicoid || null,
      enunciado || null,
      tipo || null,
      conteudo || null,
      bloco || null,
      explicacao || null,
      comentario_especialista || null,
      link_explicacao || link_bib || null,
      id,
    ]
  );

  return result.rows[0] || null;
}

async function deletar(id) {
  const result = await pool.query("DELETE FROM questao WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = {
  listarTodas,
  listarAnos,
  listarIds,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorTopico,
  infos_view,
  res,
  vw_questoes_com_topicos,
};
