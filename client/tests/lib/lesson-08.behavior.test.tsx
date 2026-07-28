import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext";
import Header from "../../src/components/Header/Header";
import { mockUser, stubFetch } from "./helpers";

/** Reports the auth state, including the loading phase. */
function Probe() {
  const { isLoading, isAuthenticated, currentUser } = useAuth();
  if (isLoading) return <p>loading</p>;
  return (
    <p>
      {isAuthenticated ? `signed in as ${currentUser?.email}` : "signed out"}
    </p>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

describe("Lección 08 — restaurar la sesión al iniciar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restaura la sesión cuando hay un token válido guardado", async () => {
    localStorage.setItem("auth-token", "stored-token");
    const fetchMock = stubFetch({ "GET /users/me": { data: mockUser } });

    renderProbe();

    expect(
      await screen.findByText("signed in as pat@example.com"),
    ).toBeInTheDocument();
    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/users/me"),
    );
    expect(call).toBeDefined();
  });

  it("descarta un token inválido y permanece sin sesión", async () => {
    localStorage.setItem("auth-token", "expired-token");
    stubFetch(); // toda petición, incluida /users/me, falla

    renderProbe();

    expect(await screen.findByText("signed out")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBeNull();
  });

  it("no llama a la API cuando no hay token guardado", async () => {
    const fetchMock = stubFetch();

    renderProbe();

    expect(await screen.findByText("signed out")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("la cabecera muestra los enlaces de inicio de sesión y registro solo cuando no hay sesión", async () => {
    stubFetch();

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      await screen.findByRole("link", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registrarse/i }),
    ).toBeInTheDocument();
  });

  it("la cabecera muestra el botón de cerrar sesión y el usuario solo cuando hay sesión", async () => {
    localStorage.setItem("auth-token", "test-token");
    stubFetch({ "GET /users/me": { data: mockUser } });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(await screen.findByText("pat@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cerrar sesión/i }),
    ).toBeInTheDocument();
  });
});
