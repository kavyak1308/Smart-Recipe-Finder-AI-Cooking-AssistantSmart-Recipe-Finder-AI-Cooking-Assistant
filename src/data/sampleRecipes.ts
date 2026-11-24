import { IngredientItem, MatchedRecipe, Recipe } from "@/types/recipe";

export const RECIPE_IMAGES = {
  hero: "/images/hero_botanical_kitchen_1795506763892.jpg",
  risotto: "/images/recipe_herb_risotto_1795506764156.jpg",
  salmon: "/images/recipe_mediterranean_salmon_1795506764625.jpg",
  chickpeaBowl: "/images/recipe_avocado_chickpea_bowl_1795506765113.jpg",
  garlicChicken: "/images/recipe_garlic_chicken_skillet_1795506765503.jpg",
  greenCurry: "/images/recipe_thai_coconut_curry_1795506765512.jpg",
} as const;

export const QUICK_INGREDIENTS: string[] = [
  "Spinach",
  "Garlic",
  "Tomatoes",
  "Lemon",
  "Avocado",
  "Chickpeas",
  "Pasta",
  "Rice",
  "Chicken",
  "Salmon",
  "Mushrooms",
  "Tofu",
  "Basil",
  "Eggs",
];

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "sample-lemon-garlic-spinach-pasta",
    title: "15-Minute Lemon Garlic & Spinach Pasta",
    description:
      "Bright, quick weeknight pasta coated in toasted garlic oil, wilted baby spinach, and fresh lemon zest.",
    image: RECIPE_IMAGES.hero,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Italian",
    ingredients: [
      { name: "Pasta", amount: "200 g" },
      { name: "Spinach", amount: "2 cups baby spinach" },
      { name: "Garlic", amount: "3 cloves sliced" },
      { name: "Lemon", amount: "1 juiced & zested" },
      { name: "Olive Oil", amount: "2 tbsp" },
    ],
    instructions: [
      "Boil pasta in salted water until al dente, reserving 1/3 cup of starchy pasta water.",
      "Warm olive oil in a wide skillet and gently sauté sliced garlic for 1 minute until fragrant.",
      "Toss hot pasta, baby spinach, lemon juice, lemon zest, and pasta water in the skillet for 2 minutes until spinach wilts.",
      "Season with salt and cracked black pepper and serve warm.",
    ],
  },
  {
    id: "sample-garlic-spinach-scrambled-eggs",
    title: "Lemony Garlic & Spinach Skillet Eggs",
    description:
      "Soft, savoury eggs folded with sautéed garlic and tender spinach, finished with a bright squeeze of lemon.",
    image: RECIPE_IMAGES.garlicChicken,
    prepTimeMinutes: 5,
    cookTimeMinutes: 7,
    servings: 1,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Home Bistro",
    ingredients: [
      { name: "Eggs", amount: "3 large" },
      { name: "Spinach", amount: "2 cups fresh" },
      { name: "Garlic", amount: "2 cloves minced" },
      { name: "Lemon", amount: "1/2 juiced" },
    ],
    instructions: [
      "Warm a drizzle of oil in a small non-stick skillet and cook minced garlic for 30 seconds.",
      "Add spinach and stir for 1–2 minutes until just wilted.",
      "Pour in whisked eggs and gently fold over low heat until softly set.",
      "Finish with a bright squeeze of fresh lemon juice and black pepper.",
    ],
  },
  {
    id: "sample-herb-pesto-pasta",
    title: "Fresh Basil & Heirloom Tomato Pasta",
    description:
      "Silky ribbons of pasta tossed in bright homemade basil-garlic pesto, blistered sweet tomatoes, and toasted pine nuts.",
    image: RECIPE_IMAGES.hero,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Italian",
    ingredients: [
      { name: "Pasta", amount: "200 g" },
      { name: "Basil", amount: "1 cup fresh leaves" },
      { name: "Tomatoes", amount: "250 g cherry or heirloom" },
      { name: "Garlic", amount: "2 cloves" },
      { name: "Lemon", amount: "1/2 juiced" },
      { name: "Olive Oil", amount: "3 tbsp" },
      { name: "Parmesan", amount: "40 g grated" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil and cook the pasta until al dente, reserving 1/2 cup of pasta water.",
      "Blend fresh basil, peeled garlic, olive oil, lemon juice, Parmesan, and a pinch of salt into a vibrant green pesto.",
      "Warm halved tomatoes in a skillet over medium heat for 3 minutes until juicy and lightly blistered.",
      "Toss hot pasta with the pesto, tomatoes, and splashes of reserved pasta water until glossy. Serve immediately.",
    ],
  },
  {
    id: "sample-quick-garlic-lemon-chicken",
    title: "Pan-Seared Lemon Garlic Chicken & Spinach",
    description:
      "Juicy golden chicken fillets seared with aromatic garlic, fresh lemon juice, and wilted baby spinach in one pan.",
    image: RECIPE_IMAGES.garlicChicken,
    prepTimeMinutes: 8,
    cookTimeMinutes: 14,
    servings: 2,
    difficulty: "Easy",
    dietary: "Non-Vegetarian",
    cuisine: "Mediterranean",
    ingredients: [
      { name: "Chicken", amount: "300 g breast or thighs" },
      { name: "Spinach", amount: "2 cups fresh" },
      { name: "Garlic", amount: "3 cloves smashed" },
      { name: "Lemon", amount: "1 juiced" },
    ],
    instructions: [
      "Season chicken with salt and pepper and sear in an oiled skillet for 5–6 minutes per side until golden and cooked through.",
      "Add smashed garlic during the last 2 minutes so it perfumes the pan.",
      "Remove chicken to rest, then toss spinach and lemon juice into the warm skillet for 1 minute until wilted.",
      "Spoon the garlic-lemon spinach onto plates and top with sliced chicken.",
    ],
  },
  {
    id: "sample-pan-seared-lemon-salmon",
    title: "Crispy Lemon Garlic Salmon & Greens",
    description:
      "Fast 15-minute pan-seared salmon fillet basted with crushed garlic, bright lemon juice, and wilted spinach.",
    image: RECIPE_IMAGES.salmon,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    dietary: "Non-Vegetarian",
    cuisine: "Nordic Kitchen",
    ingredients: [
      { name: "Salmon", amount: "2 fillets" },
      { name: "Spinach", amount: "2 cups baby spinach" },
      { name: "Garlic", amount: "2 cloves crushed" },
      { name: "Lemon", amount: "1 sliced" },
    ],
    instructions: [
      "Pat salmon dry, season with salt and pepper, and sear skin-side down for 4 minutes until crisp.",
      "Flip salmon, add crushed garlic and lemon slices, and cook 2–3 minutes more.",
      "Wilt spinach right beside the salmon in the warm pan for 60 seconds.",
      "Serve immediately with the roasted lemon slices.",
    ],
  },
  {
    id: "sample-asparagus-spinach-risotto",
    title: "Green Asparagus & Spinach Herb Risotto",
    description:
      "Creamy arborio rice simmered slowly with tender greens, sweet garlic, lemon zest, and crunchy toasted pine nuts.",
    image: RECIPE_IMAGES.risotto,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 3,
    difficulty: "Medium",
    dietary: "Vegetarian",
    cuisine: "Italian",
    ingredients: [
      { name: "Rice", amount: "1.5 cups Arborio" },
      { name: "Spinach", amount: "2 cups baby spinach" },
      { name: "Asparagus", amount: "1 bunch trimmed" },
      { name: "Garlic", amount: "3 cloves minced" },
      { name: "Onion", amount: "1 small diced" },
      { name: "Vegetable Broth", amount: "4 cups warm" },
      { name: "Parmesan", amount: "1/2 cup shaved" },
      { name: "Lemon", amount: "1 tsp zest" },
    ],
    instructions: [
      "Sauté diced onion and garlic in olive oil over medium heat until translucent, about 4 minutes.",
      "Stir in Arborio rice and toast gently for 2 minutes until edges turn pearly.",
      "Add warm vegetable broth one ladle at a time, stirring often until absorbed before adding the next.",
      "Fold in chopped asparagus during the last 5 minutes, then wilt in spinach, lemon zest, and Parmesan off the heat.",
    ],
  },
  {
    id: "sample-mediterranean-herb-salmon",
    title: "Lemon Herb Salmon with Roasted Baby Potatoes",
    description:
      "Crisp-skinned pan-seared salmon finished with bright lemon and fresh herbs alongside golden potatoes and green beans.",
    image: RECIPE_IMAGES.salmon,
    prepTimeMinutes: 12,
    cookTimeMinutes: 22,
    servings: 2,
    difficulty: "Easy",
    dietary: "Non-Vegetarian",
    cuisine: "Mediterranean",
    ingredients: [
      { name: "Salmon", amount: "2 fillets (340 g)" },
      { name: "Potatoes", amount: "300 g baby potatoes" },
      { name: "Green Beans", amount: "150 g trimmed" },
      { name: "Tomatoes", amount: "150 g cherry tomatoes" },
      { name: "Lemon", amount: "1 whole sliced & juiced" },
      { name: "Garlic", amount: "2 cloves" },
      { name: "Olive Oil", amount: "2 tbsp" },
    ],
    instructions: [
      "Halve baby potatoes, toss with olive oil, salt, and smashed garlic, and roast at 210°C (410°F) for 18 minutes.",
      "Add green beans and cherry tomatoes to the tray for the final 8 minutes of roasting.",
      "Season salmon fillets with salt, pepper, and chopped herbs, then sear skin-side down in a skillet for 4 minutes.",
      "Flip salmon, squeeze fresh lemon juice over the top, cook 2–3 minutes more, and plate beside the warm vegetables.",
    ],
  },
  {
    id: "sample-avocado-chickpea-bowl",
    title: "Crispy Spiced Chickpea & Avocado Harvest Bowl",
    description:
      "Warm cumin-roasted chickpeas, ripe avocado slices, baby spinach, crisp cucumber ribbons, and silky herb tahini.",
    image: RECIPE_IMAGES.chickpeaBowl,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Modern Grain Bowl",
    ingredients: [
      { name: "Chickpeas", amount: "1 can (400 g) drained" },
      { name: "Avocado", amount: "1 ripe sliced" },
      { name: "Spinach", amount: "2 cups fresh" },
      { name: "Cucumber", amount: "1/2 thinly ribboned" },
      { name: "Tomatoes", amount: "1 cup halved" },
      { name: "Lemon", amount: "1 juiced" },
      { name: "Tahini", amount: "2 tbsp" },
      { name: "Garlic", amount: "1 clove" },
    ],
    instructions: [
      "Pat chickpeas dry and roast or pan-crisp with olive oil, cumin, paprika, and salt for 12–15 minutes until golden.",
      "Whisk tahini, lemon juice, grated garlic, and 2 tablespoons of warm water until smooth and pourable.",
      "Arrange fresh spinach, cucumber ribbons, halved tomatoes, and warm chickpeas in wide bowls.",
      "Fan ripe avocado slices on top and drizzle generously with the lemon-herb tahini dressing.",
    ],
  },
  {
    id: "sample-garlic-herb-chicken-skillet",
    title: "Skillet Lemon-Garlic Chicken with Mushrooms & Spinach",
    description:
      "Golden pan-roasted chicken thighs simmered in a fragrant garlic-thyme pan jus with cremini mushrooms and tender spinach.",
    image: RECIPE_IMAGES.garlicChicken,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 3,
    difficulty: "Medium",
    dietary: "Non-Vegetarian",
    cuisine: "French Bistro",
    ingredients: [
      { name: "Chicken", amount: "4 bone-in or boneless thighs" },
      { name: "Mushrooms", amount: "225 g sliced cremini" },
      { name: "Spinach", amount: "3 cups fresh" },
      { name: "Garlic", amount: "4 cloves smashed" },
      { name: "Lemon", amount: "1/2 sliced" },
      { name: "Olive Oil", amount: "1.5 tbsp" },
      { name: "Chicken Broth", amount: "1/2 cup" },
    ],
    instructions: [
      "Season chicken generously with salt and pepper. Sear in a hot skillet until golden brown on both sides, then set aside.",
      "In the same skillet, sauté sliced mushrooms and smashed garlic for 5 minutes until deeply browned.",
      "Deglaze the pan with broth and lemon slices, return the chicken, and simmer gently for 10 minutes until cooked through.",
      "Stir fresh spinach into the hot pan juices for 1 minute until just wilted and serve straight from the skillet.",
    ],
  },
  {
    id: "sample-thai-green-coconut-curry",
    title: "Fragrant Green Vegetable & Tofu Coconut Curry",
    description:
      "Velvety coconut broth infused with green herbs, golden tofu cubes, crisp snap peas, and red bell pepper over jasmine rice.",
    image: RECIPE_IMAGES.greenCurry,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Thai",
    ingredients: [
      { name: "Tofu", amount: "250 g firm cubed" },
      { name: "Coconut Milk", amount: "1 can (400 ml)" },
      { name: "Rice", amount: "1.5 cups jasmine rice" },
      { name: "Spinach", amount: "1.5 cups" },
      { name: "Bell Pepper", amount: "1 red sliced" },
      { name: "Garlic", amount: "3 cloves" },
      { name: "Lime", amount: "1 wedge & juice" },
    ],
    instructions: [
      "Cook jasmine rice according to package instructions until fluffy.",
      "Sear tofu cubes in a wide pot with a splash of oil until golden on the edges, then add minced garlic and curry aromatics.",
      "Pour in coconut milk and simmer for 6 minutes before adding sliced bell pepper and snap peas.",
      "Simmer 4 minutes until crisp-tender, fold in spinach and fresh lime juice, and serve alongside steamed rice.",
    ],
  },
  {
    id: "sample-spinach-mushroom-frittata",
    title: "Herbed Spinach, Mushroom & Garlic Frittata",
    description:
      "Fluffy oven-finished egg frittata loaded with sautéed earthy mushrooms, baby spinach, sweet garlic, and fresh basil.",
    image: RECIPE_IMAGES.garlicChicken,
    prepTimeMinutes: 8,
    cookTimeMinutes: 14,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    cuisine: "Mediterranean",
    ingredients: [
      { name: "Eggs", amount: "6 large" },
      { name: "Spinach", amount: "2 cups" },
      { name: "Mushrooms", amount: "150 g sliced" },
      { name: "Garlic", amount: "2 cloves minced" },
      { name: "Basil", amount: "2 tbsp chopped" },
      { name: "Olive Oil", amount: "1 tbsp" },
    ],
    instructions: [
      "Whisk eggs with chopped basil, a pinch of salt, and freshly cracked black pepper.",
      "Sauté mushrooms and garlic in an oven-safe skillet until tender, then wilt in the baby spinach.",
      "Pour beaten eggs evenly over the vegetables and cook undisturbed on low heat for 4 minutes.",
      "Transfer skillet under a broiler for 3–4 minutes until puffed and lightly golden. Slice into wedges.",
    ],
  },
  {
    id: "sample-garlic-chicken-rice-bowl",
    title: "Lemon Herb Chicken & Avocado Rice Bowl",
    description:
      "Tender seared chicken sliced over warm rice with creamy avocado, cherry tomatoes, and bright garlic-lemon drizzle.",
    image: RECIPE_IMAGES.chickpeaBowl,
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    servings: 2,
    difficulty: "Medium",
    dietary: "Non-Vegetarian",
    cuisine: "Californian",
    ingredients: [
      { name: "Chicken", amount: "300 g breast or thighs" },
      { name: "Rice", amount: "1 cup cooked" },
      { name: "Avocado", amount: "1 ripe sliced" },
      { name: "Tomatoes", amount: "1 cup cherry tomatoes" },
      { name: "Spinach", amount: "1 cup" },
      { name: "Lemon", amount: "1 juiced" },
      { name: "Garlic", amount: "2 cloves" },
    ],
    instructions: [
      "Marinate chicken for 10 minutes with olive oil, minced garlic, lemon juice, salt, and pepper.",
      "Sear chicken in a skillet for 5–6 minutes per side until cooked through, then rest and slice.",
      "Warm cooked rice and divide into bowls alongside fresh spinach and halved cherry tomatoes.",
      "Top with sliced chicken, fanned avocado, and a squeeze of fresh lemon.",
    ],
  },
];

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function singularize(word: string): string {
  if (word.endsWith("ies") && word.length > 4) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("es") && word.length > 3 && !word.endsWith("ses")) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

