const express = require("express");
const router = express.Router();

const TopicoController = require("../controllers/topicosControllers");

// listar todos os tópicos
router.get("/", TopicoController.listarTodos);

// buscar tópico por id
router.get("/:id", TopicoController.buscarPorId);

// criar novo tópico
router.post("/", TopicoController.criar);

// atualizar tópico
router.put("/:id", TopicoController.atualizar);

// deletar tópico
router.delete("/:id", TopicoController.deletar);

module.exports = router;
