import React, { useState, useEffect } from 'react';
import { TextField, Card, CardContent, CardMedia, Typography, Container, Paper, Alert, Chip, Stack, CircularProgress, Pagination } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import { getRecipeRecommendations } from '../services/Recipe.service'; 
import { IRecipe } from '../models/Recipe.model';


import fallbackImage from '../assets/recipe/default_image_recipe1.jpg';

interface RecipeSearchProps {
  onSelectRecipe: (recipe: IRecipe) => void; 
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ onSelectRecipe }) => {
  const [ingredientInput, setIngredientInput] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [page, setPage] = useState<number>(1);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [pageSize] = useState<number>(12);

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients((prevIngredients) => [...prevIngredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleDeleteIngredient = (ingredientToDelete: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setTotalRecipes(0);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const role = token ? 'user' : 'anonymous';

      const fetchedData = await getRecipeRecommendations(ingredients, page, pageSize, role);
      if (fetchedData && Array.isArray(fetchedData.recipes)) {
        setRecipes(fetchedData.recipes);
        setTotalRecipes(fetchedData.totalCount);
      } else {
        setRecipes([]);
        setTotalRecipes(0);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [ingredients, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Recipe Search
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {ingredients.map((ingredient, index) => (
            <Chip
              key={index}
              label={ingredient}
              onDelete={() => handleDeleteIngredient(ingredient)}
              color="primary"
            />
          ))}
        </Stack>

        <TextField
          fullWidth
          label="Add Ingredient"
          variant="outlined"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddIngredient();
            }
          }}
          sx={{ mb: 2 }}
        />

        <Alert severity="info" sx={{ mb: 3 }}>
          Add ingredients to start searching for recipes.
        </Alert>

        {loading ? (
          <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Searching for recipes...
            </Typography>
          </Stack>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3}>
              {recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ display: 'flex', flexDirection: 'row', height: '100%' }} onClick={() => onSelectRecipe(recipe)}>
                      <CardMedia
                        component="img"
                        sx={{ width: 150, objectFit: 'cover' }}
                        image={recipe.imageUrl || fallbackImage}
                        alt={recipe.recipeName}
                      />
                      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          {recipe.recipeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                          Ingredients: {recipe.ingredients}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    No recipes found. Please try different ingredients.
                  </Typography>
                </Grid>
              )}
            </Grid>
            {totalRecipes > pageSize && (
              <Pagination
                count={Math.ceil(totalRecipes / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
              />
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RecipeSearch;
