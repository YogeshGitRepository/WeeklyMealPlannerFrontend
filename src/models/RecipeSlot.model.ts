import { IRecipe } from "./Recipe.model";

export interface RecipeSlot {
    id: number;
    recipe: IRecipe | null;
}