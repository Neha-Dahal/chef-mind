import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Recipe, FormStep } from "@shared/api";

interface RecipeGeneratorContextType {
  // Form steps
  currentStep: number;
  steps: FormStep[];
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Form data
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  numberOfRecipes: number;
  setNumberOfRecipes: (count: number) => void;
  documentId: string | null;
  setDocumentId: (id: string | null) => void;

  // Results
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // UI state
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;

  // Actions
  resetForm: () => void;
}

const RecipeGeneratorContext = createContext<
  RecipeGeneratorContextType | undefined
>(undefined);

const initialSteps: FormStep[] = [
  {
    id: 1,
    title: "Ingredients",
    description: "Enter the ingredients you have available",
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    title: "Upload Recipe Book",
    description: "Upload your PDF recipe book for personalized suggestions",
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    title: "Generate Recipes",
    description: "Choose how many recipes you want to generate",
    isCompleted: false,
    isActive: false,
  },
];

export function RecipeGeneratorProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<FormStep[]>(initialSteps);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [numberOfRecipes, setNumberOfRecipes] = useState(3);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);

  const updateSteps = (stepNumber: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        isCompleted: step.id < stepNumber,
        isActive: step.id === stepNumber,
      })),
    );
  };

  const nextStep = () => {
    if (currentStep < 3) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateSteps(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      updateSteps(newStep);
    }
  };

  const setStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      updateSteps(step);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSteps(initialSteps);
    setIngredients([]);
    setNumberOfRecipes(3);
    setDocumentId(null);
    setRecipes([]);
    setIsLoading(false);
    setError(null);
    setSelectedRecipe(null);
    setShowForm(false);
  };

  const value: RecipeGeneratorContextType = {
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
    showForm,
    setShowForm,
    selectedRecipe,
    setSelectedRecipe,
    resetForm,
  };

  return (
    <RecipeGeneratorContext.Provider value={value}>
      {children}
    </RecipeGeneratorContext.Provider>
  );
}

export function useRecipeGenerator() {
  const context = useContext(RecipeGeneratorContext);
  if (context === undefined) {
    throw new Error(
      "useRecipeGenerator must be used within a RecipeGeneratorProvider",
    );
  }
  return context;
}
