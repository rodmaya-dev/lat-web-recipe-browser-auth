import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  test,
  assert,
  normalize,
  runGates,
  checkBehavior,
  incrementPass,
  incrementFail,
  summary,
} from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT = resolve(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(resolve(CLIENT, relPath), "utf8");
  } catch {
    return null;
  }
}

function has(content, str) {
  if (!content) return false;
  return normalize(content).includes(normalize(str));
}

function nq(str) {
  return str ? str.replace(/"/g, "'") : null;
}

runGates(CLIENT);

const api = read("src/utils/api.ts");
const login = read("src/pages/LoginPage.tsx");
const register = read("src/pages/RegisterPage.tsx");

test("api.ts exporta loginUser", () => {
  assert(
    has(api, "loginUser"),
    "Añade una función loginUser(email, password) exportada en api.ts",
  );
});

test("loginUser hace POST a /signin", () => {
  assert(
    has(api, "/signin") &&
      (has(api, "method: 'POST'") || has(api, 'method: "POST"')),
    "loginUser debe hacer POST a ${AUTH_URL}/signin",
  );
});

test("api.ts exporta getCurrentUser", () => {
  assert(
    has(api, "getCurrentUser"),
    "Añade una función getCurrentUser(token) exportada en api.ts",
  );
});

test("getCurrentUser hace GET a /users/me con el token", () => {
  assert(
    has(api, "/users/me") && has(api, "Bearer"),
    "getCurrentUser debe hacer GET a ${AUTH_URL}/users/me con la cabecera Authorization: Bearer <token>",
  );
});

test("api.ts exporta registerUser", () => {
  assert(
    has(api, "registerUser"),
    "Añade una función registerUser(email, password) exportada en api.ts",
  );
});

test("registerUser hace POST a /signup", () => {
  assert(has(api, "/signup"), "registerUser debe hacer POST a ${AUTH_URL}/signup");
});

test("loginUser devuelve el token y el CurrentUser", () => {
  assert(
    has(api, "Promise<{ token: string; user: CurrentUser }>"),
    "Anota el tipo de retorno de loginUser como Promise<{ token: string; user: CurrentUser }>",
  );
});

test("registerUser devuelve un CurrentUser", () => {
  assert(
    has(api, "Promise<CurrentUser>"),
    "Anota el tipo de retorno de registerUser como Promise<CurrentUser>",
  );
});

test("LoginPage importa loginUser", () => {
  assert(
    has(login, "loginUser"),
    "Importa loginUser desde api.ts en LoginPage.tsx",
  );
});

test("LoginPage llama a la función login del contexto de autenticación", () => {
  assert(
    has(login, "useAuth") && (has(login, ".login(") || has(login, "login(")),
    "Llama a login(token, user) de useAuth() tras un loginUser correcto",
  );
});

test("LoginPage redirige tras el login", () => {
  assert(
    has(login, "navigate"),
    'Llama a navigate("/") tras un login correcto',
  );
});

test("RegisterPage importa registerUser", () => {
  assert(
    has(register, "registerUser"),
    "Importa registerUser desde api.ts en RegisterPage.tsx",
  );
});

test("RegisterPage redirige a /login tras el registro", () => {
  assert(
    has(nq(register), "navigate('/login')") || has(nq(register), "'/login'"),
    'Llama a navigate("/login") tras un registro correcto',
  );
});

{
  const behaviorHints = {
    "el formulario de login hace POST a /signin con las credenciales":
      "Llama a loginUser(email, password) al enviar el formulario",
    "un login exitoso guarda el token y redirige a la página principal":
      "Guarda el token en localStorage y navega a / tras un login correcto",
    "un registro exitoso hace POST a /signup y redirige a /login":
      "Llama a registerUser y navega a /login tras un registro correcto",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-06.behavior.test.tsx");
  if (result.tests.length > 0) {
    const headingIcon = result.ok ? "✅" : "❌";
    console.log(`${headingIcon} Pruebas de comportamiento`);
    result.tests.forEach((t) => {
      const icon = t.passed ? "✅" : "❌";
      const hint = t.passed ? "" : ` — ${behaviorHints[t.name] || ""}`;
      console.log(`  ${icon} ${t.name}${hint}`);
      if (t.passed) incrementPass();
      else incrementFail();
    });
    if (!result.ok) {
      const indentedMessage = result.message
        .split("\n")
        .map((line) => (line ? "  " + line : line))
        .join("\n");
      console.log(indentedMessage);
    }
  } else if (!result.ok) {
    console.log("❌ Pruebas de comportamiento —");
    console.log(result.message);
    incrementFail();
  }
}

summary("V1Y2WDhR");
