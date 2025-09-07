import { createContext, useContext, useMemo, useState } from "react";

export interface RecipeItem {
  id: string;
  name: string;
  totalTime?: string;
  prepTime?: string;
  cookTime?: string;
  steps: string[];
  additional?: string;
  imageUrl?: string | null;
}

interface RecipesState {
  recipes: RecipeItem[];
  setRecipes: (r: RecipeItem[]) => void;
}

const Ctx = createContext<RecipesState | null>(null);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const value = useMemo(() => ({ recipes, setRecipes }), [recipes]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecipes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRecipes must be used within RecipesProvider");
  return ctx;
}
