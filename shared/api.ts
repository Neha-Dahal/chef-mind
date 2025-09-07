/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
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
