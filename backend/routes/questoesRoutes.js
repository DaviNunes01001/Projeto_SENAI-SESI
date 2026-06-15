// Importa Express para criar roteador
const express = require("express");
const router = express.Router();

// Importa controlador de questões que contém lógica das requisições
const QuestaoController = require("../controllers/questoesControllers");

// Rota GET /api/questoes - Lista todas as questões com filtros
// Por que: Endpoint principal para buscar questões
router.get("/", QuestaoController.listarTodas);

// Rota GET /api/questoes/anos - Lista todos os anos com questões
// Por que: Popula dropdown de filtro de anos
router.get("/anos", QuestaoController.listarAnos);

// Rota GET /api/questoes/ids - Lista todos os IDs de questões
// Por que: Validação e preenchimento de combos
router.get("/ids", QuestaoController.listarIds);

// Rota GET /api/questoes/vestibulares - Lista todos os vestibulares
// Por que: Popula dropdown de filtro de vestibulares
router.get("/vestibulares", QuestaoController.listarVestibulares);

// Rota GET /api/questoes/primeiroSelect - Informações para primeiro seletor
// Por que: Suporta fluxo de seleção em cascata (primeiro dropdown)
router.get("/primeiroSelect", QuestaoController.infos_view);

// Rota GET /api/questoes/segundoSelect/:chave - Busca questões por palavra-chave
// Por que: Suporta fluxo de seleção em cascata (segundo dropdown)
router.get("/segundoSelect/:chave", QuestaoController.res);

// Rota GET /api/questoes/terceiroSelect - Questões agrupadas por tópicos
// Por que: Suporta fluxo de seleção em cascata (terceiro dropdown)
router.get("/terceiroSelect", QuestaoController.vw_questoes_com_topicos);

// Rota GET /api/questoes/topico/:topicoid - Lista questões de um tópico específico
// Por que: Filtra questões por tópico
router.get("/topico/:topicoid", QuestaoController.buscarPorTopico);

// Rota GET /api/questoes/:id - Obtém uma questão específica por ID
// Por que: Exibe detalhes completos de uma questão
router.get("/:id", QuestaoController.buscarPorId);

// Rota POST /api/questoes - Cria uma nova questão (professor)
// Por que: Permite adicionar novas questões ao sistema
router.post("/", QuestaoController.criar);

// Rota PUT /api/questoes/:id - Atualiza uma questão existente (professor)
// Por que: Permite editar questões já cadastradas
router.put("/:id", QuestaoController.atualizar);

// Rota DELETE /api/questoes/:id - Deleta uma questão (professor)
// Por que: Permite remover questões incorretas ou desnecessárias
router.delete("/:id", QuestaoController.deletar);

module.exports = router;
