const express = require("express");
const router = express.Router();

const QuestaoController = require("../controllers/questoesControllers"); 

router.get("/", QuestaoController.listarTodas); 

// views
router.get("/primeiroSelect", QuestaoController.infos_view);
router.get("/segundoSelect/:chave", QuestaoController.res);
router.get("/terceiroSelect", QuestaoController.vw_questoes_com_topicos);
router.get("/topico/:topicoid", QuestaoController.buscarPorTopico);

router.get("/:id", QuestaoController.buscarPorId);

router.post("/", QuestaoController.criar);

router.put("/:id", QuestaoController.atualizar);

router.delete("/:id", QuestaoController.deletar);

module.exports = router;
