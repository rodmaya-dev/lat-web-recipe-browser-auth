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

const login = read("src/pages/LoginPage.tsx");
const register = read("src/pages/RegisterPage.tsx");
const app = read("src/components/App/App.tsx");

test("LoginPage.tsx existe", () => {
  assert(login !== null, "Crea client/src/pages/LoginPage.tsx");
});

test("LoginPage usa useFormWithValidation", () => {
  assert(
    has(login, "useFormWithValidation"),
    "Importa y llama a useFormWithValidation en LoginPage",
  );
});

test("LoginPage tiene un input de email", () => {
  assert(
    has(nq(login), "type='email'") && has(login, "required"),
    'Añade un <input type="email" required ... /> para el campo de email',
  );
});

test("LoginPage tiene un input de contraseña", () => {
  assert(
    has(nq(login), "type='password'") &&
      has(login, "minLength={8}") &&
      has(login, "required"),
    'Añade un <input type="password" required minLength={8} ... /> para el campo de contraseña',
  );
});

test("El formulario de LoginPage tiene noValidate", () => {
  assert(
    has(login, "noValidate"),
    "Añade el atributo noValidate al elemento <form>",
  );
});

test("El botón de envío de LoginPage se deshabilita cuando no es válido", () => {
  assert(
    has(login, "disabled={!isValid}"),
    "Deshabilita el botón de envío con disabled={!isValid}",
  );
});

test("El <form> de LoginPage tiene className='form'", () => {
  assert(
    has(nq(login), "className='form'"),
    'Añade className="form" al elemento <form> en LoginPage',
  );
});

test("LoginPage usa las clases form*", () => {
  const classes = [
    "form__title",
    "form__input-container",
    "form__label",
    "form__input",
    "form__error",
    "form__submit-btn",
  ];
  const missing = classes.filter((c) => !has(login, c));
  assert(
    missing.length === 0,
    `Debes usar las clases form* apropiadas: ${classes.map((c) => `'${c}'`).join(", ")}`,
  );
});

test("RegisterPage.tsx existe", () => {
  assert(register !== null, "Crea client/src/pages/RegisterPage.tsx");
});

test("RegisterPage usa useFormWithValidation", () => {
  assert(
    has(register, "useFormWithValidation"),
    "Importa y llama a useFormWithValidation en RegisterPage",
  );
});

test("RegisterPage tiene un input de email", () => {
  assert(
    has(nq(register), "type='email'") && has(register, "required"),
    'Añade un <input type="email" required ... /> para el campo de email',
  );
});

test("RegisterPage tiene un input de contraseña", () => {
  assert(
    has(nq(register), "type='password'") &&
      has(register, "minLength={8}") &&
      has(register, "required"),
    'Añade un <input type="password" required minLength={8} ... /> para el campo de contraseña',
  );
});

test("El formulario de RegisterPage tiene noValidate", () => {
  assert(
    has(register, "noValidate"),
    "Añade el atributo noValidate al elemento <form>",
  );
});

test("El <form> de RegisterPage tiene className='form'", () => {
  assert(
    has(nq(register), "className='form'"),
    'Añade className="form" al elemento <form> en RegisterPage',
  );
});

test("RegisterPage usa las clases form*", () => {
  const classes = [
    "form__title",
    "form__input-container",
    "form__label",
    "form__input",
    "form__error",
    "form__submit-btn",
  ];
  const missing = classes.filter((c) => !has(register, c));
  assert(
    missing.length === 0,
    `Debes usar las clases form* apropiadas: ${classes.map((c) => `'${c}'`).join(", ")}`,
  );
});

test("App.tsx tiene una ruta /login", () => {
  assert(
    has(app, "/login"),
    'Añade <Route path="/login" element={<LoginPage />} /> en App.tsx',
  );
});

test("App.tsx tiene una ruta /register", () => {
  assert(
    has(app, "/register"),
    'Añade <Route path="/register" element={<RegisterPage />} /> en App.tsx',
  );
});

{
  const behaviorHints = {
    "el botón de login está deshabilitado antes de escribir nada":
      "El botón debe estar deshabilitado cuando el formulario está vacío o no es válido",
    "el botón de login sigue deshabilitado con un email inválido":
      "Valida que el campo de email tenga un formato de email válido",
    "el botón de login se habilita cuando email y contraseña son válidos":
      "Habilita el botón solo cuando ambos campos tienen entradas válidas",
    "el botón de registro se habilita solo cuando todos los campos son válidos":
      "Ambos campos (email y contraseña) deben estar completos y ser válidos",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-05.behavior.test.tsx");
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

summary("U0o5VDRO");