export function doesIngredientMatch(
  recipeIngredientName: string,
  pantryIngredients: string[]
): boolean {
  const target = normalizeToken(recipeIngredientName);
  const targetSingular = singularize(target);

  return pantryIngredients.some((pantryItem) => {
    const normalized = normalizeToken(pantryItem);
    if (!normalized) return false;
    const normalizedSingular = singularize(normalized);
    return (
      target.includes(normalized) ||
      normalized.includes(target) ||
      targetSingular.includes(normalizedSingular) ||
      normalizedSingular.includes(targetSingular)
    );
  });
}

export function matchRecipeWithPantry(
  recipe: Recipe,
  pantryIngredients: string[]
): MatchedRecipe {
  if (pantryIngredients.length === 0) {
    return {
      ...recipe,
      matchedIngredients: [],
      missingIngredients: recipe.ingredients,
      matchPercentage: 0,
    };
  }

  const matchedIngredients: string[] = [];
  const missingIngredients: IngredientItem[] = [];

  for (const item of recipe.ingredients) {
    if (doesIngredientMatch(item.name, pantryIngredients)) {
      matchedIngredients.push(item.name);
    } else {
      missingIngredients.push(item);
    }
  }

  const total = recipe.ingredients.length || 1;
  const matchPercentage = Math.round((matchedIngredients.length / total) * 100);

  return {
    ...recipe,
    matchedIngredients,
    missingIngredients,
    matchPercentage,
  };
}

