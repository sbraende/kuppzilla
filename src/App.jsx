import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/components/products/FilterBar";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

function App() {
  const { products, loading, error } = useProducts();
  const [wishlist, setWishlist] = useState([]);
  const [activeFilter, setActiveFilter] = useState("best-deals");

  const handleSaveProduct = (product) => {
    setWishlist((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === product.id);
      if (isAlreadySaved) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const savedProductIds = wishlist.map((product) => product.id);

  // Sort products by discount (highest first)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.discount - a.discount);
  }, [products]);

  return (
    <>
      <Header wishlist={wishlist} onRemoveFromWishlist={handleSaveProduct} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="max-w-md text-center">
              <p className="text-lg font-semibold text-destructive">Failed to load products</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && sortedProducts.length > 0 && (
          <ProductGrid
            products={sortedProducts}
            onSaveProduct={handleSaveProduct}
            savedProductIds={savedProductIds}
          />
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
