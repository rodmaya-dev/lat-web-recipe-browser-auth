import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { categoryColors, categoryLabels } from "../data/recipes";
import type { Recipe } from "../types";

type Props = {
  recipes: Recipe[];
};

function RecipePage({ recipes }: Props) {
  const { id } = useParams();
  const currentRecipe = recipes.find((recipe) => recipe.id === id);

  if (!currentRecipe) {
    return <p className="app__message">Receta no encontrada</p>;
  }

  return (
    <article className="app__container">
      <div className="recipe-detail">
        <span
          style={{
            backgroundColor: categoryColors[currentRecipe.category],
          }}
          className="recipe-detail__category"
        >
          {categoryLabels[currentRecipe.category]}
        </span>
        <h1>{currentRecipe.title}</h1>
        <p>{currentRecipe.description}</p>
        <div className="markdown">
          <ReactMarkdown>{currentRecipe.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

export default RecipePage;
