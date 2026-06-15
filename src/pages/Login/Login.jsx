import styles from "./Login.module.css";

// Componente: Login - Página de autenticação
// O que faz: Renderiza formulário de login, valida credenciais, obtém token
// Como: Usa fetch POST para /api/auth/login, armazena token e usuário em localStorage
// Por que: Ponto de entrada para acesso ao sistema, autentica usuário
export default function Login({ onLogin }) {
  // Função: Tratador de submit do formulário
  // O que faz: Valida email e senha, realiza requisição de login
  // Como: Extrai dados do form com FormData, faz fetch POST, armazena dados se sucesso
  // Por que: Processa tentativa de login quando usuário clica "Entrar"
  async function handleSubmit(event) {
    // Previne recarregamento da página
    event.preventDefault();

    // Extrai dados do formulário com FormData API
    const formData = new FormData(event.currentTarget);

    // Obtém email e senha do formulário
    const email = formData.get("email");
    const senha = formData.get("senha");

    try {
      // Faz requisição POST para endpoint de login
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

      // Parseia resposta JSON (contém token e dados do usuário se sucesso)
      const data = await response.json();

      // Se resposta não é OK (credenciais inválidas, usuário não existe, etc)
      if (!response.ok) {
        // Mostra mensagem de erro ao usuário
        alert(data.mensagem);
        return;
      }

      // Se login bem-sucedido, armazena token no localStorage
      // Token é necessário para requisições futuras autenticadas
      localStorage.setItem("token", data.token);

      // Armazena dados do usuário (id, email, perfil) no localStorage
      // Usado para acessar informações do usuário logado em qualquer página
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Chama callback do pai (App.jsx) para atualizar estado de login
      onLogin();
    } catch (error) {
      // Em caso de erro de rede ou parsing, exibe alerta
      console.error(error);

      alert("Erro ao realizar login");
    }
  }

  // Renderiza página de login com formulário
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {/* Seção informativa com título e descrição */}
        <div className={styles.info}>
          <span>Projeto SENAI SESI</span>
          <h1>Bem-vindo de volta</h1>
          <p>Acesse sua conta para continuar usando o sistema.</p>
        </div>

        {/* Formulário de login */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          {/* Campo de email */}
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
          />

          {/* Campo de senha */}
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha"
            required
          />

          {/* Botão de envio */}
          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
