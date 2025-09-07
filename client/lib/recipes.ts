import type { RecipeItem } from "@/context/RecipesContext";

function clean(s?: string | null) {
  return s?.replace(/\s+/g, " ").trim() || undefined;
}

function parseTimes(block: string) {
  const totalMatch = block.match(/(?:Cooking Time|Total(?: Time)?)\s*:\s*([^\n]+)/i);
  const prepMatch = block.match(/Prep(?:aration)?\s*:\s*([^\n]+)/i);
  const cookMatch = block.match(/Cook(?:ing)?\s*:\s*([^\n]+)/i);
  return {
    totalTime: clean(totalMatch?.[1] || undefined),
    prepTime: clean(prepMatch?.[1] || undefined),
    cookTime: clean(cookMatch?.[1] || undefined),
  };
}

function findRecipeSections(text: string) {
  const norm = text.replace(/\r\n?/g, "\n");
  const matches = [...norm.matchAll(/(^|\n)\s*(?:\d+\.\s*)?Recipe Name:\s*(.+)$/gim)];
  if (matches.length === 0) return [norm.trim()];
  const sections: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index ?? 0;
    const end = i < matches.length - 1 ? (matches[i + 1].index ?? norm.length) : norm.length;
    sections.push(norm.slice(start, end).trim());
  }
  return sections.filter(Boolean);
}

function extractSteps(block: string) {
  const startIdxs = [
    block.search(/Step-by-Step Instructions\s*:/i),
    block.search(/Instructions\s*:/i),
    block.search(/Steps\s*:/i),
  ].filter((i) => i >= 0);
  const start = startIdxs.length ? Math.min(...startIdxs) : -1;
  const instr = start >= 0 ? block.slice(start) : block;
  const numbered = [...instr.matchAll(/^\s*\d+\.\s*(.+)$/gim)].map((m) => m[1].trim());
  if (numbered.length) return numbered;
  const lines = instr.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return lines.slice(0, 10);
}

export function parseRecipes(raw: string): RecipeItem[] {
  const sections = findRecipeSections(raw);
  const out: RecipeItem[] = [];

  for (let i = 0; i < sections.length; i++) {
    const ch = sections[i];

    const nameMatch = ch.match(/Recipe Name:\s*([^\n]+)/i) || ch.match(/^(?:\d+\.\s*)?([^\n]{3,80})$/m);
    const name = clean(nameMatch?.[1]) || `Untitled Recipe ${i + 1}`;

    const { totalTime, prepTime, cookTime } = parseTimes(ch);
    const steps = extractSteps(ch).map((s) => s.replace(/^Optional:\s*/i, "Optional: ").trim()).filter(Boolean);

    const addlMatch = ch.match(/Additional Ingredients\s*:\s*([\s\S]*?)(?:\n\s*\n|$)/i) || ch.match(/Additional\s*:\s*([\s\S]*?)(?:\n\s*\n|$)/i);
    const additional = clean(addlMatch?.[1] || undefined);

    const item: RecipeItem = {
      id: `${Date.now()}-${i}`,
      name,
      totalTime,
      prepTime,
      cookTime,
      steps,
      additional,
      imageUrl: null,
    };

    // Prevent empty cards: require at least a name or one step
    if (item.name || item.steps.length) out.push(item);
  }
  return out;
}
