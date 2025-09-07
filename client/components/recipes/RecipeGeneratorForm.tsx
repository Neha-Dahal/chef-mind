import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useRecipeGenerator } from "@/context/RecipeGeneratorContext";
import type {
  PDFUploadResponse,
  RecipeGenerationRequest,
  RecipeGenerationResponse,
} from "@shared/api";
import { RecipeGrid } from "./RecipeGrid";

export function RecipeGeneratorForm() {
  const {
    currentStep,
    steps,
    nextStep,
    prevStep,
    setStep,
    ingredients,
    setIngredients,
    numberOfRecipes,
    setNumberOfRecipes,
    documentId,
    setDocumentId,
    recipes,
    setRecipes,
    isLoading,
    setIsLoading,
    error,
    setError,
    resetForm,
  } = useRecipeGenerator();

  const [newIngredient, setNewIngredient] = useState("");
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setUploadProgress("Uploading PDF...");

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      const data: PDFUploadResponse = await response.json();

      if (data.success) {
        setDocumentId(data.documentId);
        setUploadProgress(
          `Processed ${data.pagesProcessed} pages successfully!`,
        );
        setTimeout(() => {
          setUploadProgress("");
          nextStep();
        }, 1500);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload PDF");
      setUploadProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRecipes = async () => {
    if (!documentId) {
      setError("Please upload a recipe book first");
      return;
    }

    if (ingredients.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: RecipeGenerationRequest = {
        ingredients,
        numberOfRecipes,
        documentId,
      };

      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipes");
      }

      const data: RecipeGenerationResponse = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
      } else {
        throw new Error(data.message || "Failed to generate recipes");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate recipes",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return ingredients.length > 0;
      case 2:
        return documentId !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (recipes.length > 0) {
    return <RecipeGrid />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setError(null);
              resetForm();
            }}
            className="flex items-center gap-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Recipe Generator
            </h1>
            <p className="text-muted-foreground">
              Follow the steps to create your personalized recipes
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: step.isActive ? 1.1 : 1,
                    opacity: step.isActive ? 1 : step.isCompleted ? 0.8 : 0.5,
                  }}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    step.isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted text-muted-foreground"
                  }`}
                  onClick={() => {
                    // Only allow clicking on completed steps or the next step
                    if (
                      step.isCompleted ||
                      step.id === currentStep + 1 ||
                      step.id === currentStep
                    ) {
                      setStep(step.id);
                    }
                  }}
                >
                  {step.isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </motion.div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 transition-colors duration-300 ${
                      steps[index + 1].isCompleted || steps[index + 1].isActive
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-muted-foreground">
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                <CardContent className="p-0">
                  {/* Step 1: Ingredients */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <form
                        onSubmit={handleAddIngredient}
                        className="flex gap-2"
                      >
                        <Input
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                          placeholder="Add an ingredient (e.g., chicken breast, tomatoes)"
                          className="flex-1"
                        />
                        <Button type="submit" disabled={!newIngredient.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </form>

                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          Your Ingredients ({ingredients.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-lg bg-muted/20">
                          {ingredients.length === 0 ? (
                            <p className="text-muted-foreground text-center w-full">
                              No ingredients added yet. Add some ingredients to
                              get started!
                            </p>
                          ) : (
                            ingredients.map((ingredient) => (
                              <Badge
                                key={ingredient}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1"
                              >
                                {ingredient}
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                                  onClick={() =>
                                    handleRemoveIngredient(ingredient)
                                  }
                                />
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: PDF Upload */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">
                          Upload Your Recipe Book
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Choose a PDF file containing your favorite recipes
                        </p>

                        <label htmlFor="pdf-upload">
                          <Button asChild disabled={isLoading}>
                            <span className="cursor-pointer">
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Choose PDF File"
                              )}
                            </span>
                          </Button>
                        </label>

                        <input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isLoading}
                        />

                        {uploadProgress && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-primary font-medium"
                          >
                            {uploadProgress}
                          </motion.p>
                        )}
                      </div>

                      {documentId && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">
                              Recipe book uploaded successfully!
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Generate Recipes */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Number of Recipes: {numberOfRecipes}
                          </label>
                          <Slider
                            value={[numberOfRecipes]}
                            onValueChange={(value) =>
                              setNumberOfRecipes(value[0])
                            }
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1</span>
                            <span>10</span>
                          </div>
                        </div>

                        <div className="bg-muted/20 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Summary</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Ingredients: {ingredients.join(", ")}</p>
                            <p>
                              Recipe book:{" "}
                              {documentId ? "Uploaded ✓" : "Not uploaded"}
                            </p>
                            <p>Recipes to generate: {numberOfRecipes}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerateRecipes}
                        disabled={isLoading || !documentId}
                        className="w-full py-6 text-lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Recipes...
                          </>
                        ) : (
                          <>
                            Generate {numberOfRecipes} Recipe
                            {numberOfRecipes !== 1 ? "s" : ""}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                    >
                      <p className="text-destructive text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  {currentStep < 3 && (
                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <Button
                        onClick={nextStep}
                        disabled={!canProceedFromStep(currentStep)}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
