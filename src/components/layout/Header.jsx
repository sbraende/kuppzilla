import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import FavoritesSheet from "@/components/layout/FavoritesSheet";

function Header({
  favoritesList = [],
  onRemoveFromFavorites,
  notificationIds = [],
  onToggleNotification,
  searchQuery = "",
  onSearchChange,
  useSemanticSearch = false,
  onSemanticSearchToggle,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        {/* Top row: Title and Favorites */}
        <div className="flex items-center justify-between">
          {/* Left spacer for centering */}
          <div className="w-10"></div>

          {/* Centered title */}
          <h1 className="text-2xl font-bold tracking-wider">KUPPZILLA ✨</h1>

          {/* Right side with favorites sheet */}
          <FavoritesSheet
            favoritesList={favoritesList}
            onRemoveFromFavorites={onRemoveFromFavorites}
            notificationIds={notificationIds}
            onToggleNotification={onToggleNotification}
          />
        </div>

        {/* Search input below title */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                useSemanticSearch
                  ? "Prøv: 'hodetelefoner for løping'..."
                  : "Søk kupp eller produkter..."
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Semantic search toggle */}
          <button
            onClick={onSemanticSearchToggle}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              useSemanticSearch
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Bruk AI-søk
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
