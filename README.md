# Chef Mind

Chef Mind is a modern web application designed to help users discover, manage, and explore recipes. Built with React, TypeScript, Vite, and Tailwind CSS, it offers a fast, responsive, and visually appealing user experience. The project is organized into a client-side frontend, a server-side backend, and shared utilities for API communication.

## Features

- **Recipe Discovery:** Browse a curated list of recipes with detailed information and images.
- **Recipe Details:** View ingredients, instructions, and nutritional info for each recipe.
- **Context Management:** Uses React Context for global state management of recipes.
- **Reusable UI Components:** Includes a rich set of custom UI components (accordion, dialog, toast, etc.) for consistent design.
- **Responsive Design:** Optimized for mobile and desktop devices.
- **API Integration:** Communicates with a backend server for dynamic recipe data.

## Project Structure

```
chef mind/
├── client/         # Frontend React app
│   ├── components/ # UI components (layout, recipes, ui)
│   ├── context/    # React Context for recipes
│   ├── hooks/      # Custom React hooks
│   ├── lib/        # Utility functions and recipe logic
│   ├── pages/      # App pages (Index, NotFound, RecipeDetail)
│   ├── App.tsx     # Main app entry
│   └── global.css  # Global styles
├── server/         # Backend API server (Node.js/Express)
│   ├── routes/     # API routes (recipes, demo)
│   └── index.ts    # Server entry point
├── shared/         # Shared code (API utilities)
├── public/         # Static assets
├── index.html      # Main HTML file
├── package.json    # Project dependencies
├── tailwind.config.ts # Tailwind CSS config
├── tsconfig.json   # TypeScript config
└── README.md       # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

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
3. **Start the development servers:**
   - Frontend:
     ```bash
     cd client
     pnpm dev
     ```
   - Backend:
     ```bash
     cd ../server
     pnpm dev
     ```

### Environment Variables
Create a `.env` file in the root directory for any required environment variables (API keys and AI model).

## Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **State Management:** React Context
- **Styling:** Tailwind CSS, PostCSS

## Key Files & Folders
- `client/components/ui/`: Custom UI components for forms, dialogs, navigation, etc.
- `client/context/RecipesContext.tsx`: Global state for recipes.
- `client/lib/recipes.ts`: Recipe logic and API calls.
- `server/routes/recipes.ts`: Backend API for recipes.
- `shared/api.ts`: Shared API utilities.

## Scripts
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm lint`: Run linter

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License
This project is licensed under the MIT License.
