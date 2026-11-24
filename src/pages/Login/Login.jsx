import { useState } from "react";

import styles from "./Login.module.css";
import { apiFetch } from "../../services/api";

export default function Login({ onLogin }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const senha = formData.get("senha");

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.mensagem || "Não foi possível realizar o login.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      onLogin();
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao realizar login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.info}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              +
            </span>
            <span>Projeto SENAI SESI</span>
          </div>

          <div className={styles.infoIntro}>
            <span className={styles.eyebrow}>APRENDER, PRATICAR, AVANÇAR</span>
            <h1>
              Seu próximo
              <br />
              desafio começa <span>aqui.</span>
            </h1>
            <p>
              Entre para explorar questões e organizar seus estudos de
              matemática.
            </p>
          </div>

          <div className={styles.features}>
            <article className={styles.feature}>
              <span className={styles.featureNumber}>01</span>
              <div>
                <h2>Encontre sua próxima questão</h2>
                <p>Pesquise por vestibular, ano e nível.</p>
              </div>
            </article>
            <article className={styles.feature}>
              <span className={styles.featureNumber}>02</span>
              <div>
                <h2>Estude no seu ritmo</h2>
                <p>Explore conteúdos e tópicos de matemática.</p>
              </div>
            </article>
          </div>

          <span className={styles.infoDecoration} aria-hidden="true">
            ∑
          </span>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
        >
          <div className={styles.formHeader}>
            <span className={styles.formEyebrow}>ACESSO À PLATAFORMA</span>
            <h2>Que bom ter você de volta</h2>
            <p>Entre com seus dados para continuar.</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrap}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3.5"
                  y="5.5"
                  width="17"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="m4.5 7 7.5 5.5L19.5 7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="senha">Senha</label>
            <div className={styles.inputWrap}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4.5"
                  y="10"
                  width="15"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className={styles.spinner} aria-hidden="true" />
            )}
            <span>{isSubmitting ? "Entrando..." : "Entrar na plataforma"}</span>
            {!isSubmitting && (
              <span className={styles.buttonArrow} aria-hidden="true">
                →
              </span>
            )}
          </button>

          <div className={styles.formFooter}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>Seu espaço de estudos está a um passo.</span>
          </div>
        </form>
      </section>
    </main>
  );
}
