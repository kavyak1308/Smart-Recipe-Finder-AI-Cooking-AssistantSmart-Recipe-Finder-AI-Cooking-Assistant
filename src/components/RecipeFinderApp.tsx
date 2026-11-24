"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Sparkles,
  Shuffle,
  X,
  ShoppingBag,
  Heart,
  AlertTriangle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import Navbar from "./Navbar";
import RecipeCard from "./RecipeCard";
import RecipeDetailModal from "./RecipeDetailModal";
import ShoppingListDrawer from "./ShoppingListDrawer";
import RecipeImage from "./RecipeImage";
import {
  QUICK_INGREDIENTS,
  RECIPE_IMAGES,
  SAMPLE_RECIPES,
  getAlternativeRecipesForRecipe,
  matchRecipeWithPantry,
} from "@/data/sampleRecipes";
import {
  DietaryType,
  DifficultyLevel,
  IngredientItem,
  MatchedRecipe,
  Recipe,
  ShoppingListItem,
} from "@/types/recipe";

const FAVOURITES_STORAGE_KEY = "smart-recipe-finder:favourites";
const SHOPPING_STORAGE_KEY = "smart-recipe-finder:shopping-list";
const PANTRY_STORAGE_KEY = "smart-recipe-finder:pantry";

const DEFAULT_INGREDIENTS = ["Garlic", "Spinach", "Lemon"];

