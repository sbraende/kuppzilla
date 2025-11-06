import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

/**
 * Hook for generating AI summaries of products
 * Uses OpenAI GPT-4o-mini via Supabase Edge Function
 * @param {Object} productData - Product data to summarize
 * @param {boolean} shouldFetch - Whether to fetch the summary (e.g., when dialog is open)
 */
export function useProductSummary(productData, shouldFetch = false) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productData || !shouldFetch) {
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching AI summary for: ${productData.title}`);

        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/product-summary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              productData: {
                title: productData.title,
                brand: productData.brand,
                description: productData.description,
                price: productData.price,
                salePrice: productData.salePrice,
                discount: productData.discount,
                merchant: productData.merchant,
                availability: productData.availability,
                gtin: productData.gtin,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to get summary: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        console.log(`Received summary: ${data.summary.substring(0, 100)}...`);
        setSummary(data.summary);
      } catch (err) {
        console.error("Product summary error:", err);
        setError(err.message);
        // Fallback to description if AI summary fails
        setSummary(productData.description || "");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [productData, shouldFetch]);

  return {
    summary,
    loading,
    error,
  };
}
