# Chef Mind - AI Recipe Generation App

A production-ready full-stack React application featuring AI-powered recipe generation using Retrieval-Augmented Generation (RAG). Built with React Router 6 SPA mode, TypeScript, OpenAI integration, and modern tooling.

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server + OpenAI API + LangChain
- **AI/ML**: OpenAI API KEY, LangChain, OpenAI Embeddings (text-embedding-ada-002)
- **PDF Processing**: pdf-lib for text extraction
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/           # Component library
│   ├── ui/              # Pre-built UI component library
│   ├── recipes/         # Recipe-specific components (generator, grid, modal)
│   └── layout/          # Site layout components (header, footer)
├── context/             # React Context for recipe generation state
├── hooks/               # Custom React hooks (toast notifications)
├── lib/                 # Utility functions
├── App.tsx              # App entry point and SPA routing setup
└── global.css           # TailwindCSS 3 theming and global styles

server/                  # Express API backend
├── index.ts             # Main server setup (express config + routes)
├── routes/              # API handlers
│   ├── pdfUpload.ts     # PDF processing endpoint
│   └── recipeGeneration.ts # RAG-based recipe generation
└── services/            # Core business logic
    └── ragService.ts    # RAG implementation with OpenAI/LangChain

shared/                  # Types used by both client & server
└── api.ts              # Recipe interfaces and API types
```

## Key Features

### AI-Powered Recipe Generation

- **RAG System**: Upload PDF cookbooks and generate personalized recipes using vector search
- **Semantic Understanding**: Uses OpenAI embeddings for intelligent content matching
- **Context-Aware Generation**: LangChain integration for structured recipe creation
- **Ingredient-Based Search**: Find recipes based on available ingredients

### Advanced PDF Processing

- **Multi-format Support**: Extract text from PDF cookbooks using pdf-lib
- **Chunked Processing**: Split content into searchable segments with overlap
- **Vector Embeddings**: Convert text to embeddings for semantic similarity search
- **Fallback System**: Multiple layers of error handling and sample content

### Modern UI/UX

- **Multi-step Forms**: Guided recipe generation workflow
- **Real-time Feedback**: Live processing status and error handling
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Recipe Management**: Grid view, detailed modals, and organized display

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css`
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes

- `GET /api/ping` - Simple ping api
- `POST /api/upload-pdf` - Upload PDF cookbook for RAG processing
- `POST /api/generate-recipes` - Generate recipes using RAG

### RAG Service Architecture

The core RAG implementation (`server/services/ragService.ts`) provides:

```typescript
// Document processing and embedding
await ragService.addDocument(documentId, content, source);

// Semantic search with vector similarity
const similarContent = await ragService.searchSimilarContent(query, k);

// AI-powered recipe generation
const recipes = await ragService.generateRecipes(
  ingredients,
  count,
  documentId,
);
```

**Key Components:**

- **Vector Storage**: In-memory document chunks with embeddings
- **Similarity Search**: Cosine similarity calculation for content retrieval
- **LLM Integration**: Structured prompting with LangChain for consistent output
- **Error Handling**: Comprehensive fallbacks for API failures and malformed responses

### Shared Types

Import consistent types in both client and server:

```typescript
// Example: Recipe generation request
import { RecipeGenerationRequest, Recipe } from "@shared/api";

// Core interfaces for RAG system
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  estimatedTime?: string;
  servings?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  description?: string;
}
```

Path aliases:

- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
```

## Environment Setup

Required environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini  # Optional: defaults to gpt-4o-mini
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route

1. **Optional**: Create a shared interface in `shared/api.ts`:

```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:

```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: "Hello from my endpoint!",
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:

```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:

```typescript
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

const response = await fetch("/api/my-endpoint");
const data: MyRouteResponse = await response.json();
```

### Adding RAG Features

For extending the RAG system:

1. **New Document Type**: Extend `ragService.addDocument()` for different content types
2. **Custom Embeddings**: Modify embedding generation in `ragService.ts`
3. **Enhanced Search**: Add filters to `searchSimilarContent()` method
4. **Recipe Customization**: Extend prompt templates in recipe generation

### New Page Route

1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces

## RAG System Architecture

- **Vector Embeddings**: OpenAI text-embedding-ada-002 for semantic search
- **LLM Integration**: GPT-4o-mini with LangChain for structured generation
- **Document Processing**: Chunked text processing with overlap for context preservation
- **Similarity Search**: Cosine similarity for finding relevant cookbook content
- **Fallback Systems**: Multiple layers of error handling and graceful degradation
- **Memory Storage**: In-memory vector store (consider persistent storage for production)
