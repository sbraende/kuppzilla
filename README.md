# Kuppzilla

A React web application for browsing and saving deals and product offers.

## Features

- Browse products and deals with real-time search
- Filter by categories (Best deals, Most popular, etc.)
- Save favorites with localStorage persistence
- Price notification system for saved products
- Responsive masonry grid layout

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **shadcn-inspired** UI components
- **Lucide React** for icons
- **PapaParse** for CSV data handling

## Getting Started

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
src/
├── components/
│   ├── deals/          # Deal card components
│   ├── layout/         # Header, Footer, FavoritesSheet
│   ├── products/       # Product cards, grid, filters
│   └── ui/             # Reusable UI components
├── data/               # Static data files
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Key Features

### Favorites System
- Add/remove products and deals to favorites
- Persisted across sessions using localStorage
- Filter favorites by type (All, Deals, Products)

### Search & Filters
- Real-time search across products and deals
- Category-based filtering
- Debounced search input for performance

### Notifications
- Toggle price notifications on saved products
- Notification state persisted to localStorage
