import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { RecipeItem } from "@/context/RecipesContext";

export function RecipeCard({ recipe }: { recipe: RecipeItem }) {
  const preview = recipe.steps.length
    ? recipe.steps.slice(0, 2).join(" \n")
    : "No steps preview available.";

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{recipe.totalTime || "—"}</span>
          </span>

          <span
            aria-label={`Prep time ${recipe.prepTime || "—"}`}
            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-900 dark:border-amber-700 dark:bg-amber-900/10 dark:text-amber-200"
          >
            <span className="text-xs">Prep:</span>&nbsp;
            <span className="text-sm font-medium">{recipe.prepTime || "—"}</span>
          </span>

          <span
            aria-label={`Cook time ${recipe.cookTime || "—"}`}
            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-900 dark:border-rose-700 dark:bg-rose-900/10 dark:text-rose-200"
          >
            <span className="text-xs">Cook:</span>&nbsp;
            <span className="text-sm font-medium">{recipe.cookTime || "—"}</span>
          </span>
        </div>

        <p className="line-clamp-3 text-sm whitespace-pre-wrap">{preview}</p>

        <div className="flex justify-end">
          <Button asChild size="sm" className="transition-colors group-hover:bg-primary/90">
            <Link to={`/recipe/${encodeURIComponent(recipe.id)}`} state={{ recipe }}>
              Read more
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
