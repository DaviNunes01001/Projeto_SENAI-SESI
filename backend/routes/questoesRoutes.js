const express = require("express");
const router = express.Router();

const QuestaoController = require("../controllers/questoesControllers");

// Fixed routes must stay before /:id so each path resolves to its handler.
router.get("/", QuestaoController.listarTodas);
router.get("/anos", QuestaoController.listarAnos);
router.get("/ids", QuestaoController.listarIds);
router.get("/vestibulares", QuestaoController.listarVestibulares);

// Routes backed by question and topic views.
router.get("/primeiroSelect", QuestaoController.infos_view);
router.get("/segundoSelect/:chave", QuestaoController.res);
router.get("/terceiroSelect", QuestaoController.vw_questoes_com_topicos);
router.get("/topico/:topicoid", QuestaoController.buscarPorTopico);

router.get("/:id", QuestaoController.buscarPorId);

// Write operations for creating, updating, and deleting questions.
router.post("/", QuestaoController.criar);

router.put("/:id", QuestaoController.atualizar);

router.delete("/:id", QuestaoController.deletar);

module.exports = router;
