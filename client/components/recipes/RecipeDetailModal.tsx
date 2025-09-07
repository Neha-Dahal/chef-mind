import React from "react";
import { motion } from "framer-motion";
import { X, Clock, Users, ChefHat, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Recipe } from "@shared/api";

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .meta { display: flex; gap: 20px; margin: 10px 0; }
              .ingredients { margin: 20px 0; }
              .instructions { margin: 20px 0; }
              .step { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
              .ingredient { display: inline-block; background: #e0e0e0; padding: 3px 8px; margin: 2px; border-radius: 15px; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            ${recipe.description ? `<p>${recipe.description}</p>` : ""}
            <div class="meta">
              ${recipe.estimatedTime ? `<span><strong>Time:</strong> ${recipe.estimatedTime}</span>` : ""}
              ${recipe.servings ? `<span><strong>Servings:</strong> ${recipe.servings}</span>` : ""}
              ${recipe.difficulty ? `<span><strong>Difficulty:</strong> ${recipe.difficulty}</span>` : ""}
            </div>
            <div class="ingredients">
              <h3>Ingredients</h3>
              ${recipe.ingredients.map((ingredient) => `<span class="ingredient">${ingredient}</span>`).join("")}
            </div>
            <div class="instructions">
              <h3>Instructions</h3>
              ${recipe.instructions
                .map(
                  (instruction, idx) => `
                <div class="step">
                  <strong>Step ${idx + 1}:</strong> ${instruction}
                </div>
              `,
                )
                .join("")}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const content = `
${recipe.title}
${recipe.description ? recipe.description + "\n" : ""}
${recipe.estimatedTime ? "Time: " + recipe.estimatedTime : ""}
${recipe.servings ? "Servings: " + recipe.servings : ""}
${recipe.difficulty ? "Difficulty: " + recipe.difficulty : ""}

INGREDIENTS:
${recipe.ingredients.map((ingredient) => `• ${ingredient}`).join("\n")}

INSTRUCTIONS:
${recipe.instructions.map((instruction, idx) => `${idx + 1}. ${instruction}`).join("\n\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none bg-background/95 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-muted-foreground">{recipe.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="hidden sm:flex"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Recipe Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {recipe.estimatedTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {recipe.estimatedTime}
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {recipe.servings} servings
              </div>
            )}
            {recipe.difficulty && (
              <Badge
                variant="outline"
                className={`${
                  recipe.difficulty === "Easy"
                    ? "border-green-500 text-green-700 dark:text-green-300"
                    : recipe.difficulty === "Medium"
                      ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                      : "border-red-500 text-red-700 dark:text-red-300"
                }`}
              >
                {recipe.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Ingredients ({recipe.ingredients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">{ingredient}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{instruction}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2 sm:hidden">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
