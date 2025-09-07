import { motion } from "framer-motion";
import {
  ChefHat,
  BookOpen,
  Sparkles,
  ArrowRight,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecipeGenerator } from "@/context/RecipeGeneratorContext";
import { RecipeGeneratorForm } from "@/components/recipes/RecipeGeneratorForm";

export default function Index() {
  const { recipes, showForm, setShowForm } = useRecipeGenerator();

  const features = [
    {
      icon: ChefHat,
      title: "AI-Powered Recipe Generation",
      description:
        "Our advanced AI analyzes your ingredients and recipe book to create personalized cooking suggestions.",
    },
    {
      icon: BookOpen,
      title: "Upload Your Recipe Book",
      description:
        "Upload any PDF cookbook and let our system learn from your favorite recipes to generate similar dishes.",
    },
    {
      icon: Sparkles,
      title: "Smart Ingredient Matching",
      description:
        "Get recipe suggestions that perfectly match the ingredients you have available in your kitchen.",
    },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Happy Cooks" },
    { icon: BookOpen, value: "500+", label: "Recipe Books Processed" },
    { icon: Clock, value: "< 1min", label: "Generation Time" },
  ];

  if (showForm || recipes.length > 0) {
    return <RecipeGeneratorForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="container mx-auto px-4 pt-20 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="inline-block p-4 rounded-full bg-primary/10 mb-6"
              >
                <ChefHat className="w-12 h-12 text-primary" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-6"
              >
                Chef Mind
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Transform your ingredients into delicious recipes with
                AI-powered suggestions from your own cookbook
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Chef Mind Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the magic of AI-powered recipe generation in three simple
            steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-block p-4 rounded-full bg-primary/10 mb-6"
                  >
                    <feature.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Amazing Recipes?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of home cooks who are already using Chef Mind to
              transform their cooking experience.
            </p>
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Generate Recipes Now
              <Sparkles className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
