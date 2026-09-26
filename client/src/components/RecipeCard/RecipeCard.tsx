import { useNavigate } from 'react-router';

import type { Recipe } from '../../types';
import { categoryColors, categoryLabels } from '../../data/recipes';
import { useAuth } from '../../contexts/AuthContext';
import './RecipeCard.css';

type Props = {
  recipe: Recipe;
  /** Alterna el like/favorito de esta receta contra el back end */
  onToggleFavorite: (id: string) => void;
};

function RecipeCard({ recipe, onToggleFavorite }: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  /**
   * Determina si la receta es favorita del usuario actual
   *
   * Antes esto vivía en FavoritesContext como un Set derivado de la sesión
   * del navegador. Ahora es un cálculo directo sobre el array `likes` que
   * viene del back end: la receta "sabe" a quién le gusta, en vez de que
   * el front end lleve su propia lista paralela.
   */
  const isFavorited = currentUser ? recipe.likes.includes(currentUser._id) : false;

  return (
    <article className="recipe-card">
      <button
        type="button"
        className="recipe-card__view"
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        aria-label="Ver detalles de la receta"
      ></button>
      <button
        type="button"
        className="recipe-card__favorite"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe.id);
        }}
        aria-label={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {isFavorited ? '♥' : '♡'}
      </button>
      <span
        style={{
          backgroundColor: categoryColors[recipe.category],
        }}
        className="recipe-card__category"
      >
        {categoryLabels[recipe.category]}
      </span>
      <h2 className="recipe-card__title">{recipe.title}</h2>
      <p className="recipe-card__description">{recipe.description}</p>
    </article>
  );
}

export default RecipeCard;