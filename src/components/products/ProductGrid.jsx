import Masonry from "react-masonry-css";
import ProductCard from "@/components/products/ProductCard";

function ProductGrid({ products, onSaveProduct, savedProductIds }) {
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
      {products.map((product) => (
        <div key={product.id} className="mb-4">
          <ProductCard
            product={product}
            onSave={onSaveProduct}
            isSaved={savedProductIds.includes(product.id)}
          />
        </div>
      ))}
    </Masonry>
  );
}

export default ProductGrid;
