"use client";

import { useEffect, useState } from "react";
import {
  X,
  Heart,
  Clock,
  ChefHat,
  Users,
  Check,
  Plus,
  ShoppingBag,
  Leaf,
  Drumstick,
  ArrowRight,
} from "lucide-react";
import RecipeImage from "./RecipeImage";
import { IngredientItem, MatchedRecipe } from "@/types/recipe";

interface RecipeDetailModalProps {
  recipe: MatchedRecipe | null;
  hasPantryItems: boolean;
  isFavourite: boolean;
  alternativeRecipes?: MatchedRecipe[];
  onClose: () => void;
  onToggleFavourite: (recipe: MatchedRecipe) => void;
  onSelectAlternative?: (recipe: MatchedRecipe) => void;
  onAddMissingToShoppingList: (
    ingredients: IngredientItem[],
    recipeTitle: string
  ) => void;
}

export default function RecipeDetailModal({
  recipe,
  hasPantryItems,
  isFavourite,
  alternativeRecipes = [],
  onClose,
  onToggleFavourite,
  onSelectAlternative,
  onAddMissingToShoppingList,
}: RecipeDetailModalProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setCompletedSteps([]);
    setAddedFeedback(false);
  }, [recipe?.id]);

  useEffect(() => {
    if (!recipe) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recipe, onClose]);

  if (!recipe) return null;

  const missingNames = new Set(
    recipe.missingIngredients.map((item) => item.name.toLowerCase())
  );

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddAllMissing = () => {
    if (recipe.missingIngredients.length === 0) return;
    onAddMissingToShoppingList(recipe.missingIngredients, recipe.title);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  };

  const handleAddSingleIngredient = (item: IngredientItem) => {
    onAddMissingToShoppingList([item], recipe.title);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-[#1B261E]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-4xl bg-[#F8F6F1] sm:rounded-2xl border border-[#E2DDD3] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-[#E2DDD3]">
          <div className="text-xs font-medium text-[#556358] truncate">
            {recipe.cuisine} · {recipe.dietary} · {recipe.difficulty}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavourite(recipe)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                isFavourite
                  ? "bg-[#2D5A3D] text-white border-[#2D5A3D]"
                  : "bg-white text-[#1B261E] border-[#E2DDD3] hover:bg-[#F1EDE4]"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`}
                aria-hidden="true"
              />
              <span>{isFavourite ? "Saved" : "Save Favourite"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close recipe details"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[#E2DDD3] text-[#1B261E] hover:bg-[#F1EDE4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Hero Photo & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8 bg-white border-b border-[#E2DDD3]">
          <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-[#EEF3EC]">
            <RecipeImage
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D5A3D] mb-2">
              {recipe.dietary === "Vegetarian" ? (
                <Leaf className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Drumstick className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{recipe.dietary}</span>
              <span aria-hidden="true" className="text-[#556358]">
                ·
              </span>
              <span className="text-[#556358]">{recipe.cuisine}</span>
            </div>

            <h2
              id="recipe-modal-title"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#1B261E] leading-tight mb-3"
            >
              {recipe.title}
            </h2>

            <p className="text-sm sm:text-base text-[#556358] leading-relaxed mb-5">
              {recipe.description}
            </p>

            {/* Key Prep Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2DDD3] tabular-nums">
              <div className="flex items-center gap-2">
                <Clock
                  className="w-4 h-4 text-[#2D5A3D] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-[11px] text-[#556358]">Prep & Cook</div>
                  <div className="text-sm font-semibold text-[#1B261E]">
                    {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChefHat
                  className="w-4 h-4 text-[#2D5A3D] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-[11px] text-[#556358]">Difficulty</div>
                  <div className="text-sm font-semibold text-[#1B261E]">
                    {recipe.difficulty}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users
                  className="w-4 h-4 text-[#2D5A3D] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-[11px] text-[#556358]">Servings</div>
                  <div className="text-sm font-semibold text-[#1B261E]">
                    {recipe.servings} portions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-5 sm:p-8">
          {/* Required Ingredients Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-[#1B261E]">
                Required Ingredients
              </h3>
              <span className="text-xs text-[#556358] tabular-nums">
                {recipe.ingredients.length} items
              </span>
            </div>

            {hasPantryItems && recipe.missingIngredients.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#EEF3EC] border border-[#2D5A3D]/20 space-y-2.5">
                <p className="text-xs text-[#1B261E] leading-relaxed">
                  You are missing{" "}
                  <strong className="font-semibold tabular-nums">
                    {recipe.missingIngredients.length}
                  </strong>{" "}
                  {recipe.missingIngredients.length === 1
                    ? "ingredient"
                    : "ingredients"}{" "}
                  from your pantry list.
                </p>
                <button
                  type="button"
                  onClick={handleAddAllMissing}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {addedFeedback
                      ? "Added to Shopping List"
                      : `Add Missing (${recipe.missingIngredients.length}) to Shopping List`}
                  </span>
                </button>
              </div>
            )}

            <ul className="divide-y divide-[#E2DDD3] bg-white border border-[#E2DDD3] rounded-xl overflow-hidden">
              {recipe.ingredients.map((item, idx) => {
                const isMissing =
                  hasPantryItems && missingNames.has(item.name.toLowerCase());
                const isAvailable = hasPantryItems && !isMissing;

                return (
                  <li
                    key={`${item.name}-${idx}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[#1B261E]">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#556358] tabular-nums">
                        {item.amount}
                        {isAvailable && (
                          <span className="text-[#2D5A3D] font-medium">
                            {" "}
                            · In your pantry
                          </span>
                        )}
                        {isMissing && (
                          <span className="text-[#8A5A2B] font-medium">
                            {" "}
                            · Missing
                          </span>
                        )}
                      </div>
                    </div>

                    {isAvailable ? (
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#EEF3EC] text-[#2D5A3D] shrink-0"
                        title="Available in your pantry"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddSingleIngredient(item)}
                        title={`Add ${item.name} to shopping list`}
                        aria-label={`Add ${item.name} to shopping list`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E2DDD3] text-[#1B261E] hover:bg-[#EEF3EC] hover:text-[#2D5A3D] transition-colors shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Cooking Instructions Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-[#1B261E]">
                Cooking Instructions
              </h3>
              <span className="text-xs text-[#556358] tabular-nums">
                {completedSteps.length}/{recipe.instructions.length} completed
              </span>
            </div>

            <ol className="space-y-3">
              {recipe.instructions.map((step, index) => {
                const isDone = completedSteps.includes(index);
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => toggleStep(index)}
                      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                        isDone
                          ? "bg-[#EEF3EC]/60 border-[#2D5A3D]/30 text-[#556358]"
                          : "bg-white border-[#E2DDD3] hover:border-[#2D5A3D]/40 text-[#1B261E]"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold tabular-nums shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? "bg-[#2D5A3D] text-white"
                            : "bg-[#F1EDE4] text-[#1B261E]"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span
                        className={`text-sm sm:text-base leading-relaxed ${
                          isDone ? "line-through opacity-75" : ""
                        }`}
                      >
                        {step}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Alternative Recipes When Ingredients Are Missing */}
        {hasPantryItems &&
          recipe.missingIngredients.length > 0 &&
          alternativeRecipes.length > 0 &&
          onSelectAlternative && (
            <div className="px-5 sm:px-8 pb-8 pt-6 border-t border-[#E2DDD3] bg-white">
              <div className="mb-4">
                <h3 className="font-display text-lg font-semibold text-[#1B261E]">
                  Missing ingredients? Try these alternative recipes
                </h3>
                <p className="text-xs text-[#556358] mt-1">
                  Options that use more of the ingredients you already have in
                  your pantry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternativeRecipes.map((alt) => (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => onSelectAlternative(alt)}
                    className="text-left p-3.5 rounded-xl border border-[#E2DDD3] bg-[#F8F6F1] hover:bg-[#EEF3EC] hover:border-[#2D5A3D]/35 transition-colors cursor-pointer flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="text-[11px] font-medium text-[#556358] tabular-nums">
                        {alt.dietary} ·{" "}
                        {alt.prepTimeMinutes + alt.cookTimeMinutes} min
                      </div>
                      <div className="font-display text-sm font-semibold text-[#1B261E] mt-1 line-clamp-2">
                        {alt.title}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2DDD3]/70 text-xs font-semibold text-[#2D5A3D] tabular-nums">
                      <span>
                        {alt.missingIngredients.length === 0
                          ? "All ingredients ready"
                          : `${alt.matchedIngredients.length}/${alt.ingredients.length} matched`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
