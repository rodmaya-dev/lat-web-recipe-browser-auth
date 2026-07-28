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

const protect = read("src/components/ProtectedRoute/ProtectedRoute.tsx");
const app = read("src/components/App/App.tsx");

test("Existe ProtectedRoute.tsx", () => {
  assert(
    protect !== null,
    "Crea client/src/components/ProtectedRoute/ProtectedRoute.tsx",
  );
});

test("ProtectedRoute está exportado", () => {
  assert(
    has(protect, "ProtectedRoute"),
    "Exporta un componente ProtectedRoute desde ProtectedRoute.tsx",
  );
});

test("PublicRoute está exportado", () => {
  assert(
    has(protect, "PublicRoute"),
    "Exporta un componente PublicRoute desde el mismo archivo",
  );
});

test("ProtectedRoute usa Navigate", () => {
  assert(
    has(protect, "Navigate"),
    'Importa Navigate de "react-router-dom" y úsalo para redirigir a los usuarios no autenticados',
  );
});

test("ProtectedRoute usa Outlet", () => {
  assert(
    has(protect, "Outlet"),
    'Importa Outlet de "react-router-dom" y renderízalo para los usuarios autenticados',
  );
});

test("ProtectedRoute lee isAuthenticated del contexto de autenticación", () => {
  assert(
    has(protect, "isAuthenticated"),
    "Llama a useAuth() en ProtectedRoute y lee isAuthenticated",
  );
});

test("App.tsx usa ProtectedRoute", () => {
  assert(
    has(app, "ProtectedRoute"),
    "Envuelve las rutas de inicio, favoritos y detalle de receta con <ProtectedRoute> en App.tsx",
  );
});

test("App.tsx usa PublicRoute", () => {
  assert(
    has(app, "PublicRoute"),
    "Envuelve /login y /register con <PublicRoute> en App.tsx",
  );
});

{
  const behaviorHints = {
    "redirige a los visitantes no autenticados de una ruta protegida a /login":
      "Usa ProtectedRoute para comprobar isAuthenticated y redirigir a /login si es false",
    "muestra las rutas públicas a los visitantes no autenticados":
      "PublicRoute debe permitir el acceso a las páginas públicas cuando no hay sesión",
    "redirige a los usuarios autenticados fuera de las rutas públicas y muestra el contenido protegido":
      "Los usuarios autenticados deben ser redirigidos de las rutas públicas al contenido protegido",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-07.behavior.test.tsx");
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

summary("SEMxWTlH");