export default function RecipeFinderApp() {
  const [pantryIngredients, setPantryIngredients] =
    useState<string[]>(DEFAULT_INGREDIENTS);
  const [ingredientInput, setIngredientInput] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Filters & Navigation State
  const [activeSection, setActiveSection] = useState<"discover" | "favourites">(
    "discover"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"All" | DietaryType>(
    "All"
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    "Any" | DifficultyLevel
  >("Any");
  const [maxTimeFilter, setMaxTimeFilter] = useState<"any" | "30" | "45">(
    "any"
  );

  // Saved Favourites & Shopping List (localStorage)
  const [favourites, setFavourites] = useState<Recipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  // Active Modals / Drawers / Toast
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate persisted state from localStorage safely
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavourites(parsed);
      }

      const savedList = localStorage.getItem(SHOPPING_STORAGE_KEY);
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed)) setShoppingList(parsed);
      }

      const savedPantry = localStorage.getItem(PANTRY_STORAGE_KEY);
      if (savedPantry) {
        const parsed = JSON.parse(savedPantry);
        if (Array.isArray(parsed)) setPantryIngredients(parsed);
      }
    } catch {
      // Ignore malformed localStorage payloads
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Ignore quota errors
    }
  }, [favourites, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(shoppingList));
    } catch {
      // Ignore quota errors
    }
  }, [shoppingList, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(
        PANTRY_STORAGE_KEY,
        JSON.stringify(pantryIngredients)
      );
    } catch {
      // Ignore quota errors
    }
  }, [pantryIngredients, hasHydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const parseIngredientText = (rawText: string): string[] => {
    return rawText
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  };

  // Add one or comma-separated ingredients and return merged list
  const addIngredients = (rawText: string): string[] => {
    const tokens = parseIngredientText(rawText);
    if (tokens.length === 0) return pantryIngredients;

    const existingLower = new Set(pantryIngredients.map((i) => i.toLowerCase()));
    const additions = tokens.filter(
      (token) => !existingLower.has(token.toLowerCase())
    );
    const nextList = [...pantryIngredients, ...additions];
    setPantryIngredients(nextList);

    if (additions.length > 0) {
      showToast(`Added ${additions.join(", ")} to your pantry.`);
    } else {
      showToast("Those ingredients are already in your pantry.");
    }
    return nextList;
  };

  const handleIngredientSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;
    addIngredients(ingredientInput);
    setIngredientInput("");
  };

  const toggleQuickIngredient = (item: string) => {
    const exists = pantryIngredients.some(
      (i) => i.toLowerCase() === item.toLowerCase()
    );
    if (exists) {
      setPantryIngredients((prev) =>
        prev.filter((i) => i.toLowerCase() !== item.toLowerCase())
      );
    } else {
      addIngredients(item);
    }
  };

  const removeIngredient = (itemToRemove: string) => {
    setPantryIngredients((prev) =>
      prev.filter((item) => item !== itemToRemove)
    );
  };

  const clearIngredients = () => {
    setPantryIngredients([]);
    setAiRecipes([]);
    setAiNotice(null);
  };

  // Generate Recipes with AI (auto-commits any typed ingredient text first)
  const handleGenerateAiRecipes = async () => {
    let activeIngredients = pantryIngredients;
    if (ingredientInput.trim()) {
      activeIngredients = addIngredients(ingredientInput);
      setIngredientInput("");
    }

    if (activeIngredients.length === 0) {
      showToast("Add at least one ingredient to generate tailored recipes.");
      return;
    }

    setIsGenerating(true);
    setAiNotice(null);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ingredients: activeIngredients,
          dietaryPreference: dietaryFilter,
          difficulty: difficultyFilter,
        }),
      });
      clearTimeout(timer);

      const data = await response.json();

      if (!response.ok || data.aiUnavailable) {
        setAiNotice(
          data.error ||
            "AI cooking assistant is temporarily unavailable. Showing matching sample recipes below."
        );
        setActiveSection("discover");
        const discoverEl = document.getElementById("discover");
        if (discoverEl) {
          discoverEl.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      if (Array.isArray(data.recipes) && data.recipes.length > 0) {
        setAiRecipes(data.recipes);
        setActiveSection("discover");
        showToast(
          `Generated ${data.recipes.length} fresh recipes from your pantry.`
        );
        const discoverEl = document.getElementById("discover");
        if (discoverEl) {
          discoverEl.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setAiNotice(
          "No AI recipes were returned. Showing matching curated recipes below."
        );
      }
    } catch {
      setAiNotice(
        "Unable to reach the AI recipe service right now. Showing matching sample recipes below."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Combine AI + Sample recipes (or Favourites) and compute pantry match
  const allBaseRecipes = useMemo(() => {
    if (activeSection === "favourites") {
      return favourites;
    }
    const seenIds = new Set<string>();
    const combined: Recipe[] = [];
    for (const r of [...aiRecipes, ...SAMPLE_RECIPES]) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id);
        combined.push(r);
      }
    }
    return combined;
  }, [activeSection, aiRecipes, favourites]);

  const matchedRecipes = useMemo(() => {
    return allBaseRecipes.map((recipe) =>
      matchRecipeWithPantry(recipe, pantryIngredients)
    );
  }, [allBaseRecipes, pantryIngredients]);

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return matchedRecipes
      .filter((recipe) => {
        if (dietaryFilter !== "All" && recipe.dietary !== dietaryFilter) {
          return false;
        }
        if (
          difficultyFilter !== "Any" &&
          recipe.difficulty !== difficultyFilter
        ) {
          return false;
        }
        const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
        if (maxTimeFilter === "30" && totalTime > 30) return false;
        if (maxTimeFilter === "45" && totalTime > 45) return false;

        if (query) {
          const inTitle = recipe.title.toLowerCase().includes(query);
          const inDesc = recipe.description.toLowerCase().includes(query);
          const inCuisine = recipe.cuisine.toLowerCase().includes(query);
          const inIng = recipe.ingredients.some((i) =>
            i.name.toLowerCase().includes(query)
          );
          if (!inTitle && !inDesc && !inCuisine && !inIng) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (pantryIngredients.length > 0) {
          if (b.matchPercentage !== a.matchPercentage) {
            return b.matchPercentage - a.matchPercentage;
          }
        }
        if (a.isAiGenerated && !b.isAiGenerated) return -1;
        if (!a.isAiGenerated && b.isAiGenerated) return 1;
        return 0;
      });
  }, [
    matchedRecipes,
    searchQuery,
    dietaryFilter,
    difficultyFilter,
    maxTimeFilter,
    pantryIngredients.length,
  ]);

  // Split into Best Matches vs Alternative Recipes when pantry items exist
  const hasPantryItems = pantryIngredients.length > 0;
  const { primaryRecipes, alternativeRecipes } = useMemo(() => {
    if (!hasPantryItems || activeSection === "favourites") {
      return { primaryRecipes: filteredRecipes, alternativeRecipes: [] };
    }

    const strong: MatchedRecipe[] = [];
    const alternatives: MatchedRecipe[] = [];

    for (const recipe of filteredRecipes) {
      const isStrongMatch =
        recipe.matchedIngredients.length > 0 &&
        (recipe.missingIngredients.length <= 2 || recipe.matchPercentage >= 50);

      if (isStrongMatch) {
        strong.push(recipe);
      } else {
        alternatives.push(recipe);
      }
    }

    return { primaryRecipes: strong, alternativeRecipes: alternatives };
  }, [filteredRecipes, hasPantryItems, activeSection]);

  // Favourites Management
  const favouriteIds = useMemo(
    () => new Set(favourites.map((f) => f.id)),
    [favourites]
  );

  const toggleFavourite = (recipe: MatchedRecipe) => {
    const exists = favouriteIds.has(recipe.id);
    if (exists) {
      setFavourites((prev) => prev.filter((item) => item.id !== recipe.id));
      showToast(`Removed "${recipe.title}" from favourites.`);
    } else {
      const {
        matchedIngredients: _m,
        missingIngredients: _mi,
        matchPercentage: _mp,
        ...cleanRecipe
      } = recipe;
      setFavourites((prev) => [cleanRecipe, ...prev]);
      showToast(`Saved "${recipe.title}" to favourites.`);
    }
  };

  // Shopping List Management
  const addMissingToShoppingList = (
    ingredients: IngredientItem[],
    recipeTitle: string
  ) => {
    if (ingredients.length === 0) return;

    setShoppingList((prev) => {
      const existingNames = new Set(prev.map((item) => item.name.toLowerCase()));
      const newItems: ShoppingListItem[] = [];

      for (const ing of ingredients) {
        if (!existingNames.has(ing.name.toLowerCase())) {
          existingNames.add(ing.name.toLowerCase());
          newItems.push({
            id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: ing.name,
            amount: ing.amount,
            recipeTitle,
            checked: false,
          });
        }
      }

      if (newItems.length === 0) {
        showToast("Those ingredients are already on your shopping list.");
        return prev;
      }

      showToast(
        `Added ${newItems.length} ${
          newItems.length === 1 ? "ingredient" : "ingredients"
        } to Shopping List.`
      );
      return [...newItems, ...prev];
    });
  };

  const addCustomShoppingItem = (name: string, amount: string) => {
    setShoppingList((prev) => [
      {
        id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        amount,
        checked: false,
      },
      ...prev,
    ]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCheckedShoppingItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const clearAllShoppingItems = () => {
    setShoppingList([]);
  };

  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeId) return null;
    return matchedRecipes.find((r) => r.id === selectedRecipeId) ?? null;
  }, [matchedRecipes, selectedRecipeId]);

  const modalAlternativeRecipes = useMemo(() => {
    if (!selectedRecipe) return [];
    return getAlternativeRecipesForRecipe(selectedRecipe, matchedRecipes, 3);
  }, [selectedRecipe, matchedRecipes]);

  // Random Recipe Suggestion
  const handleSurpriseMe = () => {
    const pool =
      filteredRecipes.length > 0 ? filteredRecipes : matchedRecipes;
    if (pool.length === 0) return;

    const candidates =
      pool.length > 1 && selectedRecipeId
        ? pool.filter((r) => r.id !== selectedRecipeId)
        : pool;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    setSelectedRecipeId(picked.id);
    showToast(`Chef pick: ${picked.title}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDietaryFilter("All");
    setDifficultyFilter("Any");
    setMaxTimeFilter("any");
  };

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar
        favouritesCount={favourites.length}
        shoppingCount={shoppingList.length}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenShoppingList={() => setIsShoppingOpen(true)}
        onSurpriseMe={handleSurpriseMe}
      />

      <main className="flex-1">
        {/* Editorial Food-Themed Split Hero */}
        <section className="border-b border-[#E2DDD3] bg-[#F8F6F1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Editorial Copy */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6 flex flex-col justify-center"
              >
                <p className="text-xs font-semibold tracking-wide text-[#2D5A3D] mb-3">
                  Seasonal Kitchen Assistant · Vegetarian & Non-Vegetarian
                </p>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1B261E] leading-[1.12] tracking-tight mb-5 text-balance">
                  Cook fresh meals from the ingredients already in your kitchen.
                </h1>

                <p className="text-base sm:text-lg text-[#556358] leading-relaxed max-w-xl mb-8">
                  Add what you have on hand to discover AI-crafted recipes,
                  alternative dishes when items are missing, step-by-step
                  instructions, and a live grocery list.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#pantry"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Enter Your Ingredients</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#1B261E] bg-white border border-[#E2DDD3] hover:bg-[#F1EDE4] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Shuffle className="w-4 h-4 text-[#2D5A3D]" aria-hidden="true" />
                    <span>Random Recipe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShoppingOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#2D5A3D] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span className="tabular-nums">
                      Shopping List ({shoppingList.length})
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Right Full-Height Culinary Photograph */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6"
              >
                <div className="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-[#E2DDD3] bg-[#EEF3EC]">
                  <RecipeImage
                    src={RECIPE_IMAGES.hero}
                    alt="Fresh basil, heirloom tomatoes, avocado, lemon, and herb pasta on a sunlit oak kitchen table"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* 4-Column Culinary Capability Strip */}
            <div className="mt-10 pt-8 border-t border-[#E2DDD3] grid grid-cols-2 lg:grid-cols-4 gap-6 tabular-nums">
              <div>
                <div className="font-display text-lg font-semibold text-[#1B261E]">
                  {SAMPLE_RECIPES.length + aiRecipes.length} Recipes Ready
                </div>
                <div className="text-xs text-[#556358] mt-1">
                  Curated kitchen classics plus live AI suggestions
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[#1B261E]">
                  Veg & Non-Veg
                </div>
                <div className="text-xs text-[#556358] mt-1">
                  Balanced plant-forward and protein-rich dishes
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[#1B261E]">
                  Alternative Matches
                </div>
                <div className="text-xs text-[#556358] mt-1">
                  See near-match recipes and missing ingredients clearly
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[#1B261E]">
                  Saved Locally
                </div>
                <div className="text-xs text-[#556358] mt-1">
                  {favourites.length} favourites · {shoppingList.length} grocery items
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pantry Ingredient Workspace */}
        <section
          id="pantry"
          className="border-b border-[#E2DDD3] bg-white py-10 sm:py-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B261E] tracking-tight">
                  What is in your pantry?
                </h2>
                <p className="text-sm sm:text-base text-[#556358] mt-1.5 max-w-2xl">
                  Type ingredients (separated by commas or one at a time), tap
                  quick staples below, and let the AI Cooking Assistant craft
                  recipes around them.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateAiRecipes}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] disabled:opacity-65 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Generating Recipes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>Generate AI Recipes</span>
                    </>
                  )}
                </button>

                {aiRecipes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAiRecipes([]);
                      showToast("Cleared AI-generated recipes.");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#556358] hover:text-[#1B261E] bg-[#F8F6F1] border border-[#E2DDD3] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Clear AI Results</span>
                  </button>
                )}
              </div>
            </div>

            {/* Ingredient Entry Form */}
            <form
              onSubmit={handleIngredientSubmit}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Enter ingredients (e.g. Chicken, Spinach, Garlic, Tomatoes)..."
                  aria-label="Enter available ingredients"
                  className="w-full px-4 py-3 text-sm sm:text-base bg-[#F8F6F1] border border-[#E2DDD3] rounded-xl text-[#1B261E] placeholder:text-[#556358]/70 focus:outline-none focus:border-[#2D5A3D] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#1B261E] bg-[#F1EDE4] hover:bg-[#E5DFD3] rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4 text-[#2D5A3D]" aria-hidden="true" />
                <span>Add Ingredient</span>
              </button>
            </form>

            {/* Quick-Add Common Ingredients */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-[#556358] mb-2.5">
                Quick-add kitchen staples:
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_INGREDIENTS.map((item) => {
                  const isActive = pantryIngredients.some(
                    (i) => i.toLowerCase() === item.toLowerCase()
                  );
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleQuickIngredient(item)}
                      aria-pressed={isActive}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#2D5A3D] text-white border-[#2D5A3D]"
                          : "bg-[#F8F6F1] text-[#1B261E] border-[#E2DDD3] hover:bg-[#EEF3EC]"
                      }`}
                    >
                      {isActive ? `✓ ${item}` : `+ ${item}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Entered Ingredients List */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F8F6F1] border border-[#E2DDD3]">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-semibold text-[#1B261E] tabular-nums">
                  Your Available Ingredients ({pantryIngredients.length})
                </span>
                {pantryIngredients.length > 0 && (
                  <button
                    type="button"
                    onClick={clearIngredients}
                    className="text-xs font-medium text-[#556358] hover:text-[#9B2C2C] underline underline-offset-4 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {pantryIngredients.length === 0 ? (
                <p className="text-sm text-[#556358]">
                  No ingredients added yet. Enter ingredients above or tap quick
                  staples to see personalized matches and alternatives.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pantryIngredients.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 text-sm font-medium bg-white border border-[#E2DDD3] rounded-lg text-[#1B261E]"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(item)}
                        aria-label={`Remove ${item}`}
                        className="inline-flex items-center justify-center w-6 h-6 rounded text-[#556358] hover:text-[#9B2C2C] hover:bg-[#F1EDE4] transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Honest AI Unavailable / Fallback Notice */}
            {aiNotice && (
              <div
                role="status"
                className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-[#EEF3EC] border border-[#2D5A3D]/25 text-sm text-[#1B261E]"
              >
                <AlertTriangle
                  className="w-5 h-5 text-[#2D5A3D] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="font-medium">{aiNotice}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiNotice(null)}
                  aria-label="Dismiss notice"
                  className="text-[#556358] hover:text-[#1B261E] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Discover, Search, Filters & Results */}
        <section id="discover" className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col gap-5 mb-8 pb-6 border-b border-[#E2DDD3]">
              {/* View Switcher + Random Suggestion */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className="inline-flex items-center gap-1 p-1 bg-[#F1EDE4] rounded-xl"
                  role="tablist"
                  aria-label="Recipe collection view"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeSection === "discover"}
                    onClick={() => setActiveSection("discover")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      activeSection === "discover"
                        ? "bg-white text-[#1B261E] shadow-xs"
                        : "text-[#556358] hover:text-[#1B261E]"
                    }`}
                  >
                    All Recipes ({SAMPLE_RECIPES.length + aiRecipes.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeSection === "favourites"}
                    onClick={() => setActiveSection("favourites")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                      activeSection === "favourites"
                        ? "bg-white text-[#1B261E] shadow-xs"
                        : "text-[#556358] hover:text-[#1B261E]"
                    }`}
                  >
                    <Heart className="w-4 h-4 text-[#2D5A3D]" aria-hidden="true" />
                    <span>Saved Favourites ({favourites.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#2D5A3D] bg-[#EEF3EC] hover:bg-[#DFEBDC] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Shuffle className="w-4 h-4" aria-hidden="true" />
                    <span>Suggest Random Recipe</span>
                  </button>
                </div>
              </div>

              {/* Search Input & Segmented Dietary / Difficulty / Time Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                {/* Search Box */}
                <div className="lg:col-span-5 relative">
                  <Search
                    className="w-4 h-4 text-[#556358] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes, cuisines, or ingredients..."
                    aria-label="Search recipes"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E2DDD3] rounded-xl text-[#1B261E] placeholder:text-[#556358]/70 focus:outline-none focus:border-[#2D5A3D]"
                  />
                </div>

                {/* Dietary Segmented Control */}
                <div className="lg:col-span-4 flex items-center gap-1 p-1 bg-[#F1EDE4] rounded-xl">
                  {(["All", "Vegetarian", "Non-Vegetarian"] as const).map(
                    (diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setDietaryFilter(diet)}
                        className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          dietaryFilter === diet
                            ? "bg-white text-[#1B261E] shadow-xs"
                            : "text-[#556358] hover:text-[#1B261E]"
                        }`}
                      >
                        {diet}
                      </button>
                    )
                  )}
                </div>

                {/* Difficulty & Prep Time Selects */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-2">
                  <select
                    value={difficultyFilter}
                    onChange={(e) =>
                      setDifficultyFilter(
                        e.target.value as "Any" | DifficultyLevel
                      )
                    }
                    aria-label="Filter by difficulty level"
                    className="px-3 py-2.5 text-xs font-semibold bg-white border border-[#E2DDD3] rounded-xl text-[#1B261E] focus:outline-none focus:border-[#2D5A3D] cursor-pointer"
                  >
                    <option value="Any">Any Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <select
                    value={maxTimeFilter}
                    onChange={(e) =>
                      setMaxTimeFilter(e.target.value as "any" | "30" | "45")
                    }
                    aria-label="Filter by preparation time"
                    className="px-3 py-2.5 text-xs font-semibold bg-white border border-[#E2DDD3] rounded-xl text-[#1B261E] focus:outline-none focus:border-[#2D5A3D] cursor-pointer"
                  >
                    <option value="any">Any Time</option>
                    <option value="30">30 min or less</option>
                    <option value="45">45 min or less</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State for Favourites or No Filter Results */}
            {filteredRecipes.length === 0 ? (
              <div className="bg-white border border-[#E2DDD3] rounded-2xl p-10 text-center max-w-xl mx-auto">
                <h3 className="font-display text-xl font-semibold text-[#1B261E] mb-2">
                  {activeSection === "favourites"
                    ? "No saved favourite recipes yet"
                    : "No recipes match those filters"}
                </h3>
                <p className="text-sm text-[#556358] mb-6 leading-relaxed">
                  {activeSection === "favourites"
                    ? "Tap the heart button on any recipe card to save your favourite meals here for quick access."
                    : "Try clearing one of your search or dietary filters to explore more recipes."}
                </p>
                {activeSection === "favourites" ? (
                  <button
                    type="button"
                    onClick={() => setActiveSection("discover")}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors cursor-pointer"
                  >
                    Browse Recipes
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-14">
                {/* Section 1: Best Matches / All Filtered Recipes */}
                {primaryRecipes.length > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between gap-4 mb-6">
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-[#1B261E]">
                          {activeSection === "favourites"
                            ? "Your Saved Favourites"
                            : hasPantryItems
                            ? "Best Matches for Your Pantry"
                            : "Seasonal Recipes"}
                        </h2>
                        <p className="text-sm text-[#556358] mt-1">
                          {activeSection === "favourites"
                            ? "Saved in your browser for quick weeknight cooking."
                            : hasPantryItems
                            ? "Recipes using your available ingredients with minimal or no missing items."
                            : "Explore vegetarian and non-vegetarian dishes or enter ingredients above."}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#556358] tabular-nums shrink-0">
                        {primaryRecipes.length}{" "}
                        {primaryRecipes.length === 1 ? "recipe" : "recipes"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {primaryRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          hasPantryItems={hasPantryItems}
                          isFavourite={favouriteIds.has(recipe.id)}
                          onToggleFavourite={toggleFavourite}
                          onSelectRecipe={(item) => setSelectedRecipeId(item.id)}
                          onAddMissingToShoppingList={addMissingToShoppingList}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Alternative Recipes When Ingredients Are Missing */}
                {alternativeRecipes.length > 0 && (
                  <div
                    className={
                      primaryRecipes.length > 0
                        ? "pt-8 border-t border-[#E2DDD3]"
                        : ""
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-[#1B261E]">
                          Alternative Recipes (Missing Ingredients)
                        </h2>
                        <p className="text-sm text-[#556358] mt-1">
                          {primaryRecipes.length === 0
                            ? "No exact match for all ingredients yet—here are the closest alternative recipes and what you will need."
                            : "Great backup ideas if you do not mind picking up a few extra items—add missing ingredients straight to your shopping list."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShoppingOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2D5A3D] bg-[#EEF3EC] hover:bg-[#DFEBDC] rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
                      >
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span className="tabular-nums">
                          Open Shopping List ({shoppingList.length})
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {alternativeRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          hasPantryItems={hasPantryItems}
                          isFavourite={favouriteIds.has(recipe.id)}
                          onToggleFavourite={toggleFavourite}
                          onSelectRecipe={(item) => setSelectedRecipeId(item.id)}
                          onAddMissingToShoppingList={addMissingToShoppingList}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[#E2DDD3] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556358]">
          <span className="font-display text-sm font-semibold text-[#1B261E]">
            Smart Recipe Finder – AI Cooking Assistant
          </span>
          <div className="flex items-center gap-6">
            <a href="#pantry" className="hover:text-[#1B261E] transition-colors">
              Pantry
            </a>
            <a
              href="#discover"
              className="hover:text-[#1B261E] transition-colors"
            >
              Recipes
            </a>
            <button
              type="button"
              onClick={() => setIsShoppingOpen(true)}
              className="hover:text-[#1B261E] transition-colors cursor-pointer"
            >
              Shopping List
            </button>
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        hasPantryItems={hasPantryItems}
        isFavourite={selectedRecipe ? favouriteIds.has(selectedRecipe.id) : false}
        alternativeRecipes={modalAlternativeRecipes}
        onClose={() => setSelectedRecipeId(null)}
        onToggleFavourite={toggleFavourite}
        onSelectAlternative={(alt) => setSelectedRecipeId(alt.id)}
        onAddMissingToShoppingList={addMissingToShoppingList}
      />

      {/* Shopping List Slide-Over Drawer */}
      <ShoppingListDrawer
        isOpen={isShoppingOpen}
        items={shoppingList}
        onClose={() => setIsShoppingOpen(false)}
        onToggleItem={toggleShoppingItem}
        onRemoveItem={removeShoppingItem}
        onAddCustomItem={addCustomShoppingItem}
        onClearChecked={clearCheckedShoppingItems}
        onClearAll={clearAllShoppingItems}
      />

      {/* Polite Non-Blocking Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#1B261E] text-white text-sm font-medium shadow-lg border border-white/10 max-w-sm"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
