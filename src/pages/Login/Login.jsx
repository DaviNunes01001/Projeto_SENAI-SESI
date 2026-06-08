import styles from "./Login.module.css";

export default function Login({ onLogin }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const senha = formData.get("senha");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
                  }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensagem);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      onLogin();
    } catch (error) {
      console.error(error);

      alert("Erro ao realizar login");
    }
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
            required
          />
                    <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha"
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
