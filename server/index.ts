import "dotenv/config";
import express from "express";
import cors from "cors";
import { uploadMiddleware, handlePDFUpload } from "./routes/pdfUpload";
import { handleRecipeGeneration } from "./routes/recipeGeneration";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // RAG system routes
  app.post("/api/upload-pdf", uploadMiddleware, handlePDFUpload);
  app.post("/api/generate-recipes", handleRecipeGeneration);

  return app;
}
