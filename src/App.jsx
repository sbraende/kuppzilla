import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/components/products/FilterBar";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import deals from "@/data/deals";

function App() {
  const { products, loading, error } = useProducts();
  const [wishlist, setWishlist] = useState([]);
  const [activeFilter, setActiveFilter] = useState("best-deals");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

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

  // Extract available categories from products
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set();
    products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((cat) => categoriesSet.add(cat));
      }
    });
    return Array.from(categoriesSet).sort();
  }, [products]);

  // Calculate relevancy score for a deal based on search query and active filter
  const calculateDealRelevancy = (
    deal,
    searchQuery,
    filterType,
    filterCategory
  ) => {
    let score = deal.featured ? 100 : 50; // Base score

    // If there's a search query, boost relevancy if deal matches
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (deal.title.toLowerCase().includes(query)) score += 50;
      if (deal.description.toLowerCase().includes(query)) score += 30;
      if (deal.merchant.toLowerCase().includes(query)) score += 20;
      if (deal.keywords.some((kw) => kw.toLowerCase().includes(query)))
        score += 40;
    }

    // If there's a category filter, boost relevancy if deal matches
    if (filterType === "category" && filterCategory) {
      if (deal.categories.includes(filterCategory)) {
        score += 80;
      } else {
        score = 0; // Don't show deals from other categories
      }
    }

    // Add discount value to score
    score += deal.discountValue || 0;

    return score;
  };

  // Filter, mix, and sort products with deals
  const filteredItems = useMemo(() => {
    let filteredProducts = [...products];
    let filteredDeals = [...deals];

    // Determine filter type
    const isCategory = activeFilter.startsWith("category-");
    const categoryName = isCategory
      ? activeFilter.replace("category-", "")
      : null;

    // Apply category filter to products
    if (isCategory && categoryName) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.categories && product.categories.includes(categoryName)
      );
    }

    // Apply category filter to deals
    if (isCategory && categoryName) {
      filteredDeals = filteredDeals.filter(
        (deal) => deal.categories && deal.categories.includes(categoryName)
      );
    }

    // Apply search query to products
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => {
        return (
          product.title?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      });

      // Apply search query to deals
      filteredDeals = filteredDeals.filter((deal) => {
        return (
          deal.title.toLowerCase().includes(query) ||
          deal.description.toLowerCase().includes(query) ||
          deal.merchant.toLowerCase().includes(query) ||
          deal.keywords.some((kw) => kw.toLowerCase().includes(query))
        );
      });
    }

    // Calculate relevancy scores for deals
    const dealsWithRelevancy = filteredDeals
      .map((deal) => ({
        ...deal,
        relevancyScore: calculateDealRelevancy(
          deal,
          debouncedSearchQuery,
          isCategory ? "category" : activeFilter,
          categoryName
        ),
      }))
      .filter((deal) => deal.relevancyScore > 0);

    // Add type to products for identification
    const productsWithType = filteredProducts.map((product) => ({
      ...product,
      type: "product",
    }));

    // Mix deals with products
    const mixed = [...productsWithType, ...dealsWithRelevancy];

    // Sort based on active filter
    if (activeFilter === "best-deals") {
      // Sort by discount/relevancy
      mixed.sort((a, b) => {
        if (a.type === "deal" && b.type === "deal") {
          return b.relevancyScore - a.relevancyScore;
        }
        if (a.type === "deal") return (b.discount || 0) - a.relevancyScore;
        if (b.type === "deal") return b.relevancyScore - (a.discount || 0);
        return (b.discount || 0) - (a.discount || 0);
      });
    } else if (activeFilter === "most-popular") {
      // Sort by some popularity metric (for now, just discount)
      mixed.sort(
        (a, b) =>
          (b.discount || b.relevancyScore || 0) -
          (a.discount || a.relevancyScore || 0)
      );
    } else if (isCategory) {
      // For category filters, mix deals and products by relevancy/discount
      mixed.sort((a, b) => {
        const aScore = a.type === "deal" ? a.relevancyScore : a.discount || 0;
        const bScore = b.type === "deal" ? b.relevancyScore : b.discount || 0;
        return bScore - aScore;
      });
    } else {
      // Default: sort by discount
      mixed.sort((a, b) => {
        const aScore = a.type === "deal" ? a.relevancyScore : a.discount || 0;
        const bScore = b.type === "deal" ? b.relevancyScore : b.discount || 0;
        return bScore - aScore;
      });
    }

    return mixed;
  }, [products, debouncedSearchQuery, activeFilter]);

  return (
    <>
      <Header
        wishlist={wishlist}
        onRemoveFromWishlist={handleSaveProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        availableCategories={availableCategories}
      />
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Laster produkter og kupp...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="max-w-md text-center">
              <p className="text-lg font-semibold text-destructive">
                Kunne ikke laste inn produkter og kupp
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <ProductGrid
            items={filteredItems}
            onSaveProduct={handleSaveProduct}
            savedProductIds={savedProductIds}
          />
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">
              Ingen produkter eller kupp funnet
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
