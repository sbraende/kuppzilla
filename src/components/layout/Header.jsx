import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AIBadge } from "@/components/ui/ai-badge";
import FavoritesSheet from "@/components/layout/FavoritesSheet";

function Header({
  favoritesList = [],
  onRemoveFromFavorites,
  notificationIds = [],
  onToggleNotification,
  searchQuery = "",
  onSearchChange,
  onReset,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        {/* Top row: Title and Favorites */}
        <div className="flex items-center justify-between">
          {/* Left spacer for centering */}
          <div className="w-10"></div>

          {/* Centered title - clickable to reset */}
          <button
            onClick={onReset}
            className="text-2xl font-bold tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
          >
            KUPPZILLA ✨
          </button>

          {/* Right side with favorites sheet */}
          <FavoritesSheet
            favoritesList={favoritesList}
            onRemoveFromFavorites={onRemoveFromFavorites}
            notificationIds={notificationIds}
            onToggleNotification={onToggleNotification}
          />
        </div>

        {/* Search input below title */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="prøv: 'beste smartklokke til trening...'"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AIBadge />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
