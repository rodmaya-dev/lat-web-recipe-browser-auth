import type { Recipe } from "../../types";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeList.css";

type Props = {
  recipes: Recipe[];
  /** Alterna el like/favorito de una receta contra el back end */
  onToggleFavorite: (id: string) => void;
};

function RecipeList({ recipes, onToggleFavorite }: Props) {
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-list__item">
          <RecipeCard recipe={recipe} onToggleFavorite={onToggleFavorite} />
        </li>
      ))}
    </ul>
  );
}

export default RecipeList;