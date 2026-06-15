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


// Componente: ComoFunciona - Página de tutorial/documentação interativa
// O que faz: Exibe guia em accordion sobre como usar a plataforma
// Como: Renderiza seções expansíveis com imagens e texto descritivo
// Por que: Ajuda novos usuários a entender funcionalidades da plataforma
export default function ComoFunciona() {
  // Estado: Qual accordion está aberto (null se nenhum, 1/2/3 para cada seção)
  const [aberto, setAberto] = useState(null);

  // Função: Alterna abertura de uma seção accordion
  // O que faz: Se seção está aberta, fecha; se está fechada, abre
  // Como: Compara id com estado, seta null ou o id
  // Por que: Implementa accordion interativo sem biblioteca
  const toggle = (id) => {
    setAberto(aberto === id ? null : id);
  };

  return (
    <main className={styles.page}>
      {/* Seção hero com título e descrição */}
      <section className={styles.hero}>
        <span>Como funciona</span>
        <h1>O projeto conecta React com uma API de questões.</h1>
        <p>
          O frontend usa as rotas do backend para listar e pesquisar questões de
          matemática cadastradas no PostgreSQL.
        </p>
      </section>

      {/* Seção com itens accordion */}
      <section className={styles.steps}>

        {/* Item 1: Home */}
        <article onClick={() => toggle(1)}>
          <div className={styles.header}>
            <strong>01</strong>
            <h2>Home</h2>

            <img
              className={`${styles.seta} ${
                aberto === 1 ? styles.setaAberta : ""
              }`}
              src={seta}
              alt="Seta"
            />
          </div>

          {/* Conteúdo expansível - só aparece se aberto === 1 */}
          <div
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

        {/* Item 2: Questões */}
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

          {/* Conteúdo expansível - só aparece se aberto === 2 */}
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
              />
            </p>
          </div>
        </article>


        {/* Item 3: Estudo */}
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

          {/* Conteúdo expansível - só aparece se aberto === 3 */}
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