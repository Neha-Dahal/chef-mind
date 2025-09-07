import { RequestHandler } from "express";
import { ragService } from "../services/ragService";
import type {
  RecipeGenerationRequest,
  RecipeGenerationResponse,
  ErrorResponse,
} from "@shared/api";

export const handleRecipeGeneration: RequestHandler = async (req, res) => {
  try {
    const { ingredients, numberOfRecipes, documentId, preferences } =
      req.body as RecipeGenerationRequest;

    // Validate input
    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Please provide at least one ingredient",
      };
      return res.status(400).json(errorResponse);
    }

    if (!numberOfRecipes || numberOfRecipes < 1 || numberOfRecipes > 10) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Number of recipes must be between 1 and 10",
      };
      return res.status(400).json(errorResponse);
    }

    if (!documentId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Document ID is required. Please upload a recipe book first.",
      };
      return res.status(400).json(errorResponse);
    }

    // Check if document exists
    if (!ragService.hasDocument(documentId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Document not found. Please upload a recipe book first.",
      };
      return res.status(404).json(errorResponse);
    }

    // Generate recipes using RAG
    const recipes = await ragService.generateRecipes(
      ingredients,
      numberOfRecipes,
      documentId,
    );

    const response: RecipeGenerationResponse = {
      success: true,
      recipes,
      message: `Generated ${recipes.length} recipes successfully`,
    };

    res.json(response);
  } catch (error) {
    console.error("Error generating recipes:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      message: "Error generating recipes",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(500).json(errorResponse);
  }
};
