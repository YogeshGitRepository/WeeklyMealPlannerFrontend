import axios from 'axios';
import { IRecipe } from '../models/Recipe.model';

const API_URL = 'http://localhost:5000/api';

export const getRecipeRecommendations = async (ingredients: string[], page: number, pageSize: number, role: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/recipe/recommend`, {
      ingredients: ingredients, 
      pageNumber: page, 
      pageSize: pageSize,
      role: role 
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching recipe recommendations:", error);
    throw new Error("Failed to fetch recipe recommendations");
  }
};
export const getRecipeRecommendationsByIngredients = async (ingredients: string[], page: number, pageSize: number, role: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/recipe/recommendByIngredients`, {
      ingredients: ingredients,
      pageNumber: page,
      pageSize: pageSize,
      role: role 
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching recipe recommendations:", error);
    throw new Error("Failed to fetch recipe recommendations");
  }
};

