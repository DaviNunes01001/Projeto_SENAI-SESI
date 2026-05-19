import "./NotFound.css";

import PageHeader from "../../components/PageHeader/PageHeader";

function NotFound() {
  return (
    <main className="page not-found-page">
      <PageHeader
        badge="404"
        title="Página não encontrada"
        description="Essa rota não existe."
      />
    </main>
  );
}

export default NotFound;
