import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FavoritesSheet from "@/components/layout/FavoritesSheet";

function Header({
  favoritesList = [],
  onRemoveFromFavorites,
  notificationIds = [],
  onToggleNotification,
  searchQuery = "",
  onSearchChange,
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
        <div className="mt-4 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Søk kupp eller produkter..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
