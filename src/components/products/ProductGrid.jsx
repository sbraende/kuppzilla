import Masonry from "react-masonry-css";
import ProductCard from "@/components/products/ProductCard";
import DealCard from "@/components/deals/DealCard";

function ProductGrid({ items, onSaveProduct, savedProductIds, onLoadMore, hasMore, loadingMore }) {
  const breakpointColumns = {
    default: 4,
    1280: 4,
    1024: 3,
    768: 3,
    640: 2,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-2 sm:gap-4"
        columnClassName="bg-clip-padding"
      >
        {items.map((item) => (
          <div key={item.id} className="mb-4">
            {item.type === 'deal' ? (
              <DealCard
                deal={item}
                onSave={onSaveProduct}
                isSaved={savedProductIds.includes(item.id)}
              />
            ) : (
              <ProductCard
                product={item}
                onSave={onSaveProduct}
                isSaved={savedProductIds.includes(item.id)}
              />
            )}
          </div>
        ))}
      </Masonry>

      {/* Load More Button */}
      <div className="py-8 flex items-center justify-center">
        {loadingMore && (
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Laster flere tilbud...
            </p>
          </div>
        )}

        {!loadingMore && hasMore && (
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Last inn 50 flere tilbud
          </button>
        )}

        {!hasMore && items.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Ingen flere tilbud å vise
          </p>
        )}
      </div>
    </>
  );
}

export default ProductGrid;
