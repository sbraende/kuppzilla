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
- **Styling**: Tailwind CSS v4.1.16 with Vite plugin (@tailwindcss/vite)
- **UI Utilities**:
  - `clsx` + `tailwind-merge` for conditional className handling
  - `class-variance-authority` for component variants
  - `lucide-react` for icons
  - `tw-animate-css` for animations
- **Linting**: ESLint 9 with React Hooks and React Refresh plugins

## Architecture & Code Organization

### Path Aliases
- `@/` maps to `src/` directory (configured in vite.config.js:10)
- Always use `@/` imports for internal modules (e.g., `import { cn } from "@/lib/utils"`)

### Directory Structure
- `src/components/ui/` - Reusable UI components (shadcn-style)
- `src/lib/` - Utility functions and helpers
- `src/main.jsx` - Application entry point with StrictMode
- `src/App.jsx` - Root application component
- `src/Global.css` - Global styles and Tailwind configuration
- `public/logo/` - Static logo assets

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

## ESLint Configuration

- Flat config format (eslint.config.js)
- Recommended rules from @eslint/js, react-hooks, and react-refresh
- Custom rule: Ignore unused vars matching pattern `^[A-Z_]` (constants/components)
- Ignores `dist/` directory
- Targets all `.js` and `.jsx` files

## Best Practices

### When Creating New Components
1. Place UI components in `src/components/ui/`
2. Use the `cn()` utility for className merging
3. Follow the pattern from card.jsx: accept `className` and spread `...props`
4. Add `data-slot` attributes for styling hooks
5. Export all component variants at the bottom

### When Adding Dependencies
- Prefer lightweight libraries that work well with Vite
- For UI components, follow shadcn/ui patterns (unstyled, composable)
- Update package.json and run `npm install`

### Styling Guidelines
- Extend theme tokens in Global.css `@theme inline` block when adding new colors
- Use semantic color tokens (e.g., `bg-card`, `text-primary`) rather than raw colors
- For dark mode, add corresponding token values in `.dark` selector
- Leverage Tailwind v4's native CSS features (no @apply abuse)
