import { useState } from "react";
import styles from "./ComoFunciona.module.css";
import seta from "../../assets/ComoFuncionaImgs/seta.png";
import login from "../../assets/ComoFuncionaImgs/home.png";
import busca from "../../assets/ComoFuncionaImgs/busca.png";
import filtro from "../../assets/ComoFuncionaImgs/filtro.png";
import lk from "../../assets/ComoFuncionaImgs/ok.png";
import antesr from "../../assets/ComoFuncionaImgs/antesR.png";
import depoisr from "../../assets/ComoFuncionaImgs/depoisR.png";
import pdf from "../../assets/ComoFuncionaImgs/pdf.png";
import indi from "../../assets/ComoFuncionaImgs/selecionar.png";
import selet from "../../assets/ComoFuncionaImgs/selecrionar_td.png";
import limpa from "../../assets/ComoFuncionaImgs/limpa.png";


export default function ComoFunciona() {
  const [aberto, setAberto] = useState(null);

  const toggle = (id) => {
    setAberto((atual) => (atual === id ? null : id));
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Guia da plataforma</span>
          <h1>Seu caminho para estudar começa aqui.</h1>
          <p>
            Conheça os recursos da plataforma e veja como encontrar questões,
            organizar sua prática e revisar cada resposta.
          </p>
          <div className={styles.heroNotes} aria-label="Resumo do guia">
            <span>03 etapas</span>
            <span>Busca, prática e revisão</span>
          </div>
        </div>
      </section>

      <section className={styles.steps} aria-label="Etapas para usar a plataforma">
        <header className={styles.stepsIntro}>
          <span>Por onde começar</span>
          <h2>Explore cada etapa</h2>
          <p>Selecione uma etapa para ver como usar os recursos.</p>
        </header>

        <article className={`${styles.step} ${aberto === 1 ? styles.stepOpen : ""}`}>
          <div className={styles.header}>
            <h2>
              <button
                className={styles.stepToggle}
                type="button"
                aria-expanded={aberto === 1}
                aria-controls="step-content-1"
                id="step-toggle-1"
                onClick={() => toggle(1)}
              >
                <strong>01</strong>
                <span>Home</span>
                <img
                  className={`${styles.seta} ${
                    aberto === 1 ? styles.setaAberta : ""
                  }`}
                  src={seta}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </h2>
          </div>

          <div
            id="step-content-1"
            role="region"
            aria-labelledby="step-toggle-1"
            aria-hidden={aberto !== 1}
            className={`${styles.conteudo} ${
              aberto === 1 ? styles.aberto : ""
            }`}
          >
            <div className={styles.conteudoInner}>
              <p>
                Ao acessar a plataforma, o usuário encontra uma mensagem de
                boas-vindas e uma visão geral dos recursos de estudo de
                matemática do projeto SESI SENAI.
              </p>
              <p>
                A página também verifica a conexão com o backend e informa
                quando a comunicação com a API está carregando, funcionando ou
                apresenta um erro.
              </p>
              <h3 className={styles.contentHeading}>
                Atalhos para os principais recursos
              </h3>
              <ul className={styles.featureList}>
                <li>
                  <strong>Tópicos</strong>
                  <span>Consulte os conteúdos matemáticos cadastrados.</span>
                </li>
                <li>
                  <strong>Questões</strong>
                  <span>Encontre as questões disponíveis na plataforma.</span>
                </li>
                <li>
                  <strong>Pesquisa e prova</strong>
                  <span>Filtre questões e monte listas de estudo.</span>
                </li>
              </ul>
              <p>
                Assim, a página inicial funciona como um painel de acesso rápido
                para começar a estudar.
              </p>
              <figure className={styles.screenshot}>
                <img
                  className={styles.login}
                  src={login}
                  alt="Página inicial da plataforma com os atalhos de estudo."
                />
                <figcaption>
                  A página inicial reúne os principais caminhos da plataforma.
                </figcaption>
              </figure>
            </div>
          </div>
        </article>

        <article className={`${styles.step} ${aberto === 2 ? styles.stepOpen : ""}`}>
          <div className={styles.header}>
            <h2>
              <button
                className={styles.stepToggle}
                type="button"
                aria-expanded={aberto === 2}
                aria-controls="step-content-2"
                id="step-toggle-2"
                onClick={() => toggle(2)}
              >
                <strong>02</strong>
                <span>Questões</span>
                <img
                  className={`${styles.seta} ${
                    aberto === 2 ? styles.setaAberta : ""
                  }`}
                  src={seta}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </h2>
          </div>

          <div
            id="step-content-2"
            role="region"
            aria-labelledby="step-toggle-2"
            aria-hidden={aberto !== 2}
            className={`${styles.conteudo} ${
              aberto === 2 ? styles.aberto : ""
            }`}
          >
            <div className={styles.conteudoInner}>
              <p>
                Pesquise questões pelo enunciado, refine os resultados com
                filtros e use as opções abaixo para revisar e guardar o que
                selecionou.
              </p>
              <div className={styles.instructionList}>
                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">🔎</span>
                    Pesquisar pelo enunciado
                  </h3>
                  <p>
                    Digite palavras-chave no campo de busca para localizar
                    questões relacionadas rapidamente.
                  </p>
                  <figure className={styles.screenshot}>
                    <img
                      className={styles.busca}
                      src={busca}
                      alt="Campo de busca de questões por palavra-chave."
                    />
                    <figcaption>
                      Use termos do enunciado para encontrar uma questão.
                    </figcaption>
                  </figure>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">🎯</span>
                    Aplicar filtros
                  </h3>
                  <p>Combine os filtros disponíveis para refinar a busca:</p>
                  <ul className={styles.detailList}>
                    <li>ID da questão</li>
                    <li>Nível: Base, Intermediário ou Avançado</li>
                    <li>Ano da prova</li>
                  </ul>
                  <figure className={styles.screenshot}>
                    <img
                      className={styles.filtro}
                      src={filtro}
                      alt="Filtros de busca por ID, nível e ano."
                    />
                    <figcaption>
                      Os filtros ajudam a chegar ao conjunto de questões
                      desejado.
                    </figcaption>
                  </figure>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">📚</span>
                    Conferir resultados
                  </h3>
                  <p>
                    Cada resultado apresenta vestibular, ano, nível, enunciado e
                    alternativas para você avaliar a questão antes de começar.
                  </p>
                  <figure className={styles.screenshot}>
                    <img
                      className={styles.lk}
                      src={lk}
                      alt="Card com o resultado de uma questão e suas alternativas."
                    />
                    <figcaption>
                      Confira os dados e as alternativas no card da questão.
                    </figcaption>
                  </figure>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">💡</span>
                    Revisar a resolução
                  </h3>
                  <p>
                    Selecione “Mostrar resposta e explicação” para conferir a
                    resposta correta e acompanhar a resolução.
                  </p>
                  <div className={styles.screenshotPair}>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.antesr}
                        src={antesr}
                        alt="Questão antes de mostrar a resposta e a explicação."
                      />
                      <figcaption>Antes de abrir a explicação.</figcaption>
                    </figure>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.depoisr}
                        src={depoisr}
                        alt="Questão com a resposta correta e a explicação abertas."
                      />
                      <figcaption>Resposta e resolução exibidas.</figcaption>
                    </figure>
                  </div>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">📄</span>
                    Baixar e selecionar questões
                  </h3>
                  <p>
                    Baixe uma questão em PDF para estudar offline ou marque
                    questões individualmente para montar uma lista.
                  </p>
                  <div className={styles.screenshotPair}>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.pdf}
                        src={pdf}
                        alt="Opção para baixar uma questão em PDF."
                      />
                      <figcaption>Baixe a questão atual.</figcaption>
                    </figure>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.indi}
                        src={indi}
                        alt="Caixa para selecionar uma questão individual."
                      />
                      <figcaption>Ou selecione questões para uma lista.</figcaption>
                    </figure>
                  </div>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">☑️</span>
                    Gerenciar a lista selecionada
                  </h3>
                  <p>
                    Use “Selecionar Todas” para marcar os resultados visíveis,
                    gere um único PDF com a lista ou limpe a seleção quando
                    quiser começar de novo.
                  </p>
                  <div className={styles.screenshotPair}>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.selet}
                        src={selet}
                        alt="Opção para selecionar todas as questões exibidas."
                      />
                      <figcaption>Marque todos os resultados exibidos.</figcaption>
                    </figure>
                    <figure className={styles.screenshot}>
                      <img
                        className={styles.pdf}
                        src={pdf}
                        alt="Opção para gerar um PDF com as questões selecionadas."
                      />
                      <figcaption>Salve a lista em um único PDF.</figcaption>
                    </figure>
                  </div>
                  <figure className={styles.screenshot}>
                    <img
                      className={styles.limpa}
                      src={limpa}
                      alt="Opção para limpar a seleção de questões."
                    />
                    <figcaption>
                      Limpe a seleção sem alterar as questões cadastradas.
                    </figcaption>
                  </figure>
                </section>

                <section className={styles.instruction}>
                  <h3 className={styles.instructionHeading}>
                    <span aria-hidden="true">🔄</span>
                    Limpar os filtros
                  </h3>
                  <p>
                    O botão “Limpar” remove os filtros aplicados e restaura a
                    listagem completa de questões.
                  </p>
                  <figure className={styles.screenshot}>
                    <img
                      className={styles.limpa}
                      src={limpa}
                      alt="Botão que restaura a listagem completa de questões."
                    />
                    <figcaption>
                      Restaure os resultados depois de pesquisar.
                    </figcaption>
                  </figure>
                </section>
              </div>
            </div>
          </div>
        </article>


        <article className={`${styles.step} ${aberto === 3 ? styles.stepOpen : ""}`}>
          <div className={styles.header}>
            <h2>
              <button
                className={styles.stepToggle}
                type="button"
                aria-expanded={aberto === 3}
                aria-controls="step-content-3"
                id="step-toggle-3"
                onClick={() => toggle(3)}
              >
                <strong>03</strong>
                <span>Estudo</span>
                <img
                  className={`${styles.seta} ${
                    aberto === 3 ? styles.setaAberta : ""
                  }`}
                  src={seta}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </h2>
          </div>

          <div
            id="step-content-3"
            role="region"
            aria-labelledby="step-toggle-3"
            aria-hidden={aberto !== 3}
            className={`${styles.conteudo} ${
              aberto === 3 ? styles.aberto : ""
            }`}
          >
            <div className={styles.conteudoInner}>
              <p>
                Use as questões e os recursos de revisão como apoio para estudar
                matemática no seu próprio ritmo.
              </p>
              <h3 className={styles.contentHeading}>
                Transforme a consulta em prática
              </h3>
              <ul className={styles.featureList}>
                <li>
                  <strong>Pratique</strong>
                  <span>
                    Explore questões de matemática disponíveis na plataforma.
                  </span>
                </li>
                <li>
                  <strong>Revise</strong>
                  <span>
                    Consulte respostas e explicações para acompanhar a resolução.
                  </span>
                </li>
                <li>
                  <strong>Prepare-se</strong>
                  <span>
                    Combine nível e ano para encontrar questões adequadas ao seu
                    objetivo.
                  </span>
                </li>
              </ul>
              <p>
                O material pode apoiar sua preparação para provas, vestibulares e
                atividades escolares.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}