import { ScrollText, Heart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Header({ wishlist = [], onRemoveFromWishlist }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left spacer for centering */}
        <div className="w-10"></div>

        {/* Centered title */}
        <h1 className="text-2xl font-bold tracking-wider">KUPPZILLA</h1>

        {/* Right side with sheet trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="relative rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Open wishlist"
            >
              <ScrollText className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {wishlist.length}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </div>
              </SheetTitle>
              <SheetDescription>
                {wishlist.length === 0
                  ? "Your wishlist is empty. Start adding products!"
                  : `You have ${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} saved.`}
              </SheetDescription>
            </SheetHeader>

            {/* Wishlist Items */}
            <div className="mt-6 space-y-4">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-20 w-20 rounded-md object-cover"
                  />

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {product.title}
                      </h3>
                      {product.price && (
                        <p className="mt-1 text-sm font-bold text-primary">
                          {product.price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="self-start rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Remove from wishlist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
