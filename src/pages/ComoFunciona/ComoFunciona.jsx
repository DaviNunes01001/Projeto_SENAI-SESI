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
            <p>
  Ao acessar a plataforma, o usuário visualiza uma mensagem de boas-vindas
  apresentando o sistema de estudos de matemática desenvolvido no projeto
  SESI SENAI.

  <br />
  <br />

  A página realiza automaticamente a verificação da conexão com o backend,
  exibindo mensagens de carregamento, sucesso ou erro na comunicação com a API.

  <br />
  <br />

  O usuário também encontra uma área com informações sobre os principais
  recursos disponíveis na plataforma.

  <br />
  <br />

  Tópicos permite visualizar os conteúdos matemáticos
  cadastrados no banco de dados.

  <br />
  <br />

  Questões possibilita consultar as questões de matemática
  disponíveis através da API.

  <br />
  <br />

  Pesquisa e Prova oferece ferramentas para filtrar questões
  e criar listas de estudo personalizadas.

  <br />
  <br />

  Dessa forma, a tela inicial funciona como um painel de acesso rápido às
  principais funcionalidades do sistema.
</p>

            <img
              className={styles.login}
              src={login}
              alt="Tela de login"
            />
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
            <p>
              <strong>🤖</strong>
              <br />
              O principal sistema da plataforma permite pesquisar questões por
              palavras-chave e aplicar filtros específicos.
             
              <br />
              <br />

              <strong>🔎</strong>
              <br />
              Digite palavras-chave do enunciado no campo de pesquisa para
              encontrar questões específicas rapidamente.

              <img
              className={styles.busca}
              src={busca}
              alt="Tela de busca"
            />
              <br />
              <br />

              <strong>🎯</strong>
              <br />
              Filtre os resultados por:
              <br />
              • ID da questão
              <br />
              • Nível (Base, Intermediário ou Avançado)
              <br />
              • Ano da prova
              <br />
              <br />
              Isso ajuda a localizar exatamente o conteúdo desejado.

              <img
              className={styles.filtro}
              src={filtro}
              alt="Tela de filtro"
            />
              <br />
              <br />

              <strong>📚</strong>
              <br />
              Após clicar em Buscar, as questões encontradas serão exibidas com:
              <br />
              • Vestibular
              <br />
              • Ano
              <br />
              • Nível
              <br />
              • Enunciado
              <br />
              • Alternativas

              <img
              className={styles.lk}
              src={lk}
              alt="Tela de ok"
            />
              <br />
              <br />

              <strong>💡</strong>
              <br />
              Clique em Mostrar resposta e explicação para visualizar a resposta
              correta e entender a resolução da questão.
              <img
              className={styles.antesr}
              src={antesr}
              alt="Tela de antes da resposta"
            />

            e depois de clicar:
            <img
              className={styles.depoisr}
              src={depoisr}
              alt="Tela de depois da resposta"
            />
              
              <br />
              <br />

              <strong>📄</strong>
              <br />
              Use o botão Baixar PDF para salvar a questão e estudá-la offline
              quando desejar.

              <img
              className={styles.pdf}
              src={pdf}
              alt="Tela de pdf"
            />

            <br />
<br />

<strong>✅</strong>
<br />
O usuário pode selecionar individualmente as questões através das caixas de seleção presentes em cada card.

<img
  className={styles.indi}
  src={indi}
  alt="Selecionar questão individual"
/>

<br />
<br />

<strong>☑️</strong>
<br />
Também é possível utilizar a opção Selecionar Todas para marcar automaticamente todas as questões exibidas nos resultados da pesquisa.

<img
  className={styles.selet}
  src={selet}
  alt="Selecionar todas as questões"
/>

<br />
<br />

<strong>📑</strong>
<br />
Após selecionar uma ou mais questões, o sistema permite gerar um único arquivo PDF contendo todas as questões escolhidas.

<img
  className={styles.pdf}
  src={pdf}
  alt="Baixar questões selecionadas"
/>

<br />
<br />

<strong>🗑️</strong>
<br />
Caso necessário, o usuário pode utilizar a opção Limpar Seleção para desmarcar rapidamente todas as questões selecionadas.

<img
  className={styles.limpa}
  src={limpa}
  alt="Limpar seleção"
/>

<br />
<br />

<strong>🔄</strong>
<br />
O botão Limpar remove todos os filtros aplicados e restaura a listagem completa de questões cadastradas na plataforma.

<img
  className={styles.limpa}
  src={limpa}
  alt="Limpar filtros"
/>  </p>
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
            <p>
              Os alunos podem visualizar as questões disponíveis, praticar os
              conteúdos de matemática e utilizar a plataforma como apoio aos
              estudos.
              <br />
              <br />
              O sistema foi desenvolvido para facilitar a preparação para provas,
              vestibulares e atividades escolares.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}