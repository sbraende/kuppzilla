import { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import ProductCard from "@/components/products/ProductCard";
import DealCard from "@/components/deals/DealCard";

function ProductGrid({ items, onSaveProduct, savedProductIds, onLoadMore, hasMore, loadingMore }) {
  const observerTarget = useRef(null);

  const breakpointColumns = {
    default: 4,
    1280: 4,
    1024: 3,
    768: 3,
    640: 2,
  };

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4"
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

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="py-8">
        {loadingMore && (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Laster flere tilbud...
              </p>
            </div>
          </div>
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
