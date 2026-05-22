const express = require("express");
const router = express.Router();

const PesquisaController = require("../controllers/pesquisaControllers");

router.get("/", PesquisaController.listar);
router.get("/dificuldade", PesquisaController.filtrarPorDificuldade);
router.get("/dificuldade/:nivel", PesquisaController.filtrarPorDificuldade);
router.get("/vestibular", PesquisaController.filtrarPorVestibular);
router.get("/vestibular/:vestibular", PesquisaController.filtrarPorVestibular);
router.get("/topicos", PesquisaController.filtrarPorTopico);
router.get("/topicos/:topico", PesquisaController.filtrarPorTopico);
router.get("/topico", PesquisaController.filtrarPorTopico);
router.get("/topico/:topico", PesquisaController.filtrarPorTopico);
router.get("/ano/recente", PesquisaController.listarAnoRecente);
router.get("/ano/antigo", PesquisaController.listarAnoAntigo);

module.exports = router;
