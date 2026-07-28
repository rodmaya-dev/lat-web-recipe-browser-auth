import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import LoginPage from "../../src/pages/LoginPage";
import RegisterPage from "../../src/pages/RegisterPage";
import { mockUser, stubFetch } from "./helpers";

/** Shows the current pathname so tests can assert on navigation. */
function LocationProbe() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname}</p>;
}

function renderAt(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <LocationProbe />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<p>home page stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillAndSubmit(
  container: HTMLElement,
  values: Record<string, string>,
) {
  const user = userEvent.setup();
  for (const [selector, value] of Object.entries(values)) {
    await user.type(
      container.querySelector(selector) as HTMLInputElement,
      value,
    );
  }
  await user.click(screen.getByRole("button"));
}

describe("Lección 06 — flujos de login y registro", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("el formulario de login hace POST a /signin con las credenciales", async () => {
    const fetchMock = stubFetch({
      "POST /signin": { token: "test-token" },
      "GET /users/me": { data: mockUser },
    });
    const { container } = renderAt("/login");

    await fillAndSubmit(container, {
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/signin"),
    );
    expect(call).toBeDefined();
    const body = JSON.parse(String(call![1]!.body));
    expect(body.email).toBe("pat@example.com");
    expect(body.password).toBe("longenough");
  });

  it("un login exitoso guarda el token y redirige a la página principal", async () => {
    stubFetch({
      "POST /signin": { token: "test-token" },
      "GET /users/me": { data: mockUser },
    });
    const { container } = renderAt("/login");

    await fillAndSubmit(container, {
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    expect(await screen.findByText("home page stub")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBe("test-token");
  });

  it("un registro exitoso hace POST a /signup y redirige a /login", async () => {
    const fetchMock = stubFetch({
      "POST /signup": { data: mockUser },
    });
    const { container } = renderAt("/register");

    await fillAndSubmit(container, {
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/signup"),
    );
    expect(call).toBeDefined();
    expect(call![1]!.method).toBe("POST");

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/login"),
    );
  });
});
