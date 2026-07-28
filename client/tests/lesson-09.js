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

const app = read("src/components/App/App.tsx");
const card = read("src/components/RecipeCard/RecipeCard.tsx");
const favorites = read("src/pages/FavoritesPage.tsx");
const main = read("src/main.tsx");

test("App.tsx llama a toggleLike de api.ts", () => {
  assert(
    has(app, "toggleLike"),
    "Importa toggleLike de api.ts y llámalo en una función handleToggleFavorite",
  );
});

test("App.tsx pasa onToggleFavorite a los componentes hijos", () => {
  assert(
    has(app, "onToggleFavorite"),
    "Pasa onToggleFavorite como prop a HomePage y FavoritesPage",
  );
});

test("App.tsx actualiza el estado de recipes tras un toggle", () => {
  assert(
    has(app, "setRecipes") && has(app, "map("),
    "Cuando toggleLike se resuelva, actualiza el estado recipes mapeando el array y reemplazando la receta actualizada",
  );
});

test("RecipeCard acepta la prop onToggleFavorite", () => {
  assert(
    has(card, "onToggleFavorite"),
    "Añade onToggleFavorite: (id: string) => void a las props de RecipeCard y llámalo en el botón de corazón",
  );
});

test("RecipeCard lee recipe.likes", () => {
  assert(
    has(card, "likes"),
    "Deriva isFavorited de recipe.likes.includes(currentUser?._id)",
  );
});

test("RecipeCard lee currentUser del contexto de autenticación", () => {
  assert(
    has(card, "useAuth") || has(card, "currentUser"),
    "Importa useAuth en RecipeCard y lee currentUser para derivar isFavorited",
  );
});

test("FavoritesPage filtra las recetas por likes", () => {
  assert(
    has(favorites, "filter"),
    "Filtra el array recipes para mostrar solo las recetas cuyo array likes incluye el _id del usuario actual",
  );
});

test("FavoritesPage usa likes", () => {
  assert(
    has(favorites, "likes"),
    "Comprueba recipe.likes.includes(currentUser._id) para identificar las recetas favoritas",
  );
});

test("main.tsx ya no incluye FavoritesProvider", () => {
  assert(
    !has(main, "FavoritesProvider"),
    "Elimina FavoritesProvider de main.tsx — ya no es necesario",
  );
});

{
  const behaviorHints = {
    "muestra corazones llenos y vacíos según recipe.likes":
      "Muestra un corazón lleno si el _id del usuario está en recipe.likes; vacío si no",
    "al hacer clic en el corazón se hace PUT al endpoint de likes y el corazón se llena":
      "Llama a toggleLike al hacer clic en el corazón y actualiza el estado con la receta devuelta",
    "la página de favoritos muestra solo las recetas que le gustan al usuario actual":
      "Filtra las recetas por recipe.likes.includes(currentUser._id)",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-09.behavior.test.tsx");
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

summary("WE4ySjZX");