export function getAlternativeRecipesForRecipe(
  currentRecipe: MatchedRecipe,
  allMatchedRecipes: MatchedRecipe[],
  limit = 3
): MatchedRecipe[] {
  return allMatchedRecipes
    .filter((candidate) => candidate.id !== currentRecipe.id)
    .map((candidate) => {
      const fewerMissing =
        candidate.missingIngredients.length <
        currentRecipe.missingIngredients.length
          ? 2
          : 0;
      const sameDietary = candidate.dietary === currentRecipe.dietary ? 1 : 0;
      const score =
        candidate.matchPercentage +
        fewerMissing * 25 +
        sameDietary * 10 -
        candidate.missingIngredients.length * 8;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function pickRecipeImage(
  title: string,
  dietary: string,
  ingredients: IngredientItem[]
): string {
  const text = `${title} ${ingredients.map((i) => i.name).join(" ")}`.toLowerCase();

  if (
    text.includes("salmon") ||
    text.includes("fish") ||
    text.includes("trout") ||
    text.includes("cod")
  ) {
    return RECIPE_IMAGES.salmon;
  }
  if (
    text.includes("curry") ||
    text.includes("coconut") ||
    text.includes("thai") ||
    text.includes("tofu")
  ) {
    return RECIPE_IMAGES.greenCurry;
  }
  if (
    text.includes("chicken") ||
    text.includes("turkey") ||
    text.includes("skillet") ||
    text.includes("mushroom")
  ) {
    return RECIPE_IMAGES.garlicChicken;
  }
  if (
    text.includes("risotto") ||
    text.includes("asparagus") ||
    text.includes("rice")
  ) {
    return RECIPE_IMAGES.risotto;
  }
  if (
    text.includes("chickpea") ||
    text.includes("avocado") ||
    text.includes("bowl") ||
    text.includes("salad")
  ) {
    return RECIPE_IMAGES.chickpeaBowl;
  }
  if (
    text.includes("pasta") ||
    text.includes("noodle") ||
    text.includes("pesto") ||
    text.includes("tomato")
  ) {
    return RECIPE_IMAGES.hero;
  }

  return dietary === "Non-Vegetarian"
    ? RECIPE_IMAGES.garlicChicken
    : RECIPE_IMAGES.chickpeaBowl;
}
