import { useState } from "react";
import { ScrollText, Heart, X, Search, Bell, BellOff } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Header({
  favoritesList = [],
  onRemoveFromFavorites,
  notificationIds = [],
  onToggleNotification,
  searchQuery = "",
  onSearchChange,
}) {
  const [favoritesFilter, setFavoritesFilter] = useState("all");

  // Filter favorites items based on selected filter
  const filteredFavorites = favoritesList.filter((item) => {
    if (favoritesFilter === "all") return true;
    if (favoritesFilter === "deals") return item.type === "deal";
    if (favoritesFilter === "products") return item.type !== "deal";
    return true;
  });
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        {/* Top row: Title and Wishlist */}
        <div className="flex items-center justify-between">
          {/* Left spacer for centering */}
          <div className="w-10"></div>

          {/* Centered title */}
          <h1 className="text-2xl font-bold tracking-wider">KUPPZILLA ✨</h1>

          {/* Right side with sheet trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="relative rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Åpne favoritter"
              >
                <ScrollText className="h-6 w-6" />
                {favoritesList.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {favoritesList.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader className="pb-3">
                <SheetTitle>
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6" />
                    <span className="text-xl">Favoritter</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Filter Tabs */}
              <div className="flex gap-2 border-b border-border px-4 pb-3">
                <button
                  onClick={() => setFavoritesFilter("all")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    favoritesFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Alle ({favoritesList.length})
                </button>
                <button
                  onClick={() => setFavoritesFilter("deals")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    favoritesFilter === "deals"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Kupp ({favoritesList.filter((item) => item.type === "deal").length}
                  )
                </button>
                <button
                  onClick={() => setFavoritesFilter("products")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    favoritesFilter === "products"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Produkter (
                  {favoritesList.filter((item) => item.type !== "deal").length})
                </button>
              </div>

              {/* Favorites Items - Scrollable */}
              <div className="mt-4 flex-1 overflow-y-auto px-4">
                <div className="space-y-3 pb-4">
                  {filteredFavorites.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Ingen{" "}
                      {favoritesFilter === "deals"
                        ? "kupp"
                        : favoritesFilter === "products"
                        ? "produkter"
                        : "favoritter"}{" "}
                      lagret
                    </p>
                  ) : (
                    filteredFavorites.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex gap-3 rounded-lg border p-3 transition-all hover:shadow-md",
                          item.type === "deal"
                            ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:border-yellow-500/40"
                            : "border-border bg-card hover:bg-accent/50"
                        )}
                      >
                        {/* Product/Deal Image - Clickable */}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-20 w-20 rounded-md object-cover"
                          />

                          {/* Discount Badge */}
                          {item.type === "deal" && item.discount && (
                            <div className="absolute left-1 top-1 rounded bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                              {item.discount}
                            </div>
                          )}
                          {item.type !== "deal" && item.discount > 0 && (
                            <div className="absolute left-1 top-1 rounded bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                              -{item.discount}%
                            </div>
                          )}
                        </a>

                        {/* Product/Deal Info - Clickable */}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 flex-col justify-between min-w-0"
                        >
                          <div>
                            <h3 className="font-semibold text-sm line-clamp-2">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            {item.type === "deal" ? (
                              <p className="mt-1 text-xs font-medium text-yellow-600">
                                {item.merchant}
                              </p>
                            ) : (
                              <div className="mt-1 flex items-baseline gap-1.5">
                                {item.discount > 0 && item.price && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {item.price.toLocaleString("nb-NO")} kr
                                  </span>
                                )}
                                {item.salePrice && (
                                  <span
                                    className={cn(
                                      "text-sm font-bold",
                                      item.discount > 0
                                        ? "text-destructive"
                                        : "text-primary"
                                    )}
                                  >
                                    {item.salePrice.toLocaleString("nb-NO")} kr
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </a>

                        {/* Action Buttons */}
                        <div className="flex gap-1 shrink-0 self-start">
                          {/* Notification Bell Button - Only for products */}
                          {item.type !== "deal" && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleNotification(item.id);
                              }}
                              className={cn(
                                "rounded-sm p-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                                notificationIds.includes(item.id)
                                  ? "text-primary opacity-100"
                                  : "opacity-70 hover:opacity-100"
                              )}
                              aria-label={
                                notificationIds.includes(item.id)
                                  ? "Skru av prisvarsling"
                                  : "Skru på prisvarsling"
                              }
                            >
                              {notificationIds.includes(item.id) ? (
                                <Bell className="h-4 w-4 fill-current" />
                              ) : (
                                <BellOff className="h-4 w-4" />
                              )}
                            </button>
                          )}

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveFromFavorites(item);
                            }}
                            className="rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label="Fjern fra favoritter"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
