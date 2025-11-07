import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Custom hook for fetching all stores selling a product
 * @param {string} productId - The product ID to fetch stores for
 * @returns {Object} - { stores, loading, error }
 */
export function useProductStores(productId) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setStores([]);
      setLoading(false);
      return;
    }

    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from("products_with_stores")
          .select(
            "store_name, price, sale_price, effective_price, discount_percentage, availability, link, gtin"
          )
          .eq("product_id", productId)
          .gt("effective_price", 0) // Only include stores with valid prices
          .order("effective_price", { ascending: true }); // Cheapest first

        if (queryError) {
          throw queryError;
        }

        setStores(data || []);
      } catch (err) {
        setError(err.message);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [productId]);

  return {
    stores,
    loading,
    error,
  };
}
