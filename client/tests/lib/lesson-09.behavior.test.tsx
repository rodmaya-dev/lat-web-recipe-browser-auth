import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import App from "../../src/components/App/App";
import { mockUser, mockRecipes, stubFetch } from "./helpers";

function renderApp(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("Lección 09 — likes a través del backend", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("auth-token", "test-token");
    stubFetch({
      "GET /users/me": { data: mockUser },
      "GET /recipes": { data: mockRecipes },
      "PUT /recipes/r1/likes": { data: { ...mockRecipes[0], likes: ["u1"] } },
    });
  });

  it("muestra corazones llenos y vacíos según recipe.likes", async () => {
    renderApp("/");

    await screen.findByText("Spaghetti Carbonara");
    // r1 no tiene likes; r2 ya tiene el like del usuario mock (u1)
    expect(
      screen.getByRole("button", { name: "Añadir a favoritos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Quitar de favoritos" }),
    ).toBeInTheDocument();
  });

  it("al hacer clic en el corazón se hace PUT al endpoint de likes y el corazón se llena", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await screen.findByText("Spaghetti Carbonara");
    await user.click(
      screen.getByRole("button", { name: "Añadir a favoritos" }),
    );

    const unlikeButtons = await screen.findAllByRole("button", {
      name: "Quitar de favoritos",
    });
    expect(unlikeButtons).toHaveLength(2);
  });

  it("la página de favoritos muestra solo las recetas que le gustan al usuario actual", async () => {
    renderApp("/favorites");

    expect(await screen.findByText("Chicken Curry")).toBeInTheDocument();
    expect(screen.queryByText("Spaghetti Carbonara")).not.toBeInTheDocument();
  });
});
