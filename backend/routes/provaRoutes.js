const express = require("express");
const router = express.Router();

const ProvaController = require("../controllers/provaControllers");

router.get("/", ProvaController.listar);
router.get("/dificuldade", ProvaController.montarPorDificuldade);
router.get("/vestibular", ProvaController.montarPorVestibular);
router.get("/topicos", ProvaController.montarPorTopico);
router.get("/ano/recente", ProvaController.listarAnoRecente);
router.get("/ano/antigo", ProvaController.listarAnoAntigo);

module.exports = router;
