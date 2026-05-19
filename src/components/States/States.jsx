import "./States.css";

export function Loading() {
  return <div className="state-card">Carregando dados...</div>;
}

export function ErrorMessage({ message }) {
  return <div className="state-card error">Erro: {message}</div>;
}

export function EmptyMessage({ children }) {
  return <div className="state-card">{children}</div>;
}
