export type DietaryType = "Vegetarian" | "Non-Vegetarian";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export interface IngredientItem {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: DifficultyLevel;
  dietary: DietaryType;
  cuisine: string;
  ingredients: IngredientItem[];
  instructions: string[];
  isAiGenerated?: boolean;
  matchNote?: string;
}

export interface MatchedRecipe extends Recipe {
  matchedIngredients: string[];
  missingIngredients: IngredientItem[];
  matchPercentage: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  recipeTitle?: string;
  checked: boolean;
}
