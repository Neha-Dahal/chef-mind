import { OpenAI } from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import type { Recipe } from "@shared/api";

export interface DocumentChunk {
  content: string;
  embedding?: number[];
  metadata: {
    documentId: string;
    chunkIndex: number;
    source: string;
  };
}

class RAGService {
  private openai: OpenAI;
  private embeddings: OpenAIEmbeddings;
  private chatModel: ChatOpenAI;
  private documents: Map<string, DocumentChunk[]> = new Map();

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    this.openai = new OpenAI({ apiKey });
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: "text-embedding-ada-002",
    });

    this.chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
    });
  }

  async addDocument(
    documentId: string,
    content: string,
    source: string,
  ): Promise<void> {
    // Split content into chunks
    const chunks = this.splitIntoChunks(content, 1000, 200);
    const documentChunks: DocumentChunk[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        // Generate embedding for each chunk
        const embeddingResult = await this.embeddings.embedQuery(chunk);

        documentChunks.push({
          content: chunk,
          embedding: embeddingResult,
          metadata: {
            documentId,
            chunkIndex: i,
            source,
          },
        });
      } catch (error) {
        console.error(`Error generating embedding for chunk ${i}:`, error);
        // Add chunk without embedding as fallback
        documentChunks.push({
          content: chunk,
          metadata: {
            documentId,
            chunkIndex: i,
            source,
          },
        });
      }
    }

    // Store chunks
    this.documents.set(documentId, documentChunks);
  }

  async searchSimilarContent(
    query: string,
    k: number = 5,
  ): Promise<DocumentChunk[]> {
    if (this.documents.size === 0) {
      throw new Error("No documents have been indexed yet");
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query);

      // Get all chunks from all documents
      const allChunks: DocumentChunk[] = [];
      for (const chunks of this.documents.values()) {
        allChunks.push(...chunks);
      }

      // Calculate similarities for chunks that have embeddings
      const chunksWithSimilarity = allChunks
        .filter((chunk) => chunk.embedding)
        .map((chunk) => ({
          chunk,
          similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding!),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, k)
        .map((item) => item.chunk);

      // If no embeddings available, return first k chunks based on text matching
      if (chunksWithSimilarity.length === 0) {
        const queryLower = query.toLowerCase();
        return allChunks
          .filter(
            (chunk) =>
              chunk.content.toLowerCase().includes(queryLower) ||
              queryLower
                .split(" ")
                .some((word) => chunk.content.toLowerCase().includes(word)),
          )
          .slice(0, k);
      }

      return chunksWithSimilarity;
    } catch (error) {
      console.error("Error in similarity search:", error);
      // Fallback to simple text search
      const queryLower = query.toLowerCase();
      const allChunks: DocumentChunk[] = [];
      for (const chunks of this.documents.values()) {
        allChunks.push(...chunks);
      }

      return allChunks
        .filter(
          (chunk) =>
            chunk.content.toLowerCase().includes(queryLower) ||
            queryLower
              .split(" ")
              .some((word) => chunk.content.toLowerCase().includes(word)),
        )
        .slice(0, k);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async generateRecipes(
    ingredients: string[],
    numberOfRecipes: number,
    documentId: string,
  ): Promise<Recipe[]> {
    const query = `recipes with ingredients: ${ingredients.join(", ")}`;
    const similarContent = await this.searchSimilarContent(query, 8);

    const context = similarContent.map((chunk) => chunk.content).join("\n\n");

    const prompt = PromptTemplate.fromTemplate(`
You are a professional chef assistant. Based on the recipe book content provided and the available ingredients, generate exactly {numberOfRecipes} complete, detailed recipes.

Available ingredients: {ingredients}

Recipe book content:
{context}

Instructions:
1. Generate exactly {numberOfRecipes} recipes
2. Each recipe must use at least 3 of the available ingredients
3. Include complete ingredient lists (you can add common pantry items)
4. Provide step-by-step instructions
5. Include estimated cooking time if possible
6. Format each recipe as valid JSON

Return ONLY a JSON array of recipes in this exact format:
[
  {{
    "id": "recipe-1",
    "title": "Recipe Name",
    "ingredients": ["ingredient 1", "ingredient 2", "..."],
    "instructions": ["Step 1", "Step 2", "..."],
    "estimatedTime": "30 minutes",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Brief description of the dish"
  }}
]

Make sure the JSON is valid and parseable.
`);

    const chain = RunnableSequence.from([
      prompt,
      this.chatModel,
      new StringOutputParser(),
    ]);

    try {
      const result = await chain.invoke({
        ingredients: ingredients.join(", "),
        numberOfRecipes: numberOfRecipes.toString(),
        context: context,
      });

      // Parse the JSON response
      const cleanedResult = result.trim();
      const jsonMatch = cleanedResult.match(/\[[\s\S]*\]/);

      if (!jsonMatch) {
        throw new Error("No valid JSON array found in response");
      }

      const recipes: Recipe[] = JSON.parse(jsonMatch[0]);

      // Validate and ensure we have the correct number of recipes
      if (!Array.isArray(recipes) || recipes.length === 0) {
        throw new Error("Invalid recipe format received");
      }

      // Ensure each recipe has required fields
      return recipes.slice(0, numberOfRecipes).map((recipe, index) => ({
        id: recipe.id || `recipe-${index + 1}`,
        title: recipe.title || `Recipe ${index + 1}`,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : [],
        instructions: Array.isArray(recipe.instructions)
          ? recipe.instructions
          : [],
        estimatedTime: recipe.estimatedTime || "30 minutes",
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || "Medium",
        description: recipe.description || "",
      }));
    } catch (error) {
      console.error("Error generating recipes:", error);

      // Fallback: generate simple recipes
      return this.generateFallbackRecipes(ingredients, numberOfRecipes);
    }
  }

  private generateFallbackRecipes(
    ingredients: string[],
    numberOfRecipes: number,
  ): Recipe[] {
    const fallbackRecipes: Recipe[] = [];

    for (let i = 0; i < numberOfRecipes; i++) {
      fallbackRecipes.push({
        id: `recipe-${i + 1}`,
        title: `${ingredients[0] || "Mixed"} Recipe ${i + 1}`,
        ingredients: ingredients.slice(0, 5).concat(["salt", "pepper", "oil"]),
        instructions: [
          "Prepare all ingredients",
          "Heat oil in a pan",
          "Cook the main ingredients",
          "Season with salt and pepper",
          "Serve hot",
        ],
        estimatedTime: "20-30 minutes",
        servings: 4,
        difficulty: "Easy",
        description: `A simple recipe using ${ingredients.join(", ")}`,
      });
    }

    return fallbackRecipes;
  }

  private splitIntoChunks(
    text: string,
    chunkSize: number,
    overlap: number,
  ): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.substring(start, end);
      chunks.push(chunk);

      if (end === text.length) break;
      start = end - overlap;
    }

    return chunks;
  }

  getDocumentCount(): number {
    return this.documents.size;
  }

  hasDocument(documentId: string): boolean {
    return this.documents.has(documentId);
  }
}

// Singleton instance
export const ragService = new RAGService();
