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
const protect = read("src/components/ProtectedRoute/ProtectedRoute.tsx");
const header = read("src/components/Header/Header.tsx");

test("AuthContextValue incluye isLoading: boolean", () => {
  assert(
    /type\s+AuthContextValue\s*=\s*\{[\s\S]*?isLoading\s*:\s*boolean/.test(
      authCtx,
    ),
    "Añade isLoading: boolean al tipo AuthContextValue",
  );
});

test("El valor por defecto de createContext incluye isLoading: false", () => {
  assert(
    /createContext\s*<[^>]*>\s*\(\s*\{[\s\S]*?isLoading\s*:\s*false/.test(
      authCtx,
    ),
    "Pasa isLoading: false al valor por defecto de createContext",
  );
});

test("El value del Provider incluye isLoading", () => {
  assert(
    /value\s*=\s*\{\s*[\s\S]*?isLoading[\s\S]*?\}/.test(authCtx),
    "Incluye isLoading en el value del Provider",
  );
});

test("AuthContext usa useEffect", () => {
  assert(
    has(authCtx, "useEffect"),
    "Importa useEffect y añade un efecto que compruebe el token al montar",
  );
});

test("AuthContext llama a getCurrentUser en el efecto", () => {
  assert(
    has(authCtx, "getCurrentUser"),
    "Importa getCurrentUser de api.ts y llámalo dentro del useEffect",
  );
});

test("ProtectedRoute maneja isLoading", () => {
  assert(
    has(protect, "isLoading"),
    "Lee isLoading de useAuth() y devuelve null mientras sea true, tanto en ProtectedRoute como en PublicRoute",
  );
});

test("Header usa el contexto de autenticación para cerrar sesión", () => {
  assert(
    has(header, "useAuth") || has(header, "logout"),
    "Importa useAuth en Header.tsx y conecta un botón de cerrar sesión",
  );
});

test("Header muestra el usuario con la sesión iniciada", () => {
  assert(
    has(header, "currentUser") || has(header, "email"),
    "Muestra currentUser.email en la cabecera cuando hay una sesión iniciada",
  );
});

{
  const behaviorHints = {
    "restaura la sesión cuando hay un token válido guardado":
      "Comprueba el token en localStorage al montar y llama a getCurrentUser() para restaurar la sesión",
    "descarta un token inválido y permanece sin sesión":
      "Cuando getCurrentUser() falla, elimina el token inválido de localStorage en el catch",
    "no llama a la API cuando no hay token guardado":
      "Llama a getCurrentUser() solo si hay un token en localStorage",
    "la cabecera muestra los enlaces de inicio de sesión y registro solo cuando no hay sesión":
      "Muestra los enlaces de inicio de sesión y registro solo cuando isAuthenticated es false",
    "la cabecera muestra el botón de cerrar sesión y el usuario solo cuando hay sesión":
      "Añade un p.header__text con el email y un button.header__logout-btn, visibles solo cuando isAuthenticated es true",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-08.behavior.test.tsx");
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

summary("RFA0SzdS");
