/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Recipe interfaces for RAG system
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  estimatedTime?: string;
  servings?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  description?: string;
}

export interface PDFUploadRequest {
  // File will be handled by multer, this is for any additional metadata
  metadata?: {
    filename?: string;
    description?: string;
  };
}

export interface PDFUploadResponse {
  success: boolean;
  message: string;
  documentId: string;
  pagesProcessed: number;
}

export interface RecipeGenerationRequest {
  ingredients: string[];
  numberOfRecipes: number;
  documentId: string;
  preferences?: {
    cuisine?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    maxTime?: string;
    dietary?: string[];
  };
}

export interface RecipeGenerationResponse {
  success: boolean;
  recipes: Recipe[];
  message?: string;
}

export interface RecipesRequest {
  ingredients: string;
  /** Optional number of recipe suggestions (1-5) */
  count?: number;
  /** Optional model override */
  model?: string;
}

export interface RecipesResponse {
  text: string;
}

// Form step interface for multi-step form
export interface FormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Error response interface
export interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
}
