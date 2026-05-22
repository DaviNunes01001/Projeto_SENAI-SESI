import "./Login.css";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const senha = formData.get("senha");

    console.log("Email:", email);
    console.log("Senha:", senha);

    // Depois você pode conectar isso com a API/backend.
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-info">
          <span className="login-tag">Projeto Final SENAI</span>

          <h1>Bem-vindo de volta</h1>

          <p>
            Acesse sua conta para continuar usando o sistema do projeto.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Lembrar de mim
            </label>

            <a href="#">Esqueci minha senha</a>
          </div>

          <button type="submit">Entrar</button>

          <p className="register-text">
            Ainda não tem conta? <a href="#">Cadastre-se</a>
          </p>
        </form>
      </section>
    </main>
  );
}
