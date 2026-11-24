import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { pickRecipeImage } from "@/data/sampleRecipes";
import { DietaryType, DifficultyLevel, Recipe } from "@/types/recipe";

interface GenerateRecipesBody {
  ingredients?: string[];
  dietaryPreference?: "All" | DietaryType;
  difficulty?: "Any" | DifficultyLevel;
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out.`)), ms)
    ),
  ]);
}

async function generateWithFallback(ai: GoogleGenAI, prompt: string) {
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        prepTimeMinutes: { type: Type.INTEGER },
        cookTimeMinutes: { type: Type.INTEGER },
        servings: { type: Type.INTEGER },
        difficulty: {
          type: Type.STRING,
          enum: ["Easy", "Medium", "Hard"],
        },
        dietary: {
          type: Type.STRING,
          enum: ["Vegetarian", "Non-Vegetarian"],
        },
        cuisine: { type: Type.STRING },
        matchNote: { type: Type.STRING },
        ingredients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              amount: { type: Type.STRING },
            },
            required: ["name", "amount"],
          },
        },
        instructions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "title",
        "description",
        "prepTimeMinutes",
        "cookTimeMinutes",
        "servings",
        "difficulty",
        "dietary",
        "cuisine",
        "ingredients",
        "instructions",
      ],
    },
  };

  try {
    return await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
      12000,
      "AI recipe request"
    );
  } catch (primaryErr) {
    // Retry once on secondary fast model if primary encounters transient 503/timeout
    const msg = primaryErr instanceof Error ? primaryErr.message : "";
    if (
      msg.includes("503") ||
      msg.includes("UNAVAILABLE") ||
      msg.includes("429") ||
      msg.includes("timed out")
    ) {
      return await withTimeout(
        ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema,
          },
        }),
        10000,
        "Fallback AI recipe request"
      );
    }
    throw primaryErr;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRecipesBody;
    const rawIngredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    const ingredients = rawIngredients
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 25);

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one ingredient before generating recipes." },
        { status: 400 }
      );
    }

    const ai = getAiClient();
    if (!ai) {
      return NextResponse.json(
        {
          recipes: [],
          error:
            "AI recipe assistant is currently unavailable because GEMINI_API_KEY is not configured. Showing matching sample recipes instead.",
          aiUnavailable: true,
        },
        { status: 200 }
      );
    }

    const dietaryPreference = body.dietaryPreference ?? "All";
    const difficultyFilter = body.difficulty ?? "Any";

    const dietaryLine =
      dietaryPreference === "All"
        ? "Include both Vegetarian and Non-Vegetarian recipes (at least 2 of each)."
        : `All recipes must strictly be ${dietaryPreference}.`;

    const difficultyLine =
      difficultyFilter === "Any"
        ? "Vary difficulty naturally between Easy and Medium."
        : `Focus on ${difficultyFilter} difficulty recipes.`;

    const prompt = `You are an expert home chef and culinary assistant for "Smart Recipe Finder".
The user currently has these ingredients in their kitchen:
${ingredients.join(", ")}

Generate 6 practical, delicious recipes:
- 3 recipes that can be cooked directly with the entered ingredients (using at most 1–2 common staples).
- 3 alternative recipes that use some of the entered ingredients and require 2–3 extra complementary ingredients so the user sees helpful alternatives they can shop for.
- ${dietaryLine}
- ${difficultyLine}
- Keep ingredient names concise and clean (e.g., "Garlic", "Spinach", "Chicken") so pantry matching is accurate.
- Provide clear, beginner-friendly step-by-step cooking instructions (4 to 5 concise steps per recipe).`;

    const response = await generateWithFallback(ai, prompt);

    const rawText = (response.text ?? "[]").trim();
    const parsed = JSON.parse(rawText) as Array<Omit<Recipe, "id" | "image">>;

    const timestamp = Date.now();
    const recipes: Recipe[] = parsed.map((item, idx) => {
      const dietary: DietaryType =
        item.dietary === "Non-Vegetarian" ? "Non-Vegetarian" : "Vegetarian";
      const difficulty: DifficultyLevel =
        item.difficulty === "Hard"
          ? "Hard"
          : item.difficulty === "Medium"
          ? "Medium"
          : "Easy";

      return {
        id: `ai-${timestamp}-${idx}`,
        title: item.title,
        description: item.description,
        image: pickRecipeImage(item.title, dietary, item.ingredients ?? []),
        prepTimeMinutes: Math.max(5, Number(item.prepTimeMinutes) || 15),
        cookTimeMinutes: Math.max(0, Number(item.cookTimeMinutes) || 15),
        servings: Math.max(1, Number(item.servings) || 2),
        difficulty,
        dietary,
        cuisine: item.cuisine || "Seasonal Kitchen",
        matchNote: item.matchNote || undefined,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        instructions: Array.isArray(item.instructions) ? item.instructions : [],
        isAiGenerated: true,
      };
    });

    return NextResponse.json({
      recipes,
      source: "ai",
    });
  } catch (error) {
    console.error("Error generating recipes with Gemini:", error);
    let friendlyReason = "AI recipe service is temporarily unavailable";

    if (error instanceof Error && error.message) {
      try {
        const parsed = JSON.parse(error.message) as {
          error?: { message?: string; status?: string };
        };
        if (parsed?.error?.message) {
          friendlyReason = parsed.error.message;
        }
      } catch {
        if (!error.message.startsWith("{")) {
          friendlyReason = error.message;
        }
      }
    }

    return NextResponse.json(
      {
        recipes: [],
        error: `${friendlyReason} Showing matching sample recipes instead.`,
        aiUnavailable: true,
      },
      { status: 200 }
    );
  }
}
