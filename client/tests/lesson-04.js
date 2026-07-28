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

runGates(CLIENT);

const authCtx = read("src/contexts/AuthContext.tsx");
const main = read("src/main.tsx");

test("AuthContext.tsx existe", () => {
  assert(authCtx !== null, "Crea client/src/contexts/AuthContext.tsx");
});

test("Usa createContext", () => {
  assert(
    has(authCtx, "createContext"),
    'Importa y llama a createContext desde "react"',
  );
});

test("Exporta AuthProvider", () => {
  assert(
    has(authCtx, "AuthProvider"),
    "Crea y exporta una función llamada AuthProvider",
  );
});

test("Exporta el hook useAuth", () => {
  assert(
    has(authCtx, "useAuth"),
    "Exporta un hook useAuth que devuelve useContext(AuthContext)",
  );
});

test("Tiene el estado isAuthenticated", () => {
  assert(
    has(authCtx, "isAuthenticated"),
    "Añade el estado isAuthenticated a AuthProvider con valor inicial false",
  );
});

test("Tiene el estado currentUser", () => {
  assert(
    has(authCtx, "currentUser"),
    "Añade el estado currentUser a AuthProvider con valor inicial null",
  );
});

test("login asigna currentUser al argumento user", () => {
  assert(
    has(authCtx, "setCurrentUser(user)"),
    "En la función login, llama a setCurrentUser(user)",
  );
});

test("login guarda el token en localStorage", () => {
  assert(
    has(authCtx, "localStorage.setItem") && has(authCtx, "auth-token"),
    'En la función login, llama a localStorage.setItem("auth-token", token)',
  );
});

test("logout elimina el token de localStorage", () => {
  assert(
    has(authCtx, "localStorage.removeItem") && has(authCtx, "auth-token"),
    'En la función logout, llama a localStorage.removeItem("auth-token")',
  );
});

test("main.tsx envuelve App con AuthProvider", () => {
  assert(
    has(main, "AuthProvider"),
    "Importa AuthProvider y envuelve <App /> con él en client/src/main.tsx",
  );
});

{
  const behaviorHints = {
    "empieza sin sesión iniciada":
      "AuthContext debe inicializarse con isAuthenticated: false",
    "login guarda el usuario actual y el token":
      "La función login debe llamar a setCurrentUser y localStorage.setItem",
    "logout limpia el usuario y elimina el token":
      "La función logout debe limpiar currentUser y llamar a localStorage.removeItem",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-04.behavior.test.tsx");
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

summary("Uks3TTJQ");
