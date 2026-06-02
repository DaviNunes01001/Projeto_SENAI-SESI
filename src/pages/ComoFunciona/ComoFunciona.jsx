import { useState } from "react";
import styles from "./ComoFunciona.module.css";
import seta from "../../assets/ComoFuncionaImgs/seta.png";
import login from "../../assets/ComoFuncionaImgs/login.png";
import busca from "../../assets/ComoFuncionaImgs/busca.png";
import filtro from "../../assets/ComoFuncionaImgs/filtro.png";
import lk from "../../assets/ComoFuncionaImgs/ok.png";
import antesr from "../../assets/ComoFuncionaImgs/antesR.png";
import depoisr from "../../assets/ComoFuncionaImgs/depoisR.png";
import pdf from "../../assets/ComoFuncionaImgs/pdf.png";

export default function ComoFunciona() {
  const [aberto, setAberto] = useState(null);

  const toggle = (id) => {
    setAberto(aberto === id ? null : id);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span>Como funciona</span>
        <h1>O projeto conecta React com uma API de questões.</h1>
        <p>
          O frontend usa as rotas do backend para listar e pesquisar questões de
          matemática cadastradas no PostgreSQL.
        </p>
      </section>

      <section className={styles.steps}>

        <article onClick={() => toggle(1)}>
          <div className={styles.header}>
            <strong>01</strong>
            <h2>Acesso</h2>

            <img
              className={`${styles.seta} ${
                aberto === 1 ? styles.setaAberta : ""
              }`}
              src={seta}
              alt="Seta"
            />
          </div>

          <div
            className={`${styles.conteudo} ${
              aberto === 1 ? styles.aberto : ""
            }`}
          >
            <p>
              O usuário usa seu login e senha para se autenticar e acessar a
              plataforma.
              <br />
              <br />
              Após o login, todas as funcionalidades do sistema ficam
              disponíveis para consulta e estudo.
            </p>

            <img
              className={styles.login}
              src={login}
              alt="Tela de login"
            />
          </div>
        </article>

        <article onClick={() => toggle(2)}>
          <div className={styles.header}>
            <strong>02</strong>
            <h2>Questões</h2>

            <img
              className={`${styles.seta} ${
                aberto === 2 ? styles.setaAberta : ""
              }`}
              src={seta}
              alt="Seta"
            />
          </div>

          <div
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
            </p>
          </div>
        </article>


        <article onClick={() => toggle(3)}>
          <div className={styles.header}>
            <strong>03</strong>
            <h2>Estudo</h2>

            <img
              className={`${styles.seta} ${
                aberto === 3 ? styles.setaAberta : ""
              }`}
              src={seta}
              alt="Seta"
            />
          </div>

          <div
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