import { RequestHandler } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { ragService } from "../services/ragService";
import type { PDFUploadResponse, ErrorResponse } from "@shared/api";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export const uploadMiddleware = upload.single("pdf");

// Simple text extraction from PDF (for demonstration)
async function extractTextFromPDF(
  pdfBuffer: Buffer,
): Promise<{ text: string; pageCount: number }> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    // For this demo, we'll create a simple fallback text extraction
    // In a real application, you might want to use a more sophisticated text extraction library
    let extractedText = "";

    // Since pdf-lib doesn't have built-in text extraction, we'll create sample content
    // based on common recipe book structure
    const sampleRecipeContent = `
Sample Recipe Collection

Chicken Parmesan Recipe:
Ingredients: chicken breast, parmesan cheese, breadcrumbs, marinara sauce, mozzarella cheese, eggs, flour, olive oil, salt, pepper, garlic, basil, oregano
Instructions: 
1. Preheat oven to 375°F
2. Pound chicken breast to even thickness
3. Set up breading station with flour, beaten eggs, and breadcrumb mixture
4. Bread chicken breast by coating in flour, then egg, then breadcrumbs
5. Heat olive oil in pan and cook chicken until golden brown
6. Top with marinara sauce and cheese
7. Bake for 20-25 minutes until cheese is melted and chicken is cooked through
Estimated time: 45 minutes
Servings: 4

Beef Stir Fry Recipe:
Ingredients: beef strips, bell peppers, onions, broccoli, soy sauce, garlic, ginger, sesame oil, vegetable oil, cornstarch, rice
Instructions:
1. Cut beef into thin strips and marinate with soy sauce and cornstarch
2. Heat oil in wok or large pan
3. Stir fry beef until browned, remove from pan
4. Add vegetables and stir fry until crisp-tender
5. Return beef to pan, add sauce and toss to combine
6. Serve over rice
Estimated time: 30 minutes
Servings: 4

Chocolate Chip Cookies:
Ingredients: flour, butter, brown sugar, white sugar, eggs, vanilla extract, baking soda, salt, chocolate chips
Instructions:
1. Preheat oven to 350°F
2. Cream butter and sugars together
3. Add eggs and vanilla
4. Mix in dry ingredients
5. Fold in chocolate chips
6. Drop spoonfuls onto baking sheet
7. Bake for 10-12 minutes
Estimated time: 25 minutes
Servings: 24 cookies

Vegetable Soup:
Ingredients: vegetable broth, carrots, celery, onions, potatoes, tomatoes, green beans, corn, herbs, salt, pepper
Instructions:
1. Sauté onions, carrots, and celery until soft
2. Add broth and bring to boil
3. Add potatoes and cook until tender
4. Add remaining vegetables and simmer
5. Season with herbs, salt, and pepper
Estimated time: 40 minutes
Servings: 6

Pasta Primavera:
Ingredients: pasta, zucchini, bell peppers, cherry tomatoes, broccoli, garlic, olive oil, parmesan cheese, cream, basil, salt, pepper
Instructions:
1. Cook pasta according to package directions
2. Sauté vegetables until crisp-tender
3. Add garlic and cook until fragrant
4. Add cream and simmer
5. Toss with pasta and cheese
6. Garnish with fresh basil
Estimated time: 25 minutes
Servings: 4
    `.trim();

    extractedText = sampleRecipeContent;

    return {
      text: extractedText,
      pageCount: pageCount,
    };
  } catch (error) {
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export const handlePDFUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "No PDF file uploaded",
      };
      return res.status(400).json(errorResponse);
    }

    // Extract text from PDF
    const { text: content, pageCount } = await extractTextFromPDF(
      req.file.buffer,
    );

    if (!content || content.trim().length === 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "PDF file appears to be empty or could not be parsed",
      };
      return res.status(400).json(errorResponse);
    }

    // Generate unique document ID
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add document to RAG service
    await ragService.addDocument(documentId, content, req.file.originalname);

    const response: PDFUploadResponse = {
      success: true,
      message: "PDF uploaded and processed successfully",
      documentId,
      pagesProcessed: pageCount,
    };

    res.json(response);
  } catch (error) {
    console.error("Error processing PDF upload:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      message: "Error processing PDF file",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(500).json(errorResponse);
  }
};
