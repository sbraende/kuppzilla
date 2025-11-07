import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useOffers } from "@/hooks/useOffers";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { favoritesList, savedProductIds, toggleFavorite } = useFavorites();
  const { notificationIds, toggleNotification } = useNotifications();

  const { products, loading, error, hasMore, loadMore, loadingMore } =
    useOffers(debouncedSearchQuery);

  const handleReset = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Header
        favoritesList={favoritesList}
        onRemoveFromFavorites={toggleFavorite}
        notificationIds={notificationIds}
        onToggleNotification={toggleNotification}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
      />
      <main className="container mx-auto px-4 py-8">
        {!debouncedSearchQuery && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Dagens beste tilbud
            </h2>
          </div>
        )}

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

        {!loading && !error && products.length > 0 && (
          <ProductGrid
            items={products}
            onSaveProduct={toggleFavorite}
            savedProductIds={savedProductIds}
            onLoadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
            isSearchMode={debouncedSearchQuery.length > 0}
          />
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">
              Ingen produkter eller kupp funnet
            </p>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
