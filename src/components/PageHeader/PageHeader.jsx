import "./PageHeader.css";

function PageHeader({ badge, title, description }) {
  return (
    <section className="page-hero">
      <span>{badge}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export default PageHeader;
