export interface IRecipe {
    id: string;       
    recipeName: string;
    ingredients?: string[];
    imageUrl?: string;
    instructions?: string;
    role?: string;
  }
  