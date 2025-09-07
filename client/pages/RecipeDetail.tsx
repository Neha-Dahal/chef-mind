import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Printer } from "lucide-react";
import type { RecipeItem } from "@/context/RecipesContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateRecipe = (location.state as any)?.recipe as RecipeItem | undefined;

  let recipe: RecipeItem | null = stateRecipe || null;

  if (!recipe && id) {
    try {
      const raw = sessionStorage.getItem(`recipe:${id}`);
      if (raw) recipe = JSON.parse(raw);
    } catch {}
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 size-4" /> Print
        </Button>
      </div>

      <div className="mx-auto max-w-3xl">
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          {recipe.name || "Untitled Recipe"}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-amber-600 dark:text-amber-400" />
            Total: {recipe.totalTime || "—"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
            Prep: {recipe.prepTime || "—"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-rose-900 dark:bg-rose-500/15 dark:text-rose-200">
            Cook: {recipe.cookTime || "—"}
          </span>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            {recipe.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>
        </section>

        {recipe.additional && (
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold">Additional ingredients</h2>
            <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
              {recipe.additional}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
