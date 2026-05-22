import styles from "./Login.module.css";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const senha = formData.get("senha");

    console.log("Email:", email);
    console.log("Senha:", senha);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.info}>
          <span>Projeto SENAI SESI</span>
          <h1>Bem-vindo de volta</h1>
          <p>Acesse sua conta para continuar usando o sistema.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha"
          />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
