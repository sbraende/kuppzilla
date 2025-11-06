# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kuppzilla** - A React web application built with Vite, Tailwind CSS v4, and shadcn-inspired UI components.

## Development Commands

### Core Commands
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all JS/JSX files

### Notes
- No test framework is currently configured
- Development server runs on default Vite port (usually 5173)

## Technology Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7 with React plugin
- **Backend**: Supabase (PostgreSQL database with pgvector extension for semantic search)
- **Styling**: Tailwind CSS v4.1.16 with Vite plugin (@tailwindcss/vite)
- **UI Utilities**:
  - `clsx` + `tailwind-merge` for conditional className handling
  - `class-variance-authority` for component variants
  - `lucide-react` for icons
  - `tw-animate-css` for animations
  - `react-masonry-css` for responsive masonry grid layout
  - `@radix-ui/react-dialog` for accessible dialogs/sheets
- **Data Management**:
  - `@supabase/supabase-js` for database operations
  - `use-debounce` for search input debouncing
  - localStorage for favorites and notifications persistence
- **AI/ML**: OpenAI text-embedding-3-small model (384 dimensions) for semantic search via Supabase Edge Functions
- **Linting**: ESLint 9 with React Hooks and React Refresh plugins

## Architecture & Code Organization

### Path Aliases
- `@/` maps to `src/` directory (configured in vite.config.js:10)
- Always use `@/` imports for internal modules (e.g., `import { cn } from "@/lib/utils"`)

### Directory Structure
- `src/components/ui/` - Reusable UI components (shadcn-style)
- `src/components/products/` - Product display components (cards, grid, filters)
- `src/components/deals/` - Deal-specific components
- `src/components/layout/` - Layout components (Header, Footer, FavoritesSheet)
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/lib/` - Utility functions and Supabase client
- `src/main.jsx` - Application entry point with StrictMode
- `src/App.jsx` - Root application component
- `src/Global.css` - Global styles and Tailwind configuration
- `supabase/functions/` - Supabase Edge Functions (semantic-search, generate-embeddings)

### Styling Approach

**Tailwind CSS v4 Configuration:**
- Uses CSS-based configuration via `@theme inline` blocks in Global.css
- Tailwind v4 Vite plugin handles compilation (no separate PostCSS config needed)
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))` (Global.css:4)

**Design System:**
- Uses CSS custom properties (CSS variables) for theming
- OKLCH color space for better color interpolation
- Comprehensive design tokens in Global.css:
  - `--radius` variants (sm, md, lg, xl)
  - Semantic color tokens (background, foreground, card, primary, etc.)
  - Chart colors (chart-1 through chart-5)
  - Sidebar-specific tokens
- Dark mode styling with `.dark` class override

**Component Patterns:**
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Components use `data-slot` attributes for styling hooks (e.g., `data-slot="card"`)
- Component composition pattern: compound components (Card, CardHeader, CardTitle, etc.)

### UI Components

**Card Component** (src/components/ui/card.jsx):
- Compound component pattern with six subcomponents:
  - `Card` - Container with border, shadow, rounded corners
  - `CardHeader` - Grid layout with optional action slot
  - `CardTitle` - Semantic title with font-semibold
  - `CardDescription` - Muted text description
  - `CardAction` - Right-aligned action area
  - `CardContent` - Main content area
  - `CardFooter` - Bottom section with border-top support
- All components accept `className` prop for customization
- Use `data-slot` attributes for targeted styling

## Data Architecture

### Supabase Integration

**Database Setup:**
- PostgreSQL database with pgvector extension for vector similarity search
- Main views: `products_with_stores` - denormalized view joining products with store information
- RPC functions:
  - `get_best_offers(p_limit, p_offset, p_search_query)` - Fetches products with best deals
  - `match_products(query_embedding, match_threshold, match_count)` - Vector similarity search

**Edge Functions:**
- `semantic-search` - Generates embeddings via OpenAI API and performs vector search
  - Uses OpenAI `text-embedding-3-small` model with 384 dimensions
  - Returns products sorted by similarity score
  - Requires `OPENAI_API_KEY` environment variable

**Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_KEY` - Supabase anon/public key

### Custom Hooks Architecture

The application uses a hooks-based architecture for state and data management:

**Data Fetching:**
- `useOffers(searchQuery)` (src/hooks/useOffers.js) - Main data fetching hook
  - Implements pagination with 50 items per page
  - Automatic semantic search when query is present
  - Falls back to RPC function for regular queries
  - Debounce protection and duplicate fetch prevention
  - Returns: `{ products, loading, loadingMore, error, hasMore, loadMore }`

**State Management:**
- `useLocalStorage(key, initialValue)` - Generic localStorage sync hook with JSON serialization
- `useFavorites()` - Manages favorites list using localStorage
  - Returns: `{ favoritesList, savedProductIds, toggleFavorite }`
- `useNotifications()` - Manages price notification preferences using localStorage
  - Returns: `{ notificationIds, toggleNotification }`

**Search:**
- `useSemanticSearch()` - Direct access to semantic search (wrapped by useOffers)
  - Returns: `{ searchSemantic, loading, error }`

### Data Flow

1. User types in search input → debounced by `use-debounce` (300ms)
2. `useOffers` hook detects search change → resets pagination
3. If search query exists:
   - Calls Supabase Edge Function `/functions/v1/semantic-search`
   - Edge function generates embedding via OpenAI
   - Performs vector similarity search using `match_products` RPC
   - Returns products with similarity scores
4. If no search or semantic search fails:
   - Falls back to `get_best_offers` RPC function
   - Returns paginated products with deal information
5. Products mapped to unified format with deal metadata (savings, discount %)
6. Rendered in masonry grid via `react-masonry-css`

### Product Data Structure

Products returned from hooks have this unified structure:
```js
{
  id: string,                    // Unique: {product_id}_{store_name}
  productId: string,             // Base product ID
  title: string,
  description: string,
  brand: string,
  image: string,
  link: string,
  price: number,                 // Regular price
  salePrice: number,
  discount: number,              // Discount percentage
  merchant: string,              // Store name
  type: "product" | "deal",
  availability: string,
  // Deal-specific fields
  savings: number,               // NOK saved vs other stores
  savingsPercentage: number,
  minOtherStorePrice: number,
  isBestOffer: boolean
}
```

## ESLint Configuration

- Flat config format (eslint.config.js)
- Recommended rules from @eslint/js, react-hooks, and react-refresh
- Custom rule: Ignore unused vars matching pattern `^[A-Z_]` (constants/components)
- Ignores `dist/` directory
- Targets all `.js` and `.jsx` files

## Key Patterns & Best Practices

### Component Development
1. Place UI components in `src/components/ui/`
2. Use the `cn()` utility for className merging
3. Follow the pattern from card.jsx: accept `className` and spread `...props`
4. Add `data-slot` attributes for styling hooks
5. Export all component variants at the bottom

### Data Fetching Patterns
- Always use custom hooks for data fetching (see `useOffers` example)
- Implement duplicate fetch prevention with `useRef` flags
- Use `useCallback` for functions passed as dependencies
- Handle loading states separately for initial load vs pagination (`loading` vs `loadingMore`)
- Always provide error states and fallbacks

### State Management
- Use `useLocalStorage` hook for any state that should persist across sessions
- Keep favorites and notifications in localStorage, not Supabase
- Use `useDebounce` from `use-debounce` for search inputs (300ms recommended)

### Working with Supabase
- Supabase client initialized in `src/lib/supabase.js`
- Prefer RPC functions over direct table queries for complex logic
- Always handle both success and error cases from Supabase queries
- Use `.rpc()` for stored procedures, `.from().select()` for simple queries
- Edge Functions should be placed in `supabase/functions/` and deployed separately

### Semantic Search Integration
- Search automatically uses semantic search if query is present
- Semantic search does not support pagination (returns all matches at once)
- Falls back to regular search if semantic search fails
- Similarity threshold default: 0.5 (adjustable in edge function call)

### Adding Dependencies
- Prefer lightweight libraries that work well with Vite
- For UI components, follow shadcn/ui patterns (unstyled, composable)
- Update package.json and run `npm install`

### Styling Guidelines
- Extend theme tokens in Global.css `@theme inline` block when adding new colors
- Use semantic color tokens (e.g., `bg-card`, `text-primary`) rather than raw colors
- For dark mode, add corresponding token values in `.dark` selector
- Leverage Tailwind v4's native CSS features (no @apply abuse)
- Use `react-masonry-css` for grid layouts with varying item heights
