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
      `unaccent(LOWER(q.enunciado)) LIKE unaccent(LOWER($${params.length}))`,
    );
  }

  if (filtros.nivel) {
    params.push(filtros.nivel);
    condicoes.push(
      `unaccent(LOWER(avaliacao.nivel)) = unaccent(LOWER($${params.length}))`,
    );
  }

  if (filtros.ano) {
    params.push(filtros.ano);
    condicoes.push(`vestibular.ano = $${params.length}`);
  }

  if (filtros.vestibularId) {
    params.push(filtros.vestibularId);
    condicoes.push(`q.vestibular_id = $${params.length}`);
  }

  if (filtros.vestibular) {
    params.push(`%${filtros.vestibular}%`);
    condicoes.push(
      `unaccent(LOWER(vestibular.nome)) LIKE unaccent(LOWER($${params.length}))`,
    );
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
    `,
  );

  return result.rows;
}

async function listarIds() {
  const result = await pool.query(
    `
    SELECT id
    FROM questao
    ORDER BY id
    `,
  );

  return result.rows;
}

async function listarVestibulares() {
  const result = await pool.query(
    `
    SELECT DISTINCT
      vestibular.id,
      vestibular.nome,
      vestibular.ano,
      vestibular.instituicao
    FROM vestibular
    INNER JOIN questao
      ON questao.vestibular_id = vestibular.id
    WHERE vestibular.nome IS NOT NULL
    ORDER BY vestibular.nome ASC, vestibular.ano DESC, vestibular.id ASC
    `,
  );

  return result.rows;
}

function getExecutor(client) {
  return client || pool;
}

async function buscarVestibularPorId(id, client) {
  if (!id) {
    return null;
  }

  const result = await getExecutor(client).query(
    `
    SELECT id, nome, ano, instituicao
    FROM vestibular
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
}

async function buscarVestibularPorAno(ano, referencia, client) {
  const executor = getExecutor(client);
  const nome = referencia?.nome || `Vestibular ${ano}`;
  const instituicao = referencia?.instituicao || null;

  const result = await executor.query(
    `
    SELECT id
    FROM vestibular
    WHERE nome = $1
      AND ano = $2
      AND COALESCE(instituicao, '') = COALESCE($3::text, '')
    ORDER BY id
    LIMIT 1
    `,
    [nome, ano, instituicao],
  );

  return result.rows[0] || null;
}

async function criarVestibularParaAno(ano, referencia, client) {
  const existente = await buscarVestibularPorAno(ano, referencia, client);

  if (existente) {
    return existente.id;
  }

  const nome = referencia?.nome || `Vestibular ${ano}`;
  const instituicao = referencia?.instituicao || null;
  const result = await getExecutor(client).query(
    `
    INSERT INTO vestibular (nome, ano, instituicao)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [nome, ano, instituicao],
  );

  return result.rows[0].id;
}

async function resolverVestibularId(dados, client) {
  const vestibularId = dados.vestibular_id || null;
  const ano = dados.ano || null;

  if (!ano) {
    return vestibularId;
  }

  const vestibular = await buscarVestibularPorId(vestibularId, client);

  if (vestibular && Number(vestibular.ano) === Number(ano)) {
    return vestibular.id;
  }

  if (vestibular) {
    return criarVestibularParaAno(ano, vestibular, client);
  }

  if (vestibularId) {
    return vestibularId;
  }

  return criarVestibularParaAno(ano, null, client);
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
    `,
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
    [`%${chave}%`],
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
    `,
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
    [topicoid],
  );

  return result.rows;
}

async function criar(dados) {
  const {
    avaliacao_id,
    vestibular_id,
    ano,
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vestibularId = await resolverVestibularId(
      { vestibular_id, ano },
      client,
    );
    const result = await client.query(
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
        vestibularId,
        subtopico_id || topicoid,
        enunciado,
        tipo || "base",
        conteudo || enunciado,
        bloco || null,
        explicacao || null,
        comentario_especialista || null,
        link_explicacao || link_bib || null,
      ],
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

async function atualizar(id, dados) {
  const {
    avaliacao_id,
    vestibular_id,
    ano,
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deveAtualizarVestibular = Boolean(vestibular_id || ano);
    const questaoAtual = await client.query(
      `
      SELECT vestibular_id
      FROM questao
      WHERE id = $1
      `,
      [id],
    );

    if (questaoAtual.rowCount === 0) {
      await client.query("COMMIT");
      return null;
    }

    const vestibularBase =
      vestibular_id || (ano ? questaoAtual.rows[0].vestibular_id : null);
    const vestibularId = deveAtualizarVestibular
      ? await resolverVestibularId(
          { vestibular_id: vestibularBase, ano },
          client,
        )
      : null;
    const result = await client.query(
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
        vestibularId,
        subtopico_id || topicoid || null,
        enunciado || null,
        tipo || null,
        conteudo || null,
        bloco || null,
        explicacao || null,
        comentario_especialista || null,
        link_explicacao || link_bib || null,
        id,
      ],
    );

    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

async function deletar(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM alternativa WHERE questao_id = $1", [id]);

    const result = await client.query("DELETE FROM questao WHERE id = $1", [
      id,
    ]);

    await client.query("COMMIT");
    return result.rowCount > 0;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

module.exports = {
  listarTodas,
  listarAnos,
  listarIds,
  listarVestibulares,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorTopico,
  infos_view,
  res,
  vw_questoes_com_topicos,
};
