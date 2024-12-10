import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Pagination,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { getRecipeRecommendationsByIngredients } from '../services/Recipe.service';
import { IRecipe } from '../models/Recipe.model';
import { IIngredient } from '../models/FamilySizeAndIngredients.model';
import { ingredientsGet } from '../services/config.service';

const RecipeRecommendations: React.FC = () => {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<IRecipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ingredientsGet();
        setIngredients(response);

        const ingredientNamesList = response.map((ingredient) => ingredient.name);
        setIngredientNames(ingredientNamesList);

        if (ingredientNamesList.length > 0) {
          const recipesResponse = await getRecipeRecommendationsByIngredients(
            ingredientNamesList,
            page,
            pageSize,
            ''
          );
          setRecommendedRecipes(recipesResponse.recipes);
          setTotalCount(recipesResponse.totalCount);
        }
      } catch (err) {
        setError('Failed to fetch ingredients or recipes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRecipeClick = (recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <Box maxWidth="xl" sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Recipe Recommendations
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto', my: 2 }} />}

          <Typography variant="h5" component="h3" gutterBottom>
            Available Ingredients
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {ingredients.length === 0 && !loading && (
              <Typography variant="body1" align="center">No ingredients available.</Typography>
            )}
            {ingredients.map((ingredient) => (
              <Chip key={ingredient.id} label={ingredient.name} color="primary" />
            ))}
          </Stack>

          <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4 }}>
            Recommended Recipes
          </Typography>
          <List>
            {Array.isArray(recommendedRecipes) && recommendedRecipes.length === 0 ? (
              <Typography variant="body1" align="center">No recipes found.</Typography>
            ) : (
              recommendedRecipes.map((recipe) => (
                <ListItem
                  key={recipe.id}
                  button
                  onClick={() => handleRecipeClick(recipe)} 
                >
                  <ListItemText
                    primary={recipe.recipeName}                    
                  />
                </ListItem>
              ))
            )}
          </List>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Pagination
              count={totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0}
              page={page}
              onChange={handlePaginationChange}
              color="primary"
            />
          </Box>
        </Paper>
      </Container>

      {/* Dialog for Recipe Details */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Recipe Details</DialogTitle>
        <DialogContent dividers>
          {selectedRecipe && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRecipe.recipeName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ingredients:
              </Typography>
              <List>
                {selectedRecipe.ingredients?.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1" gutterBottom>
                Instructions:
              </Typography>
              <Typography variant="body1">
                {selectedRecipe.instructions || 'No instructions available.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeRecommendations;