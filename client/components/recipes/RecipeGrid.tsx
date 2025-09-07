import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Users, ChefHat, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecipeGenerator } from "@/context/RecipeGeneratorContext";
import { RecipeDetailModal } from "./RecipeDetailModal";

export function RecipeGrid() {
  const { recipes, selectedRecipe, setSelectedRecipe, resetForm } =
    useRecipeGenerator();

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (recipeId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(recipeId)) {
      newExpanded.delete(recipeId);
    } else {
      newExpanded.add(recipeId);
    }
    setExpandedCards(newExpanded);
  };

  const isExpanded = (recipeId: string) => expandedCards.has(recipeId);

  const truncateInstructions = (
    instructions: string[],
    maxLines: number = 3,
  ) => {
    if (instructions.length <= maxLines) return instructions;
    return instructions.slice(0, maxLines);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedRecipe(null);
              resetForm();
            }}
            className="flex items-center gap-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Generate New Recipes
          </Button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Generated Recipes
            </h1>
            <p className="text-muted-foreground">
              {recipes.length} delicious recipe{recipes.length !== 1 ? "s" : ""}{" "}
              created just for you
            </p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Recipe Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`ml-2 shrink-0 ${
                        recipe.difficulty === "Easy"
                          ? "border-green-500 text-green-700 dark:text-green-300"
                          : recipe.difficulty === "Medium"
                            ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                            : "border-red-500 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Recipe Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {recipe.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.estimatedTime}
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      Ingredients ({recipe.ingredients.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 6).map((ingredient, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {ingredient}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.ingredients.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Instructions</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(recipe.id)}
                        className="h-6 px-2 text-xs"
                      >
                        {isExpanded(recipe.id) ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Show More
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(isExpanded(recipe.id)
                        ? recipe.instructions
                        : truncateInstructions(recipe.instructions)
                      ).map((instruction, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{instruction}</span>
                        </motion.div>
                      ))}

                      {!isExpanded(recipe.id) &&
                        recipe.instructions.length > 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground text-center py-2"
                          >
                            ... and {recipe.instructions.length - 3} more steps
                          </motion.div>
                        )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    View Full Recipe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recipe Detail Modal */}
        <AnimatePresence>
          {selectedRecipe && (
            <RecipeDetailModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
