import type { Recipe } from '../types';
import RecipeList from '../components/RecipeList/RecipeList';
import { useFavorites } from '../contexts/FavoritesContext';

type Props = {
  recipes: Recipe[];
};

function FavoritesPage({ recipes }: Props) {
  const { favorites } = useFavorites();
  const favorited = recipes.filter((r) => favorites.has(r.id));

  return (
    <div className="app__container">
      <h1 className="app__heading">Favoritos</h1>
      {favorited.length === 0 ? (
        <p>Aún no tienes recetas en favoritos</p>
      ) : (
        <RecipeList recipes={favorited} />
      )}
    </div>
  );
}

export default FavoritesPage;
