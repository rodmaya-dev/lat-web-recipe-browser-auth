import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import LoginPage from "../../src/pages/LoginPage";
import RegisterPage from "../../src/pages/RegisterPage";
import { stubFetch } from "./helpers";

function renderPage(page: React.ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter>{page}</MemoryRouter>
    </AuthProvider>,
  );
}

/** The forms render exactly one button — the submit button. */
function submitButton() {
  return screen.getByRole("button");
}

function emailInput(container: HTMLElement) {
  return container.querySelector('input[type="email"]') as HTMLInputElement;
}

function passwordInput(container: HTMLElement) {
  return container.querySelector('input[type="password"]') as HTMLInputElement;
}

describe("Lección 05 — validación de formularios", () => {
  beforeEach(() => {
    localStorage.clear();
    stubFetch();
  });

  it("el botón de login está deshabilitado antes de escribir nada", async () => {
    renderPage(<LoginPage />);
    expect(submitButton()).toBeDisabled();
  });

  // jsdom does not implement minLength (tooShort) validation, so the
  // invalid case uses a malformed email (typeMismatch) instead.
  it("el botón de login sigue deshabilitado con un email inválido", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<LoginPage />);

    await user.type(emailInput(container), "not-an-email");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeDisabled();
  });

  it("el botón de login se habilita cuando email y contraseña son válidos", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<LoginPage />);

    await user.type(emailInput(container), "pat@example.com");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeEnabled();
  });

  it("el botón de registro se habilita solo cuando todos los campos son válidos", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<RegisterPage />);

    expect(submitButton()).toBeDisabled();

    await user.type(emailInput(container), "pat@example.com");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeEnabled();
  });
});
