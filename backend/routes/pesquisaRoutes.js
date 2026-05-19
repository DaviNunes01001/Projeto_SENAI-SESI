const express = require("express");
const router = express.Router();

const PesquisaController = require("../controllers/pesquisaControllers");

router.get("/", PesquisaController.listar);
router.get("/dificuldade", PesquisaController.filtrarPorDificuldade);
router.get("/vestibular", PesquisaController.filtrarPorVestibular);
router.get("/topicos", PesquisaController.filtrarPorTopico);
router.get("/ano/recente", PesquisaController.listarAnoRecente);
router.get("/ano/antigo", PesquisaController.listarAnoAntigo);

module.exports = router;
