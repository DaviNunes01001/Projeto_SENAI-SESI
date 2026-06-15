// Importa o pool de conexão do banco de dados PostgreSQL
const pool = require("../config/database");

// SQL base que seleciona questões com seus relacionamentos (avaliação, vestibular, subtópico)
// Este fragmento é reutilizado em múltiplas queries para manter consistência
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

// Função: Lista todas as questões com filtros opcionais
// O que faz: Busca questões do banco com AND acumula filtros (busca, nível, ano, ID, vestibular)
// Como: Constrói query SQL dinamicamente com WHERE clauses, usa parâmetros para segurança
// Por que: Permite buscas avançadas por múltiplos critérios na aplicação
async function listarTodas(filtros = {}) {
  // Arrays para acumular parâmetros e condições WHERE
  const params = [];
  const condicoes = [];

  // Se há busca, adiciona condição ILIKE (case-insensitive) com unaccent
  // Por que unaccent: Para encontrar "matemática" mesmo se digitar "matematica"
  if (filtros.busca) {
    params.push(`%${filtros.busca}%`);
    condicoes.push(
      `unaccent(LOWER(q.enunciado)) LIKE unaccent(LOWER($${params.length}))`
    );
  }

  // Se há nível (base, intermediario, avancado), adiciona condição
  if (filtros.nivel) {
    params.push(filtros.nivel);
    condicoes.push(
      `unaccent(LOWER(avaliacao.nivel)) = unaccent(LOWER($${params.length}))`
    );
  }

  // Se há ano, adiciona condição de igualdade
  if (filtros.ano) {
    params.push(filtros.ano);
    condicoes.push(`vestibular.ano = $${params.length}`);
  }

  // Se há ID de vestibular, adiciona condição
  if (filtros.vestibularId) {
    params.push(filtros.vestibularId);
    condicoes.push(`q.vestibular_id = $${params.length}`);
  }

  // Se há nome de vestibular, adiciona busca ILIKE
  if (filtros.vestibular) {
    params.push(`%${filtros.vestibular}%`);
    condicoes.push(
      `unaccent(LOWER(vestibular.nome)) LIKE unaccent(LOWER($${params.length}))`
    );
  }

  // Se há ID de questão específica, adiciona condição
  if (filtros.id) {
    params.push(filtros.id);
    condicoes.push(`q.id = $${params.length}`);
  }

  // Constrói a query SQL com SELECTs, JOINs, alternativas
  // Retorna uma linha por alternativa (necessário para depois agrupar no controller)
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

  // Se houver condições, adiciona WHERE com AND entre elas
  if (condicoes.length > 0) {
    sql += ` WHERE ${condicoes.join(" AND ")}`;
  }

  // Ordena por ID da questão e letra da alternativa para manter consistência
  sql += " ORDER BY q.id, alternativa.letra";

  // Executa query com parâmetros seguros (prepared statement)
  const result = await pool.query(sql, params);
  return result.rows;
}

// Função: Lista todos os anos distintos com questões cadastradas
// O que faz: Retorna array de anos únicos para popular dropdown de filtro
// Como: Faz SELECT DISTINCT em vestibular.ano ordenado descrescente
// Por que: Permite que usuário filtre questões por ano de vestibular
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

// Função: Lista todos os IDs de questões cadastradas
// O que faz: Retorna array de todos os IDs de questões
// Como: Faz SELECT simples de id, ordenado crescente
// Por que: Usado para validações e preenchimento de combinações
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

