"use client";

import { Heart, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import RecipeImage from "./RecipeImage";
import { IngredientItem, MatchedRecipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: MatchedRecipe;
  hasPantryItems: boolean;
  isFavourite: boolean;
  onToggleFavourite: (recipe: MatchedRecipe) => void;
  onSelectRecipe: (recipe: MatchedRecipe) => void;
  onAddMissingToShoppingList: (
    ingredients: IngredientItem[],
    recipeTitle: string
  ) => void;
}

export default function RecipeCard({
  recipe,
  hasPantryItems,
  isFavourite,
  onToggleFavourite,
  onSelectRecipe,
  onAddMissingToShoppingList,
}: RecipeCardProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const missingCount = recipe.missingIngredients.length;
  const matchedCount = recipe.matchedIngredients.length;

  return (
    <article className="group flex flex-col bg-white border border-[#E2DDD3] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 4:3 Culinary Photography */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EEF3EC]">
        <button
          type="button"
          onClick={() => onSelectRecipe(recipe)}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2D5A3D]"
          aria-label={`View recipe for ${recipe.title}`}
        >
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        {/* Favourite Action Button (Functional Control) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(recipe);
          }}
          aria-label={
            isFavourite
              ? `Remove ${recipe.title} from favourites`
              : `Save ${recipe.title} to favourites`
          }
          aria-pressed={isFavourite}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A3D] ${
            isFavourite
              ? "bg-[#2D5A3D] text-white"
              : "bg-white/95 text-[#1B261E] hover:bg-white"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Clean Unboxed Metadata Line */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#556358] tabular-nums mb-2">
          <span>{totalTime} min</span>
          <span aria-hidden="true">·</span>
          <span>{recipe.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>{recipe.dietary}</span>
          <span aria-hidden="true">·</span>
          <span>Serves {recipe.servings}</span>
          {recipe.isAiGenerated && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#2D5A3D] font-semibold">AI Suggested</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectRecipe(recipe)}
          className="text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2D5A3D] rounded"
        >
          <h3 className="font-display text-lg font-semibold text-[#1B261E] leading-snug mb-2 group-hover:text-[#2D5A3D] transition-colors">
            {recipe.title}
          </h3>
        </button>

        <p className="text-sm text-[#556358] leading-relaxed line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Pantry Readiness Indicator (Icon + Explicit Text, never hue-only) */}
        <div className="mt-auto pt-3 border-t border-[#E2DDD3]/70 space-y-3">
          {hasPantryItems ? (
            missingCount === 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2D5A3D]">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  All {recipe.ingredients.length} ingredients ready in pantry
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs text-[#556358]">
                <AlertCircle
                  className="w-4 h-4 shrink-0 text-[#8A5A2B] mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-[#1B261E] tabular-nums">
                    {matchedCount}/{recipe.ingredients.length}
                  </strong>{" "}
                  matched · Missing:{" "}
                  <span className="text-[#1B261E]">
                    {recipe.missingIngredients
                      .slice(0, 3)
                      .map((m) => m.name)
                      .join(", ")}
                    {missingCount > 3 ? ` +${missingCount - 3} more` : ""}
                  </span>
                </span>
              </div>
            )
          ) : (
            <div className="text-xs text-[#556358] tabular-nums">
              {recipe.ingredients.length} ingredients · Serves {recipe.servings}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSelectRecipe(recipe)}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A3D]"
            >
              View Recipe
            </button>

            {hasPantryItems && missingCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  onAddMissingToShoppingList(
                    recipe.missingIngredients,
                    recipe.title
                  )
                }
                title={`Add ${missingCount} missing ingredient(s) to Shopping List`}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#2D5A3D] bg-[#EEF3EC] hover:bg-[#DFEBDC] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A3D]"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="tabular-nums">List ({missingCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
