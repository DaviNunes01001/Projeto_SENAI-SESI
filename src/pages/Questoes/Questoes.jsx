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

// Objeto com filtros iniciais
// Por que: Centraliza valores padrão para facilitar reset de filtros
const filtrosIniciais = {
  busca: "",
  questaoId: "",
  vestibularId: "",
  nivel: "",
  ano: "",
};

// Componente: Questoes - Página principal de listagem e gerenciamento de questões
// O que faz: Exibe questões com filtros, seleção, PDFs e painel do professor
// Como: Usa múltiplos estados para gerenciar filtros, formulários, seleção
// Por que: Página central da aplicação, onde estudantes pesquisam questões
export default function Questoes() {
  // Estado: Filtros aplicados (busca, ID, vestibular, nível, ano)
  const [filtros, setFiltros] = useState(filtrosIniciais);

  // Estado: ID da questão cuja resposta está aberta (null se nenhuma)
  const [questaoAberta, setQuestaoAberta] = useState(null);

  // Estado: Array de IDs de questões selecionadas (checkboxes)
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);

  // Estado: Modo do formulário ("" = fechado, "adicionar", "atualizar")
  const [modoFormulario, setModoFormulario] = useState("");

  // Estado: Dados do formulário de questão (preenchido quando edita)
  const [formularioQuestao, setFormularioQuestao] = useState(
    getFormularioQuestaoVazio,
  );

  // Estado: Indicador de que está salvando (desabilita botões)
  const [salvandoQuestao, setSalvandoQuestao] = useState(false);

  // Custom hooks: Carregam dados da API
  const { data: questoes, loading, error, reload } = useApi("/api/questoes");
  const { data: anos, reload: reloadAnos } = useApi("/api/questoes/anos");
  const { data: ids, reload: reloadIds } = useApi("/api/questoes/ids");
  const { data: vestibulares, reload: reloadVestibulares } = useApi(
    "/api/questoes/vestibulares",
  );

  // Computações derivadas: Dados processados para usar no render
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

  // Função: Atualiza um campo de filtro
  // O que faz: Adiciona ou modifica um filtro no objeto filtros
  // Como: usa setState com spread operator para manter outros filtros
  // Por que: Permite que dropdowns atualizem filtros em tempo real
  function atualizarFiltro(nome, valor) {
    setFiltros((atuais) => ({ ...atuais, [nome]: valor }));
  }

  // Função: Limpa estados de resultado (resposta aberta e seleções)
  // O que faz: Fecha questão aberta e desseleciona tudo
  // Como: Seta questaoAberta para null e limpa array de selecionadas
  // Por que: Mantém UI consistente quando nova busca é feita
  function limparResultadoAtual() {
    setQuestaoAberta(null);
    setQuestoesSelecionadas([]);
  }

  // Função: Realiza nova pesquisa com filtros atuais
  // O que faz: Monta URL com filtros, carrega dados, limpa resultados anteriores
  // Como: Chama preventDefault, monta URL, chama reload
  // Por que: Executada quando usuário clica "Buscar"
  function pesquisarQuestoes(event) {
    event.preventDefault();
    limparResultadoAtual();
    reload(montarUrlQuestoes(filtros));
  }

  // Função: Reseta filtros e carrega todas as questões
  // O que faz: Remove todos os filtros e retorna à lista completa
  // Como: Seta filtros para iniciais, limpa resultados, recarrega
  // Por que: Permite usuário voltar atrás se errou em filtros
  function limparBusca() {
    setFiltros(filtrosIniciais);
    limparResultadoAtual();
    reload("/api/questoes");
  }

  // Função: Alterna visibilidade da resposta de uma questão
  // O que faz: Abre resposta se fechada, fecha se aberta
  // Como: Compara ID com questaoAberta, alterna
  // Por que: Implementa accordion para mostrar/ocultar resposta
  function alternarResposta(id) {
    setQuestaoAberta((atual) => (atual === id ? null : id));
  }

  // Função: Alterna seleção de uma questão individual
  // O que faz: Adiciona ou remove questão do array selecionadas
  // Como: Chama alternarItemSelecionado do QuestoesFuncoes
  // Por que: Implementa checkbox para selecionar questão
  function alternarSelecaoQuestao(id) {
    setQuestoesSelecionadas((atuais) => alternarItemSelecionado(atuais, id));
  }

  // Função: Seleciona ou desseleciona todas as questões atuais
  // O que faz: Se todas selecionadas, desseleciona tudo; se não, seleciona tudo
  // Como: Chama selecionarTodasQuestoes
  // Por que: Implementa checkbox "Selecionar Todas"
  function alternarTodasQuestoes() {
    setQuestoesSelecionadas(
      selecionarTodasQuestoes(questoes, todasQuestoesSelecionadas),
    );
  }

  // Função: Atualiza um campo do formulário de questão
  // O que faz: Modifica valor de um campo do formulário
  // Como: Usa setState com spread para manter outros campos
  // Por que: Implementa onChange para inputs/textareas do formulário
  function atualizarCampoQuestao(nome, valor) {
    setFormularioQuestao((atual) => ({ ...atual, [nome]: valor }));
  }

  // Função: Abre formulário para adicionar nova questão
  // O que faz: Seta modo para "adicionar" e reseta formulário
  // Como: Seta modoFormulario, inicializa formulario vazio
  // Por que: Chamada quando professor clica "Adicionar questão"
  function abrirFormularioAdicionar() {
    setModoFormulario("adicionar");
    setFormularioQuestao(getFormularioQuestaoVazio());
  }

  // Função: Abre formulário para atualizar uma questão
  // O que faz: Seta modo para "atualizar" e preenche com dados da questão
  // Como: Seta modoFormulario, monta formulário com dados
  // Por que: Chamada quando professor clica "Atualizar" em uma questão
  function abrirFormularioAtualizar(questao) {
    setModoFormulario("atualizar");
    setFormularioQuestao(montarFormularioQuestao(questao));
  }

  // Função: Fecha formulário e reseta seus dados
  // O que faz: Remove modo de formulário e limpa dados
  // Como: Seta modoFormulario para "", inicializa vazio
  // Por que: Chamada quando clica "Fechar" ou após salvar com sucesso
  function fecharFormularioQuestao() {
    setModoFormulario("");
    setFormularioQuestao(getFormularioQuestaoVazio());
  }

  // Função: Recarrega todos os dados da API (questões, anos, IDs, vestibulares)
  // O que faz: Faz todas as 4 requisições em paralelo
  // Como: Promise.all com todos os reload
  // Por que: Chamada após salvar/deletar para manter dados sincronizados
  async function recarregarDadosQuestoes() {
    await Promise.all([
      reload(montarUrlQuestoes(filtros)),
      reloadAnos(),
      reloadIds(),
      reloadVestibulares(),
    ]);
  }

  // Função: Salva uma questão nova ou atualiza existente
  // O que faz: Chama função de salvar, recarrega dados, fecha formulário
  // Como: try/catch com finally para sempre limpar estado de salvando
  // Por que: Executada quando professor submete formulário
  async function salvarFormularioQuestao(event) {
    event.preventDefault();
    setSalvandoQuestao(true);

    try {
      // Salva no servidor
      await salvarQuestaoProfessor(modoFormulario, formularioQuestao);
      // Recarrega dados para refletir mudança
      await recarregarDadosQuestoes();
      // Fecha formulário
      fecharFormularioQuestao();
      alert("Questão salva com sucesso.");
    } catch (erro) {
      alert(erro.message);
    } finally {
      setSalvandoQuestao(false);
    }
  }

  // Função: Deleta uma questão após confirmação
  // O que faz: Pede confirmação, deleta, recarrega dados
  // Como: window.confirm, deletarQuestaoProfessor, atualiza UI
  // Por que: Chamada quando professor clica "Deletar"
  async function deletarQuestao(questao) {
    // Pede confirmação para evitar deletar por acaso
    const confirmou = window.confirm(`Deseja deletar a questão ${questao.id}?`);

    if (!confirmou) {
      return;
    }

    setSalvandoQuestao(true);

    try {
      // Deleta no servidor
      await deletarQuestaoProfessor(questao.id);
      // Remove questão da UI se estava aberta
      setQuestaoAberta((atual) => (atual === questao.id ? null : atual));
      // Remove questão das selecionadas se estava marcada
      setQuestoesSelecionadas((atuais) =>
        atuais.filter((id) => id !== questao.id),
      );
      // Recarrega dados
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
      {/* Seção hero com buscas e painel do professor */}
      <section className={styles.hero}>
        <span className={styles.badge}>Matemática</span>

        <h1>Questões de Matemática</h1>

        <p>Pesquise questões cadastradas no banco de dados pelo enunciado, vestibular, ano ou nível.</p>

        {/* Formulário de filtros de busca */}
        <form className={styles.searchForm} onSubmit={pesquisarQuestoes}>
          {/* Input de busca por texto (enunciado) */}
          <input
            type="text"
            placeholder="Pesquisar por enunciado..."
            value={filtros.busca}
            onChange={(event) => atualizarFiltro("busca", event.target.value)}
          />

          {/* Dropdown de ID */}
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

          {/* Dropdown de Vestibular */}
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

          {/* Dropdown de Nível */}
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

          {/* Dropdown de Ano */}
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

          {/* Botão de buscar */}
          <button type="submit">Buscar</button>

          {/* Botão de limpar (só aparece se há filtro ativo) */}
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

        {/* Painel do professor (só aparece se é professor) */}
        {professor && (
          <section className={styles.professorPanel}>
            <div className={styles.professorPanelHeader}>
              <div>
                <span>Área do professor</span>
                <h2>Gerenciar questões</h2>
              </div>

              {/* Botão para adicionar questão */}
              <button type="button" onClick={abrirFormularioAdicionar}>
                Adicionar questão
              </button>
            </div>

            {/* Formulário para criar/editar questão (só aparece se modoFormulario não é vazio) */}
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

                  {/* Botão para fechar formulário */}
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={fecharFormularioQuestao}
                  >
                    Fechar
                  </button>
                </div>

                {/* Campo de ID (só aparece em atualizar, disabled) */}
                {modoFormulario === "atualizar" && (
                  <label className={styles.formField}>
                    <span>ID</span>
                    <input type="number" value={formularioQuestao.id} disabled />
                  </label>
                )}

                {/* Campo de Enunciado */}
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

                {/* Campo de Explicação */}
                <label className={styles.formField}>
                  <span>Explicação</span>
                  <textarea
                    value={formularioQuestao.explicacao}
                    onChange={(event) =>
                      atualizarCampoQuestao("explicacao", event.target.value)
                    }
                  />
                </label>

                {/* Grid com campos numéricos e tipo */}
                <div className={styles.formGrid}>
                  {/* Subtópico ID */}
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

                  {/* Vestibular ID */}
                  <label className={styles.formField}>
                    <span>Vestibular ID</span>
                    <input
                      type="number"
                      min="1"
                      value={formularioQuestao.vestibular_id}
                      onChange={(event) =>
                        atualizarCampoQuestao("vestibular_id", event.target.value)
                      }
                    />
                  </label>

                  {/* Avaliação ID */}
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

                  {/* Tipo (Base ou Vestibular) */}
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

                {/* Campo de Conteúdo */}
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

                {/* Botões de ação do formulário */}
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

      {/* Seção de resultados/listagem de questões */}
      <section className={styles.content}>
        <div className={styles.contentHeader}>
          {/* Título de resultados e contador */}
          <div className={styles.contentTitle}>
            <h2>Resultados</h2>
            <p>{questoes.length} questão(ões)</p>
          </div>

          {/* Controles de seleção e download (só aparecem se há questões) */}
          {!loading && !error && questoes.length > 0 && (
            <div className={styles.downloadControls}>
              {/* Checkbox "Selecionar Todas" */}
              <label className={styles.bulkSelect}>
                <input
                  type="checkbox"
                  checked={todasQuestoesSelecionadas}
                  onChange={alternarTodasQuestoes}
                />
                <span>Selecionar todas</span>
              </label>

              {/* Contador de selecionadas */}
              <span className={styles.selectedCount}>
                {questoesSelecionadasVisiveis.length} selecionada(s)
              </span>

              {/* Botão de baixar selecionadas */}
              <button
                type="button"
                onClick={() =>
                  gerarPdfQuestoesSelecionadas(questoesSelecionadasVisiveis)
                }
                disabled={questoesSelecionadasVisiveis.length === 0}
              >
                Baixar selecionadas
              </button>

              {/* Botão de limpar seleção (só aparece se há selecionadas) */}
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

        {/* Mensagem de carregamento */}
        {loading && <p className={styles.status}>Carregando...</p>}

        {/* Mensagem de erro */}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

        {/* Mensagem quando não encontra questões */}
        {!loading && !error && questoes.length === 0 && (
          <p className={styles.status}>Nenhuma questão encontrada.</p>
        )}

        {/* Lista de questões */}
        {!loading && !error && questoes.length > 0 && (
          <div className={styles.list}>
            {questoes.map((questao) => {
              // Calcula dados da questão para este card
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
                  {/* Seção de vestibular com checkbox */}
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

                  {/* Seção do enunciado com alternativas */}
                  <div className={styles.enunciado}>
                    <span>Enunciado</span>
                    <h3>
                      {getEnunciadoLimpo(questao) || "Enunciado não informado."}
                    </h3>

                    {/* Alternativas (se existem) */}
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

                  {/* Botões de ação */}
                  <div className={styles.actions}>
                    {/* Botão de mostrar/ocultar resposta */}
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

                    {/* Botão de baixar PDF */}
                    <button
                      type="button"
                      className={styles.pdfButton}
                      onClick={() => gerarPdfQuestao(questao)}
                    >
                      Baixar PDF
                    </button>

                    {/* Botões de professor (só aparece se é professor) */}
                    {professor && (
                      <>
                        {/* Botão de atualizar */}
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => abrirFormularioAtualizar(questao)}
                        >
                          Atualizar
                        </button>

                        {/* Botão de deletar */}
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

                  {/* Box com resposta e explicação (só aparece se questão está aberta) */}
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
                    <span>Vestibular ID</span>
                    <input
                      type="number"
                      min="1"
                      value={formularioQuestao.vestibular_id}
                      onChange={(event) =>
                        atualizarCampoQuestao("vestibular_id", event.target.value)
                      }
                    />
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
