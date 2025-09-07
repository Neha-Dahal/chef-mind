import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import type { RecipesRequest, RecipesResponse } from "@shared/api";
import { parseRecipes } from "@/lib/recipes";
import { useRecipes } from "@/context/RecipesContext";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export default function Index() {
  const { recipes, setRecipes } = useRecipes();
  const [ingredients, setIngredients] = useState("");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: RecipesRequest = { ingredients, count };
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const { text } = (await res.json()) as RecipesResponse;
      let parsed = parseRecipes(text).filter((r) => r.name || r.steps.length);
      if (parsed.length > count) parsed = parsed.slice(0, count);
      setRecipes(parsed);
      parsed.forEach((r) =>
        sessionStorage.setItem(`recipe:${r.id}`, JSON.stringify(r)),
      );
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,hsl(var(--brand)/0.18),transparent_60%),radial-gradient(600px_300px_at_10%_110%,hsl(var(--primary)/0.25),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <Sparkles className="size-3.5 text-brand" />
            <span>Expert AI cook powered by OpenAI</span>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
            Turn ingredients into delicious recipes
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Paste your ingredients and instantly get multiple recipe ideas with
            clear steps, times, and simple pantry additions.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 grid max-w-4xl gap-6"
        >
          <Card className="border-brand/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="E.g. chicken breast, tomatoes, basil, olive oil, pasta..."
                className="min-h-32"
                required
              />
              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium" htmlFor="count">
                    How many recipes?
                  </label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    max={5}
                    value={count}
                    onBlur={(e) =>
                      setCount(
                        Math.max(1, Math.min(5, Number(e.target.value) || 1)),
                      )
                    }
                    onChange={(e) =>
                      setCount(
                        Math.max(1, Math.min(5, Number(e.target.value) || 1)),
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="px-6">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />{" "}
                      Generating…
                    </>
                  ) : (
                    <>Generate recipes</>
                  )}
                </Button>
              </div>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {recipes.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
