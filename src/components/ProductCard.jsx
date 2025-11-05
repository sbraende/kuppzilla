import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductCard({ product, onSave, isSaved }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-xl">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full object-cover"
          loading="lazy"
        />

        {/* Save Button - Top Right */}
        <button
          onClick={() => onSave(product)}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 shadow-lg transition-all",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/90 text-foreground hover:bg-background"
          )}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-5 w-5", isSaved && "fill-current")}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        )}
        {product.price && (
          <p className="mt-2 font-bold text-primary">
            {product.price}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
