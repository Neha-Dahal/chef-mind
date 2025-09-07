# Chef Mind

Chef Mind is an AI-powered recipe generation application that uses Retrieval-Augmented Generation (RAG) to create personalized recipes from uploaded cookbooks. Built with React, TypeScript, Vite, and Tailwind CSS, it offers a modern interface for uploading PDF cookbooks and generating custom recipes based on available ingredients.

## Features

- **PDF Cookbook Upload:** Upload PDF recipe books and extract content for RAG processing
- **AI-Powered Recipe Generation:** Generate personalized recipes using OpenAI GPT models and LangChain
- **Semantic Search:** Find relevant recipes using vector embeddings and cosine similarity
- **Ingredient-Based Filtering:** Generate recipes based on available ingredients
- **Recipe Customization:** Specify number of recipes, difficulty levels, and dietary preferences
- **Responsive Design:** Optimized for mobile and desktop devices
- **Real-time Processing:** Live feedback during PDF processing and recipe generation

## RAG (Retrieval-Augmented Generation) Architecture

Chef Mind implements a sophisticated RAG system for recipe generation:

### PDF Processing Pipeline

1. **Upload**: Users upload PDF cookbooks via the `/api/upload-pdf` endpoint
2. **Text Extraction**: Content is extracted using pdf-lib (with fallback sample content for demo)
3. **Chunking**: Text is split into 1000-character chunks with 200-character overlap
4. **Embedding**: Each chunk is converted to vector embeddings using OpenAI's `text-embedding-ada-002`
5. **Storage**: Chunks and embeddings are stored in memory for similarity search

### Recipe Generation Process

1. **Query Formation**: User ingredients are combined into a search query
2. **Semantic Search**: Vector similarity search finds the most relevant cookbook chunks
3. **Context Assembly**: Top 8 similar chunks are combined as context for the AI model
4. **LLM Generation**: OpenAI GPT-4o-mini generates recipes using LangChain with structured prompts
5. **Response Parsing**: JSON recipes are extracted, validated, and returned to the user

### Technical Components

- **Vector Embeddings**: OpenAI text-embedding-ada-002 for semantic understanding
- **LLM**: GPT-4o-mini with temperature 0.7 for creative recipe generation
- **Similarity Search**: Cosine similarity calculation for finding relevant content
- **Fallback System**: Text-based search if embeddings fail, with sample recipes as last resort
- **Validation**: Structured recipe format with required fields and error handling

## Project Structure

```
chef mind/
├── client/         # Frontend React app
│   ├── components/ # UI components (layout, recipes, ui)
│   │   ├── recipes/    # Recipe-specific components (RecipeGrid, RecipeDetailModal, RecipeGeneratorForm)
│   │   └── ui/         # Reusable UI components (button, card, input, etc.)
│   ├── context/    # React Context for recipe generation state
│   ├── hooks/      # Custom React hooks (toast notifications)
│   ├── lib/        # Utility functions
│   ├── pages/      # App pages (Index, NotFound)
│   ├── App.tsx     # Main app with SPA routing
│   └── global.css  # TailwindCSS styles and theming
├── server/         # Backend API server (Node.js/Express)
│   ├── routes/     # API endpoints
│   │   ├── pdfUpload.ts        # PDF upload and processing
│   │   └── recipeGeneration.ts # RAG-based recipe generation
│   ├── services/   # Core business logic
│   │   └── ragService.ts       # RAG implementation with OpenAI/LangChain
│   └── index.ts    # Express server setup
├── shared/         # Shared TypeScript interfaces
│   └── api.ts      # API request/response types
├── public/         # Static assets
└── config files    # Vite, TypeScript, Tailwind configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- OpenAI API key for recipe generation

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd chef mind
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   AI_MODEL=gpt-4o-mini  # Optional: defaults to gpt-4o-mini
   ```
4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   This starts both frontend and backend on port 8080.

### Environment Variables

The following environment variables are required:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT and embeddings
- `AI_MODEL`: (Optional) OpenAI model to use (defaults to `gpt-4o-mini`)

## Technologies Used

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router 6
- **Backend:** Node.js, Express.js
- **AI/ML:** OpenAI GPT-4o-mini, LangChain, OpenAI Embeddings (text-embedding-ada-002)
- **PDF Processing:** pdf-lib for text extraction
- **State Management:** React Context API
- **Styling:** Tailwind CSS with custom theming
- **UI Components:** Radix UI primitives with custom styling

## API Endpoints

- `POST /api/upload-pdf`: Upload and process PDF cookbooks
  - Accepts: multipart/form-data with PDF file
  - Returns: Document ID for recipe generation
- `POST /api/generate-recipes`: Generate recipes using RAG
  - Body: `{ ingredients: string[], numberOfRecipes: number, documentId: string }`
  - Returns: Array of generated recipes with full details

## Key Files & Components

### Core RAG Implementation

- `server/services/ragService.ts`: Main RAG service with embeddings, chunking, and similarity search
- `server/routes/pdfUpload.ts`: PDF processing and text extraction endpoint
- `server/routes/recipeGeneration.ts`: Recipe generation API using RAG context

### Frontend Components

- `client/components/recipes/RecipeGeneratorForm.tsx`: Multi-step form for recipe generation
- `client/components/recipes/RecipeGrid.tsx`: Display grid for generated recipes
- `client/components/recipes/RecipeDetailModal.tsx`: Detailed recipe view modal
- `client/context/RecipeGeneratorContext.tsx`: Global state management for RAG workflow

### Shared Types

- `shared/api.ts`: TypeScript interfaces for API communication, recipe structure, and error handling

### Configuration

- `.env`: OpenAI API key and model configuration
- `vite.config.ts`: Development server with proxy for API routes

## Scripts

- `pnpm dev`: Start development server (both client and server on port 8080)
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm typecheck`: Run TypeScript type checking
- `pnpm test`: Run Vitest tests

## Usage

1. **Upload Cookbook**: Upload a PDF cookbook using the upload form
2. **Select Ingredients**: Choose available ingredients from your pantry
3. **Generate Recipes**: Specify number of recipes and any preferences
4. **View Results**: Browse generated recipes with full details, ingredients, and instructions
5. **Recipe Details**: Click on any recipe to view detailed cooking instructions

## Development Notes

- **Vector Storage**: Currently uses in-memory storage (will reset on server restart)
- **PDF Processing**: Uses sample content for demonstration; real PDF text extraction can be enhanced
- **Rate Limiting**: Consider implementing rate limiting for production OpenAI API usage
- **Error Handling**: Comprehensive fallback system for API failures and invalid responses
- **Scalability**: For production, consider using a vector database (Pinecone, Weaviate, etc.)

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.
