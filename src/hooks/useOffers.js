import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 50;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

export function useOffers(searchQuery = "") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const isFetchingRef = useRef(false);
  const hasFetchedInitialRef = useRef(false);
  const previousSearchRef = useRef("");

  // Perform semantic search via Edge Function
  const performSemanticSearch = async (query) => {
    console.log(`Performing semantic search for: "${query}"`);

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/semantic-search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          query,
          threshold: 0.5,
          limit: ITEMS_PER_PAGE
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Semantic search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.results || [];
  };

  // Fetch best offers from Supabase
  const fetchOffers = async (
    currentOffset = 0,
    append = false,
    search = ""
  ) => {
    // Prevent duplicate fetches
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }

    isFetchingRef.current = true;

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      console.log(
        `Fetching offers with offset: ${currentOffset}, append: ${append}, search: "${search}"`
      );

      // Always try semantic search first if there's a search query
      if (search && search.trim().length > 0) {
        // SEARCH MODE: Max 50 results, no pagination
        if (currentOffset > 0) {
          console.log("Search mode: pagination disabled, maximum 50 results shown");
          setHasMore(false);
          setLoading(false);
          setLoadingMore(false);
          isFetchingRef.current = false;
          return;
        }

        try {
          console.log("Search mode: attempting semantic search with combined scoring...");
          const semanticResults = await performSemanticSearch(search);
          const mappedProducts = mapOffersToProducts(semanticResults);

          setProducts(mappedProducts);
          setHasMore(false); // Search mode: no pagination, max 50 results
          setError(null);
          console.log(`Search mode: loaded ${mappedProducts.length} products (max 50)`);

          setLoading(false);
          setLoadingMore(false);
          isFetchingRef.current = false;
          return;
        } catch (semanticError) {
          console.warn("Semantic search failed, falling back to regular search:", semanticError);
          // Continue to regular search below
        }
      }

      // Query products on sale that beat prices at other stores
      const { data, error: queryError } = await supabase.rpc(
        "get_best_offers",
        {
          p_limit: ITEMS_PER_PAGE,
          p_offset: currentOffset,
          p_search_query: search || null,
        }
      );

      if (queryError) {
        // Fallback to direct view query if function doesn't exist
        console.warn("RPC function not found, using fallback query");
        const fallbackData = await fetchOffersWithFallback(currentOffset);

        if (fallbackData.error) throw fallbackData.error;

        const mappedProducts = mapOffersToProducts(fallbackData.data);

        if (append) {
          setProducts((prev) => [...prev, ...mappedProducts]);
        } else {
          setProducts(mappedProducts);
        }

        setHasMore(fallbackData.data.length === ITEMS_PER_PAGE);
        console.log(
          `Loaded ${mappedProducts.length} products, hasMore: ${
            fallbackData.data.length === ITEMS_PER_PAGE
          }`
        );
        return;
      }

      const mappedProducts = mapOffersToProducts(data);

      if (append) {
        setProducts((prev) => {
          console.log(
            `Appending ${mappedProducts.length} products to existing ${prev.length}`
          );
          return [...prev, ...mappedProducts];
        });
      } else {
        setProducts(mappedProducts);
      }

      const hasMoreData = data && data.length === ITEMS_PER_PAGE;
      setHasMore(hasMoreData);
      setError(null);
      console.log(
        `Loaded ${mappedProducts.length} products, hasMore: ${hasMoreData}`
      );
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  // Fallback query using direct view access
  async function fetchOffersWithFallback(currentOffset) {
    // Get products on sale
    const { data: onSaleData, error: onSaleError } = await supabase
      .from("products_with_stores")
      .select("*")
      .not("sale_price", "is", null)
      .gt("sale_price", 0)
      .eq("availability", "in_stock")
      .gt("discount_percentage", 10)
      .range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

    if (onSaleError) {
      return { data: null, error: onSaleError };
    }

    // For each product, check if there's a better deal compared to other stores
    const productsWithComparison = [];

    for (const product of onSaleData) {
      // Get other stores' prices for same product
      const { data: otherStores } = await supabase
        .from("products_with_stores")
        .select("store_name, effective_price")
        .eq("product_id", product.product_id)
        .neq("store_name", product.store_name)
        .gt("effective_price", 0);

      if (otherStores && otherStores.length > 0) {
        const minOtherPrice = Math.min(
          ...otherStores.map((s) => parseFloat(s.effective_price))
        );
        const savings = minOtherPrice - parseFloat(product.sale_price);

        if (savings > 50) {
          // Must save at least 50 NOK
          productsWithComparison.push({
            ...product,
            sale_store: product.store_name,
            sale_store_regular_price: product.price,
            min_other_store_price: minOtherPrice,
            savings: savings,
            savings_percentage: ((savings / minOtherPrice) * 100).toFixed(2),
          });
        }
      }
    }

    return { data: productsWithComparison, error: null };
  }

  // Map Supabase data to existing product structure
  function mapOffersToProducts(offers) {
    if (!offers) return [];

    return offers.map((offer) => ({
      id: `${offer.product_id}_${offer.sale_store || offer.store_name}`,
      productId: offer.product_id,
      title: offer.title || "",
      description: offer.description || "",
      brand: offer.brand || "",
      image: offer.image_link || "",
      link: offer.link || "",
      price: parseFloat(offer.sale_store_regular_price || offer.price || 0),
      salePrice: parseFloat(offer.sale_price || 0),
      discount: parseFloat(offer.discount_percentage || 0),
      merchant: offer.sale_store || offer.store_name || "",
      type: "product",
      availability: offer.availability || "",
      categories: [], // Can be populated if needed
      productType: "",
      gtin: offer.gtin || "", // Global Trade Item Number for enhanced AI context
      // Extra fields for "best offer" display
      savings: parseFloat(offer.savings || 0),
      savingsPercentage: parseFloat(offer.savings_percentage || 0),
      minOtherStorePrice: parseFloat(
        offer.min_other_store_price || offer.min_other_price || 0
      ),
      isBestOffer: offer.is_best_offer || false, // NEW: flag to show "Best Offer" badge
    }));
  }

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    console.log("loadMore called", { loadingMore, hasMore, offset });
    if (!loadingMore && hasMore) {
      const newOffset = offset + ITEMS_PER_PAGE;
      console.log(`Setting new offset: ${newOffset}`);
      setOffset(newOffset);
      fetchOffers(newOffset, true, searchQuery);
    }
  }, [offset, loadingMore, hasMore, searchQuery]);

  // Initial fetch
  useEffect(() => {
    if (!hasFetchedInitialRef.current) {
      console.log("Initial fetch triggered");
      hasFetchedInitialRef.current = true;
      fetchOffers(0, false, searchQuery);
    }
  }, []);

  // Handle search query changes
  useEffect(() => {
    // Skip if this is the initial mount (already handled by initial fetch)
    if (!hasFetchedInitialRef.current) {
      return;
    }

    // Check if search query actually changed
    const searchChanged = previousSearchRef.current !== searchQuery;

    if (searchChanged) {
      console.log(
        `Search changed from "${previousSearchRef.current}" to "${searchQuery}"`
      );
      previousSearchRef.current = searchQuery;

      // Reset pagination and fetch new results
      setOffset(0);
      fetchOffers(0, false, searchQuery);
    }
  }, [searchQuery]);

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
