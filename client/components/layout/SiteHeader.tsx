import { Link } from "react-router-dom";
import { ChefHat, Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (resolvedTheme || theme || "system") as string;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-brand/90 to-primary text-primary-foreground shadow-sm">
            <ChefHat className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg tracking-tight">ChefMind</span>
            <span className="text-xs text-muted-foreground">AI recipe generator</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(current === "dark" ? "light" : "dark")}
            >
              {current === "dark" ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
