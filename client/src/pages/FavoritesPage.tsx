import type { Recipe } from '../types';
import RecipeList from '../components/RecipeList/RecipeList';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  recipes: Recipe[];
  /** Alterna el like/favorito de una receta contra el back end */
  onToggleFavorite: (id: string) => void;
};

function FavoritesPage({ recipes, onToggleFavorite }: Props) {
  const { currentUser } = useAuth();

  /**
   * Deriva la lista de favoritos filtrando por `likes`, en vez de leerla
   * de un Set en Context. La fuente de verdad ahora es el back end: si
   * `recipes` se actualiza (por ejemplo tras un toggle), esta lista se
   * recalcula automáticamente en el siguiente render.
   */
  const likedRecipes = currentUser
    ? recipes.filter((r) => r.likes.includes(currentUser._id))
    : [];

  return (
    <div className="app__container">
      <h1 className="app__heading">Favoritos</h1>
      {likedRecipes.length === 0 ? (
        <p>Aún no tienes recetas en favoritos</p>
      ) : (
        <RecipeList recipes={likedRecipes} onToggleFavorite={onToggleFavorite} />
      )}
    </div>
  );
}

export default FavoritesPage;