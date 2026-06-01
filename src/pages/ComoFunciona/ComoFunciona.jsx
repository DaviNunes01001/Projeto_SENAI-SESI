import { useState } from "react";
import styles from "./ComoFunciona.module.css";

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
          <strong>01</strong>
          <h2>Acesso</h2>

          {aberto === 1 && (
            <p>
              O usuário se autentica no sistema através do login e senha.
            </p>
          )}
        </article>

        <article onClick={() => toggle(2)}>
  <strong>02</strong>
  <h2>Questões</h2>

  {aberto === 2 && (
    <p>
       <strong>🔎</strong>
      <br />
      Digite palavras-chave do enunciado no campo de pesquisa para encontrar questões específicas rapidamente.
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
      <br />
      <br />

       <strong>💡</strong>
      <br />
      Clique em Mostrar resposta e explicação para visualizar a alternativa correta e entender a resolução da questão.
      <br />
      <br />

       <strong>📄</strong>
      <br />
      Use o botão Baixar PDF para salvar a questão e estudá-la offline quando desejar.
    </p>
  )}
</article>

        <article onClick={() => toggle(3)}>
          <strong>03</strong>
          <h2>Estudo</h2>

          {aberto === 3 && (
            <p>
              Os alunos podem visualizar as questões disponíveis, praticar os
              conteúdos de matemática e utilizar a plataforma como apoio aos
              estudos.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}