import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductCard({ product, onSave, isSaved }) {
  const hasDiscount = product.discount > 0;
  const displayPrice = product.salePrice || product.price;

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(product);
  };

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-full object-cover"
            loading="lazy"
          />
        )}
        {!product.image && (
          <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
            Ingen bilde
          </div>
        )}

        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <div className="absolute left-2 top-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
            -{Math.round(product.discount)}%
          </div>
        )}

        {/* Save Button - Top Right */}
        <button
          onClick={handleSaveClick}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 shadow-lg transition-all",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/90 text-foreground hover:bg-background"
          )}
          aria-label={isSaved ? "Fjern fra favoritter" : "Legg til i favoritter"}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-1 font-semibold text-foreground line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        {displayPrice && (
          <div className="mt-3 flex items-baseline gap-2">
            {hasDiscount && product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString("nb-NO")} kr
              </span>
            )}
            <span
              className={cn(
                "font-bold",
                hasDiscount ? "text-destructive" : "text-primary"
              )}
            >
              {displayPrice.toLocaleString("nb-NO")} kr
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

export default ProductCard;
