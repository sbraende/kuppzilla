# Kuppzilla

A React web application for comparing product prices across multiple Norwegian electronics stores, featuring AI-powered semantic search.

## Features

- **AI-Powered Search** - Semantic search using OpenAI embeddings (text-embedding-3-small)
- **Price Comparison** - Compare prices across multiple stores (Proshop, Power, Kjell & Company, Komplett)
- **Best Deals** - Automatic detection of best offers with savings calculations
- **Favorites System** - Save products with localStorage persistence
- **Price Notifications** - Toggle notifications for price changes on saved products
- **Responsive Design** - Masonry grid layout that adapts to all screen sizes

## Tech Stack

### Frontend
- **React 19.1.1** with Vite 7.1.7
- **Tailwind CSS v4.1.16** with CSS-based configuration
- **shadcn-inspired** UI components with Radix UI primitives
- **Lucide React** for icons
- **react-masonry-css** for responsive grid layouts

### Backend
- **Supabase** - PostgreSQL database with real-time capabilities
- **pgvector** - Vector similarity search extension
- **Supabase Edge Functions** - Serverless functions for semantic search and embeddings
- **OpenAI API** - Text embeddings generation (384 dimensions)

### Data Management
- Custom React hooks for data fetching and state management
- localStorage for client-side persistence
- Debounced search with `use-debounce`

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project
- OpenAI API key (for semantic search)

### Environment Variables

Create a `.env` file:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── deals/          # Deal-specific components
│   │   ├── layout/         # Header, Footer, FavoritesSheet
│   │   ├── products/       # Product cards, grid, filters, dialogs
│   │   └── ui/             # Reusable UI components (Card, Dialog, Sheet, etc.)
│   ├── hooks/              # Custom React hooks (useOffers, useFavorites, etc.)
│   ├── lib/                # Utilities (Supabase client, cn helper)
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── Global.css          # Tailwind v4 config and design tokens
├── scripts/                # SQL utility scripts
│   ├── clean-csv-quotes.sql
│   ├── convert-prices-to-numeric.sql
│   └── migrate-webshop-to-normalized.sql
├── supabase/
│   └── functions/          # Edge Functions (semantic-search, generate-embeddings)
└── public/                 # Static assets
```

## Database Architecture

### Tables

**`products`** - Master product catalog
- Deduplicated products merged by GTIN
- Stores common attributes (title, brand, description, image)
- Contains `embedding` vector column (384 dimensions) for semantic search

**`store_products`** - Store-specific product data
- Links to `products` via `product_id` (foreign key)
- Stores pricing, availability, and store URLs
- Includes computed columns: `effective_price`, `discount_percentage`

**Store Tables** - Individual store data (proshop, power, kjell_company, komplett)
- Raw import tables with Google Shopping Feed format
- Used as source for migration to normalized structure

### Views

**`products_with_stores`** - Denormalized view joining products with store information

### RPC Functions

- `get_best_offers(p_limit, p_offset, p_search_query)` - Fetches products with best deals
- `match_products(query_embedding, match_threshold, match_count)` - Vector similarity search

## SQL Utility Scripts

Located in `scripts/` folder:

### 1. `clean-csv-quotes.sql`
Removes single quotes from imported CSV data:
- Cleans all text column values
- Provides instructions for renaming columns with quotes

**Usage:** Replace `{table_name}` with your table name

### 2. `convert-prices-to-numeric.sql`
Converts price columns from text to numeric:
- Strips " NOK" suffix from values (e.g., "150 NOK" → 150)
- Safely converts text to numeric type
- Handles null values

**Usage:** Replace `{table_name}` with your table name

### 3. `migrate-webshop-to-normalized.sql`
Migrates cleaned webshop data to normalized structure:
- Inserts/updates products in master `products` table
- Creates store-specific records in `store_products` table
- Handles deduplication by GTIN or title+brand
- Updates existing records on conflict

**Usage:** Replace `{source_table}` and `{store_name}` with your values

## Key Features

### Semantic Search
- Automatic semantic search when query is present
- Uses OpenAI text-embedding-3-small model (384 dimensions)
- Falls back to regular search if semantic search fails
- Implemented via Supabase Edge Function

### Price Comparison
- Compares prices across all stores for each product
- Calculates savings vs other stores
- Highlights best offers with discount percentages
- Shows which store has the lowest price

### Favorites System
- Add/remove products to favorites
- Persisted using localStorage
- View all favorites in slide-out sheet
- Filter favorites by type

### Notifications
- Toggle price notifications on saved products
- Notification preferences stored in localStorage
- Visual indicators on product cards

### Search & Filters
- Real-time search with 300ms debouncing
- Category-based filtering
- Responsive to URL parameters

## Data Flow

1. User types in search input → debounced by `use-debounce` (300ms)
2. `useOffers` hook detects search change → resets pagination
3. If search query exists:
   - Calls Supabase Edge Function `/functions/v1/semantic-search`
   - Edge function generates embedding via OpenAI
   - Performs vector similarity search using `match_products` RPC
4. If no search or fallback needed:
   - Uses `get_best_offers` RPC function
   - Returns paginated products with deal information
5. Products rendered in masonry grid via `react-masonry-css`

## Adding a New Webshop

1. Import CSV data to a new table (use Google Shopping Feed format)
2. Run `clean-csv-quotes.sql` to remove quotes
3. Run `convert-prices-to-numeric.sql` to convert price columns
4. Run `migrate-webshop-to-normalized.sql` to add to normalized tables
5. Verify data with the provided SQL queries

## Contributing

This is a case project for VG Lab. See `CLAUDE.md` for detailed development guidelines.
