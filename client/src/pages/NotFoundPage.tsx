import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main>
      <h1 className="app__heading app__heading_not-found">Página no encontrada</h1>
      <p className="app__message app__message_not-found">
        La URL que ingresaste no corresponde a ninguna página de esta aplicación.
      </p>
      <Link className="app__back" to="/">
        Volver a las recetas
      </Link>
    </main>
  );
}
