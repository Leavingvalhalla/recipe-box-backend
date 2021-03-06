import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import EditRecipe from './EditRecipe';

function RecipeList({ user, userRecipes }) {
  const [recipes, setRecipes] = useState([]);
  const [editRecipe, setEditRecipe] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/userpage') {
      setRecipes(userRecipes);
    } else {
      fetch('/recipes')
        .then((res) => res.json())
        .then((data) => setRecipes(data));
    }
  }, [user, location.pathname, userRecipes]);

  function handleDeleteRecipe(recipe_id) {
    fetch(`/recipes/${recipe_id}`, {
      method: 'DELETE',
    });
    setRecipes(recipes.filter((recipe) => recipe.id !== recipe_id));
  }

  function handleUnsaveRecipe(recipe_id) {
    fetch(`/users/${user.id}/bookmarks/${recipe_id}`, {
      method: 'DELETE',
    });
    setRecipes(recipes.filter((recipe) => recipe.id !== recipe_id));
  }

  function handleEditRecipe(recipe) {
    setEditRecipe(true);
    setRecipeToEdit(recipe);
  }

  function handleEditSubmit(id, new_recipe) {
    fetch(`/recipes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(new_recipe),
    }).then((res) => res.json());
    setRecipes(
      recipes.map((recipe) => (recipe.id === id ? new_recipe : recipe))
    );
    setEditRecipe(false);
  }

  return (
    <div className="recipe-div">
      {editRecipe && (
        <EditRecipe
          recipeToEdit={recipeToEdit}
          handleEditSubmit={handleEditSubmit}
        />
      )}
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          user={user}
          recipe={recipe}
          handleUnsaveRecipe={handleUnsaveRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          handleEditRecipe={handleEditRecipe}
        />
      ))}
    </div>
  );
}

export default RecipeList;
