import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { useOffers } from "@/hooks/useOffers";
import deals from "@/data/deals";

function App() {
  const [favoritesList, setFavoritesList] = useState(() => {
    const saved = localStorage.getItem("favoritesList");
    return saved ? JSON.parse(saved) : [];
  });
  const [notificationIds, setNotificationIds] = useState(() => {
    const saved = localStorage.getItem("notificationIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Pass debounced search query to useOffers for server-side filtering
  const { products, loading, error, hasMore, loadMore, loadingMore } = useOffers(debouncedSearchQuery);

  useEffect(() => {
    localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }, [favoritesList]);

  useEffect(() => {
    localStorage.setItem("notificationIds", JSON.stringify(notificationIds));
  }, [notificationIds]);

  // Cache Supabase offers in localStorage with 1 hour expiry
  useEffect(() => {
    if (products && products.length > 0) {
      const cacheData = {
        products,
        timestamp: Date.now(),
        expiresIn: 60 * 60 * 1000, // 1 hour
      };
      localStorage.setItem("cachedOffers", JSON.stringify(cacheData));
    }
  }, [products]);

  const handleSaveProduct = (product) => {
    setFavoritesList((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === product.id);
      if (isAlreadySaved) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleToggleNotification = (productId) => {
    setNotificationIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const savedProductIds = favoritesList.map((product) => product.id);

  // Calculate relevancy score for a deal based on search query
  const calculateDealRelevancy = (deal, searchQuery) => {
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

    // Add discount value to score
    score += deal.discountValue || 0;

    return score;
  };

  // Products are already filtered server-side via useOffers hook
  // No need for client-side filtering anymore
  const filteredItems = useMemo(() => {
    // Server-side search and sorting already applied
    // Just return products as-is
    return products;
  }, [products]);

  return (
    <>
      <Header
        favoritesList={favoritesList}
        onRemoveFromFavorites={handleSaveProduct}
        notificationIds={notificationIds}
        onToggleNotification={handleToggleNotification}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
            onLoadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
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