// Função: Lista todos os vestibulares distintos que têm questões
// O que faz: Retorna array de vestibulares com id, nome, ano, instituição
// Como: Faz SELECT DISTINCT em vestibular com INNER JOIN em questão
// Por que: Permite usuário filtrar questões por vestibular específico
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
    `
  );

  return result.rows;
}

// Função: Retorna informações do primeiro seletor (dropdown de tópicos)
// O que faz: Lista questões com seus tópicos para primeiro seletor em cascata
// Como: Seleciona nome do subtópico, ID e enunciado onde subtópico_id = 1
// Por que: Suporta fluxo de seleção em cascata na interface (primeiro dropdown)
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

// Função: Busca questões por palavra-chave e retorna respostas corretas
// O que faz: Encontra questões cujo enunciado contém a chave e retorna resposta correta
// Como: ILIKE para busca case-insensitive, JOIN com alternativa onde correta = true
// Por que: Suporta fluxo de seleção em cascata (segundo seletor) para encontrar resposta
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

// Função: Lista questões agrupadas por tópicos com explicações
// O que faz: Retorna todas as questões com nome do tópico, enunciado, explicação e link
// Como: INNER JOIN com subtópico, seleciona campos relevantes
// Por que: Suporta fluxo de seleção em cascata (terceiro seletor) com informações completas
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

// Função: Busca uma questão específica por ID
// O que faz: Retorna uma questão completa com todos seus campos
// Como: Usa SQL base questaoSelect com WHERE q.id = $1
// Por que: Necessário para exibir detalhes completos de uma questão
async function buscarPorId(id) {
  const result = await pool.query(`${questaoSelect} WHERE q.id = $1`, [id]);
  return result.rows[0];
}

// Função: Busca todas as questões de um tópico/subtópico específico
// O que faz: Retorna array de questões com subtópico_id especificado
// Como: Usa SQL base questaoSelect com WHERE q.subtopico_id = $1
// Por que: Permite filtrar questões por tópico específico
async function buscarPorTopico(topicoid) {
  const result = await pool.query(
    `${questaoSelect} WHERE q.subtopico_id = $1 ORDER BY q.id`,
    [topicoid]
  );

  return result.rows;
}

// Função: Cria uma nova questão no banco de dados
// O que faz: Insere nova questão com todos os campos, usa defaults para campos opcionais
// Como: INSERT com RETURNING * para retornar a questão criada
// Por que: Permite que professores adicionem questões ao sistema
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

  // INSERT INTO com placeholders seguros ($1, $2, etc)
  // Usa valores padrão se campo não for fornecido (|| operador)
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

// Função: Atualiza uma questão existente
// O que faz: Modifica campos da questão, mantém campos não fornecidos com COALESCE
// Como: UPDATE com COALESCE para manter valor antigo se novo é null, WHERE id = $11
// Por que: Permite que professores editem questões já cadastradas
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

  // UPDATE com COALESCE: se valor novo é null, mantém valor antigo
  // Isso permite atualizações parciais (atualizar apenas alguns campos)
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

// Função: Deleta uma questão e suas alternativas
// O que faz: Remove questão e alterna CASCADE para manter integridade referencial
// Como: Usa transação (BEGIN/COMMIT) para atomicidade: deleta alternativas depois questão
// Por que: Garante que se questão for deletada, alternativas também sejam removidas
async function deletar(id) {
  // Obtém cliente do pool para executar transação
  const client = await pool.connect();

  try {
    // Inicia transação: se algo falhar, tudo é revertido
    await client.query("BEGIN");

    // Deleta todas as alternativas desta questão primeiro
    // (se deletasse questão primeiro, violaria constraint de chave estrangeira)
    await client.query("DELETE FROM alternativa WHERE questao_id = $1", [id]);

    // Deleta a questão
    const result = await client.query("DELETE FROM questao WHERE id = $1", [id]);

    // Finaliza transação com sucesso
    await client.query("COMMIT");

    // Retorna true se alguma linha foi deletada, false caso contrário
    return result.rowCount > 0;
  } catch (erro) {
    // Se houver erro, reverte todas as alterações
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    // Libera o cliente de volta ao pool em qualquer caso (sucesso ou erro)
    client.release();
  }
}

// Exporta todas as funções do modelo para uso nos controllers
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
