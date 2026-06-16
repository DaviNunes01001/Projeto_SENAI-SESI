import { useState } from "react";
import { isProfessor } from "../../hooks/auth";
import useApi from "../../hooks/useApi";
import styles from "./Questoes.module.css";
import {
  alternarItemSelecionado,
  deletarQuestaoProfessor,
  formatarVestibular,
  gerarPdfQuestao,
  gerarPdfQuestoesSelecionadas,
  getAnosDisponiveis,
  getEnunciadoLimpo,
  getFormularioQuestaoVazio,
  getIdsDisponiveis,
  getQuestoesSelecionadasVisiveis,
  getRespostaCorreta,
  getVestibularesDisponiveis,
  montarFormularioQuestao,
  montarUrlQuestoes,
  salvarQuestaoProfessor,
  selecionarTodasQuestoes,
} from "./QuestoesFuncoes";

const filtrosIniciais = {
  busca: "",
  questaoId: "",
  vestibularId: "",
  nivel: "",
  ano: "",
};

export default function Questoes() {
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [questaoAberta, setQuestaoAberta] = useState(null);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const [modoFormulario, setModoFormulario] = useState("");
  const [formularioQuestao, setFormularioQuestao] = useState(
    getFormularioQuestaoVazio,
  );
  const [salvandoQuestao, setSalvandoQuestao] = useState(false);
  const { data: questoes, loading, error, reload } = useApi("/api/questoes");
  const { data: anos, reload: reloadAnos } = useApi("/api/questoes/anos");
  const { data: ids, reload: reloadIds } = useApi("/api/questoes/ids");
  const { data: vestibulares, reload: reloadVestibulares } = useApi(
    "/api/questoes/vestibulares",
  );
  const anosDisponiveis = getAnosDisponiveis(anos);
  const idsDisponiveis = getIdsDisponiveis(ids);
  const vestibularesDisponiveis = getVestibularesDisponiveis(vestibulares);
  const questoesSelecionadasVisiveis = getQuestoesSelecionadasVisiveis(
    questoes,
    questoesSelecionadas,
  );
  const todasQuestoesSelecionadas =
    questoes.length > 0 && questoesSelecionadasVisiveis.length === questoes.length;
  const temFiltroAtivo = Object.values(filtros).some(Boolean);
  const professor = isProfessor();

  function atualizarFiltro(nome, valor) {
    setFiltros((atuais) => ({ ...atuais, [nome]: valor }));
  }

  function limparResultadoAtual() {
    setQuestaoAberta(null);
    setQuestoesSelecionadas([]);
  }

  function pesquisarQuestoes(event) {
    event.preventDefault();
    limparResultadoAtual();
    reload(montarUrlQuestoes(filtros));
  }

  function limparBusca() {
    setFiltros(filtrosIniciais);
    limparResultadoAtual();
    reload("/api/questoes");
  }

  function alternarResposta(id) {
    setQuestaoAberta((atual) => (atual === id ? null : id));
  }

  function alternarSelecaoQuestao(id) {
    setQuestoesSelecionadas((atuais) => alternarItemSelecionado(atuais, id));
  }

  function alternarTodasQuestoes() {
    setQuestoesSelecionadas(
      selecionarTodasQuestoes(questoes, todasQuestoesSelecionadas),
    );
  }

  function atualizarCampoQuestao(nome, valor) {
    setFormularioQuestao((atual) => ({ ...atual, [nome]: valor }));
  }

  function abrirFormularioAdicionar() {
    setModoFormulario("adicionar");
    setFormularioQuestao(getFormularioQuestaoVazio());
  }

  function abrirFormularioAtualizar(questao) {
    setModoFormulario("atualizar");
    setFormularioQuestao(montarFormularioQuestao(questao));
  }

  function fecharFormularioQuestao() {
    setModoFormulario("");
    setFormularioQuestao(getFormularioQuestaoVazio());
  }

  async function recarregarDadosQuestoes() {
    await Promise.all([
      reload(montarUrlQuestoes(filtros)),
      reloadAnos(),
      reloadIds(),
      reloadVestibulares(),
    ]);
  }

  async function salvarFormularioQuestao(event) {
    event.preventDefault();
    setSalvandoQuestao(true);

    try {
      await salvarQuestaoProfessor(modoFormulario, formularioQuestao);
      await recarregarDadosQuestoes();
      fecharFormularioQuestao();
      alert("Questão salva com sucesso.");
    } catch (erro) {
      alert(erro.message);
    } finally {
      setSalvandoQuestao(false);
    }
  }

  async function deletarQuestao(questao) {
    const confirmou = window.confirm(`Deseja deletar a questão ${questao.id}?`);

    if (!confirmou) {
      return;
    }

    setSalvandoQuestao(true);

    try {
      await deletarQuestaoProfessor(questao.id);
      setQuestaoAberta((atual) => (atual === questao.id ? null : atual));
      setQuestoesSelecionadas((atuais) =>
        atuais.filter((id) => id !== questao.id),
      );
      await recarregarDadosQuestoes();
      alert("Questão deletada com sucesso.");
    } catch (erro) {
      alert(erro.message);
    } finally {
      setSalvandoQuestao(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}>Matemática</span>

        <h1>Questões de Matemática</h1>

        <p>Pesquise questões cadastradas no banco de dados pelo enunciado, vestibular, ano ou nível.</p>

        <form className={styles.searchForm} onSubmit={pesquisarQuestoes}>
          <input
            type="text"
            placeholder="Pesquisar por enunciado..."
            value={filtros.busca}
            onChange={(event) => atualizarFiltro("busca", event.target.value)}
          />

          <label className={styles.levelFilter}>
            <span>ID</span>
            <select
              value={filtros.questaoId}
              onChange={(event) => atualizarFiltro("questaoId", event.target.value)}
            >
              <option value="">Todos</option>
              {idsDisponiveis.map((idDisponivel) => (
                <option key={idDisponivel} value={idDisponivel}>
                  {idDisponivel}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.levelFilter}>
            <span>Vestibular</span>
            <select
              value={filtros.vestibularId}
              onChange={(event) =>
                atualizarFiltro("vestibularId", event.target.value)
              }
            >
              <option value="">Todos</option>
              {vestibularesDisponiveis.map((vestibular) => (
                <option key={vestibular.id} value={vestibular.id}>
                  {formatarVestibular(vestibular)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.levelFilter}>
            <span>Nível</span>
            <select
              value={filtros.nivel}
              onChange={(event) => atualizarFiltro("nivel", event.target.value)}
            >
              <option value="">Todos</option>
              <option value="base">Base</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </label>

          <label className={styles.levelFilter}>
            <span>Ano</span>
            <select
              value={filtros.ano}
              onChange={(event) => atualizarFiltro("ano", event.target.value)}
            >
              <option value="">Todos</option>
              {anosDisponiveis.map((anoDisponivel) => (
                <option key={anoDisponivel} value={anoDisponivel}>
                  {anoDisponivel}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Buscar</button>

          {temFiltroAtivo && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={limparBusca}
            >
              Limpar
            </button>
          )}
        </form>

        {professor && (
          <section className={styles.professorPanel}>
            <div className={styles.professorPanelHeader}>
              <div>
                <span>Área do professor</span>
                <h2>Gerenciar questões</h2>
              </div>

              <button type="button" onClick={abrirFormularioAdicionar}>
                Adicionar questão
              </button>
            </div>

            {modoFormulario && (
              <form
                className={styles.professorForm}
                onSubmit={salvarFormularioQuestao}
              >
                <div className={styles.professorFormHeader}>
                  <h3>
                    {modoFormulario === "adicionar"
                      ? "Adicionar questão"
                      : `Atualizar questão ${formularioQuestao.id}`}
                  </h3>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={fecharFormularioQuestao}
                  >
                    Fechar
                  </button>
                </div>

                {modoFormulario === "atualizar" && (
                  <label className={styles.formField}>
                    <span>ID</span>
                    <input type="number" value={formularioQuestao.id} disabled />
                  </label>
                )}

                <label className={styles.formField}>
                  <span>Enunciado</span>
                  <textarea
                    value={formularioQuestao.enunciado}
                    onChange={(event) =>
                      atualizarCampoQuestao("enunciado", event.target.value)
                    }
                    required={modoFormulario === "adicionar"}
                  />
                </label>

                <label className={styles.formField}>
                  <span>Explicação</span>
                  <textarea
                    value={formularioQuestao.explicacao}
                    onChange={(event) =>
                      atualizarCampoQuestao("explicacao", event.target.value)
                    }
                  />
                </label>

                <div className={styles.formGrid}>
                  <label className={styles.formField}>
                    <span>Subtópico ID</span>
                    <input
                      type="number"
                      min="1"
                      value={formularioQuestao.subtopico_id}
                      onChange={(event) =>
                        atualizarCampoQuestao("subtopico_id", event.target.value)
                      }
                      required={modoFormulario === "adicionar"}
                    />
                  </label>

                  <label className={styles.formField}>
                    <span>Vestibular</span>
                    <select
                      value={formularioQuestao.vestibular_id}
                      onChange={(event) =>
                        atualizarCampoQuestao("vestibular_id", event.target.value)
                      }
                    >
                      <option value="">Não informado</option>
                      {vestibularesDisponiveis.map((vestibular) => (
                        <option key={vestibular.id} value={vestibular.id}>
                          {formatarVestibular(vestibular)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.formField}>
                    <span>Ano</span>
                    <select
                      value={formularioQuestao.ano}
                      onChange={(event) =>
                        atualizarCampoQuestao("ano", event.target.value)
                      }
                    >
                      <option value="">Não informado</option>
                      {anosDisponiveis.map((anoDisponivel) => (
                        <option key={anoDisponivel} value={anoDisponivel}>
                          {anoDisponivel}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.formField}>
                    <span>Avaliação ID</span>
                    <input
                      type="number"
                      min="1"
                      value={formularioQuestao.avaliacao_id}
                      onChange={(event) =>
                        atualizarCampoQuestao("avaliacao_id", event.target.value)
                      }
                    />
                  </label>

                  <label className={styles.formField}>
                    <span>Tipo</span>
                    <select
                      value={formularioQuestao.tipo}
                      onChange={(event) =>
                        atualizarCampoQuestao("tipo", event.target.value)
                      }
                    >
                      <option value="base">Base</option>
                      <option value="vestibular">Vestibular</option>
                    </select>
                  </label>
                </div>

                <label className={styles.formField}>
                  <span>Conteúdo</span>
                  <input
                    type="text"
                    value={formularioQuestao.conteudo}
                    onChange={(event) =>
                      atualizarCampoQuestao("conteudo", event.target.value)
                    }
                    placeholder="Opcional"
                  />
                </label>

                <div className={styles.professorFormActions}>
                  <button type="submit" disabled={salvandoQuestao}>
                    {salvandoQuestao ? "Salvando..." : "Salvar questão"}
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={fecharFormularioQuestao}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </section>

      <section className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.contentTitle}>
            <h2>Resultados</h2>
            <p>{questoes.length} questão(ões)</p>
          </div>

          {!loading && !error && questoes.length > 0 && (
            <div className={styles.downloadControls}>
              <label className={styles.bulkSelect}>
                <input
                  type="checkbox"
                  checked={todasQuestoesSelecionadas}
                  onChange={alternarTodasQuestoes}
                />
                <span>Selecionar todas</span>
              </label>

              <span className={styles.selectedCount}>
                {questoesSelecionadasVisiveis.length} selecionada(s)
              </span>

              <button
                type="button"
                onClick={() =>
                  gerarPdfQuestoesSelecionadas(questoesSelecionadasVisiveis)
                }
                disabled={questoesSelecionadasVisiveis.length === 0}
              >
                Baixar selecionadas
              </button>

              {questoesSelecionadasVisiveis.length > 0 && (
                <button
                  type="button"
                  className={styles.clearSelectionButton}
                  onClick={() => setQuestoesSelecionadas([])}
                >
                  Limpar seleção
                </button>
              )}
            </div>
          )}
        </div>

        {loading && <p className={styles.status}>Carregando...</p>}

        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

        {!loading && !error && questoes.length === 0 && (
          <p className={styles.status}>Nenhuma questão encontrada.</p>
        )}

        {!loading && !error && questoes.length > 0 && (
          <div className={styles.list}>
            {questoes.map((questao) => {
              const respostaCorreta = getRespostaCorreta(questao);
              const aberta = questaoAberta === questao.id;
              const selecionada = questoesSelecionadas.includes(questao.id);

              return (
                <article
                  className={`${styles.card} ${
                    selecionada ? styles.selectedCard : ""
                  }`}
                  key={questao.id}
                >
                  <div className={styles.vestibular}>
                    <label className={styles.cardCheckbox}>
                      <input
                        type="checkbox"
                        checked={selecionada}
                        onChange={() => alternarSelecaoQuestao(questao.id)}
                        aria-label={`Selecionar questão ${questao.id}`}
                      />
                      <span>Selecionar</span>
                    </label>

                    <span>Vestibular</span>
                    <strong>{questao.vestibular || "Não informado"}</strong>
                    {questao.ano && <small>{questao.ano}</small>}
                    {questao.nivel && <small>{questao.nivel}</small>}
                  </div>

                  <div className={styles.enunciado}>
                    <span>Enunciado</span>
                    <h3>
                      {getEnunciadoLimpo(questao) || "Enunciado não informado."}
                    </h3>

                    {questao.alternativas?.length > 0 && (
                      <div className={styles.alternativas}>
                        {questao.alternativas.map((alternativa) => (
                          <p key={`${questao.id}-${alternativa.letra}`}>
                            <strong>{alternativa.letra})</strong>{" "}
                            {alternativa.texto}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.answerButton}
                      onClick={() => alternarResposta(questao.id)}
                      aria-expanded={aberta}
                    >
                      {aberta
                        ? "Ocultar resposta"
                        : "Mostrar resposta e explicação"}
                    </button>

                    <button
                      type="button"
                      className={styles.pdfButton}
                      onClick={() => gerarPdfQuestao(questao)}
                    >
                      Baixar PDF
                    </button>

                    {professor && (
                      <>
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => abrirFormularioAtualizar(questao)}
                        >
                          Atualizar
                        </button>

                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => deletarQuestao(questao)}
                          disabled={salvandoQuestao}
                        >
                          Deletar
                        </button>
                      </>
                    )}
                  </div>

                  {aberta && (
                    <div className={styles.answerBox}>
                      <div>
                        <span>Resposta</span>
                        <p>
                          {respostaCorreta
                            ? `${respostaCorreta.letra}) ${respostaCorreta.texto}`
                            : "Resposta não cadastrada."}
                        </p>
                      </div>

                      <div>
                        <span>Explicação</span>
                        <p>
                          {questao.explicacao || "Explicação não cadastrada."}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
