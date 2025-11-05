import Masonry from "react-masonry-css";
import ProductCard from "@/components/products/ProductCard";
import DealCard from "@/components/deals/DealCard";

function ProductGrid({ items, onSaveProduct, savedProductIds }) {
  const breakpointColumns = {
    default: 4,
    1280: 4,
    1024: 3,
    768: 3,
    640: 2,
  };

  return (
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
  );
}

export default ProductGrid;
