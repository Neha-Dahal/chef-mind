import type { RequestHandler } from "express";
import { configDotenv } from "dotenv";

configDotenv();

interface RecipesRequestBody {
  ingredients: string;
  /** Optional number of recipe suggestions to generate */
  count?: number;
  /** Optional model override */
  model?: string;
}

interface RecipesResponseBody {
  text: string;
}

const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_TOKENS = 2000;

function buildUserPrompt(ingredients: string, count: number) {
  return (
    `Using the following ingredients: ${ingredients.trim()}\n\n` +
    `Provide ${count} different recipe suggestions. For each recipe, output in plain text (no markdown), separated by a blank line between recipes, with the following sections:\n\n` +
    `1. Recipe Name:\n- Clear, appetizing name.\n\n` +
    `2. Cooking Time:\n- Total estimated time and split into prep and cook when possible.\n\n` +
    `3. Step-by-Step Instructions:\n- Numbered steps with details like chopping, marinating, oven/stove temperature and approximate durations.\n- Add tips to improve flavor, texture, or presentation where helpful.\n- Clearly mark optional steps or variations with the word "Optional:".\n\n` +
    `4. Additional Ingredients:\n- Suggest minimal common pantry additions (e.g., salt, pepper, oil, butter, garlic, onions, basic herbs). Keep it simple.\n\n` +
    `Constraints:\n- Keep instructions beginner-friendly and concise.\n- Use only the provided ingredients plus the minimal pantry additions.\n- Separate each recipe with a single blank line.\n- Do not include markdown bullets or code blocks; use clear text only.\n`
  );
}

export const handleRecipes: RequestHandler = async (req, res) => {
  try {
    const {
      ingredients,
      count = 3,
      model,
    } = (req.body || {}) as RecipesRequestBody;

    if (
      !ingredients ||
      typeof ingredients !== "string" ||
      !ingredients.trim()
    ) {
      return res
        .status(400)
        .json({ error: "Missing 'ingredients' in request body" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error:
          "OpenAI API key not provided. Set OPENAI_API_KEY in the server environment.",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an expert chef who writes crystal-clear, beginner-friendly cooking instructions with professional culinary precision.",
      },
      {
        role: "user",
        content: buildUserPrompt(
          ingredients,
          Math.max(1, Math.min(5, Number(count) || 3)),
        ),
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(response.status)
        .json({ error: `OpenAI API error: ${errText}` });
    }

    const data = (await response.json()) as any;
    const content: string = data?.choices?.[0]?.message?.content ?? "";

    const payload: RecipesResponseBody = { text: content };
    return res.status(200).json(payload);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
};
