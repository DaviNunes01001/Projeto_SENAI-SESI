const pool = require("../config/database");

const topicoSelect = `
  SELECT
    id,
    id AS idt,
    nome,
    nome AS descricao_topico,
    descricao,
    NULL::text AS disciplina,
    NULL::text AS professor
  FROM subtopico
`;

async function listarTodos() {
  const result = await pool.query(`${topicoSelect} ORDER BY id`);
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(`${topicoSelect} WHERE id = $1`, [id]);
  return result.rows[0];
}

async function criar(dados) {
  const nome = dados.nome || dados.descricao_topico;
  const descricao = dados.descricao || dados.descricao_topico;

  const result = await pool.query(
    `
    INSERT INTO subtopico (nome, descricao)
    VALUES ($1, $2)
    RETURNING
      id,
      id AS idt,
      nome,
      nome AS descricao_topico,
      descricao,
      NULL::text AS disciplina,
      NULL::text AS professor
    `,
    [nome, descricao]
  );

  return result.rows[0];
}

async function atualizar(id, dados) {
  const nome = dados.nome || dados.descricao_topico;
  const descricao = dados.descricao || dados.descricao_topico;

  const result = await pool.query(
    `
    UPDATE subtopico
    SET nome = $1,
        descricao = $2
    WHERE id = $3
    RETURNING
      id,
      id AS idt,
      nome,
      nome AS descricao_topico,
      descricao,
      NULL::text AS disciplina,
      NULL::text AS professor
    `,
    [nome, descricao, id]
  );

  return result.rows[0] || null;
}

async function deletar(id) {
  const result = await pool.query("DELETE FROM subtopico WHERE id = $1", [id]);
  return result.rowCount > 0;
}

async function selectgeo1() {
  return [];
}

async function selectgeo2() {
  return [];
}

async function selecting1() {
  return [];
}

async function selecting2() {
  return [];
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
  selecting2,
};
