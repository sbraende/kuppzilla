import { useState, useEffect } from 'react';
import { fetchAndParseCSV } from '@/lib/csvParser';

/**
 * Custom hook to fetch and parse product CSV data
 * @param {string} csvPath - Path to CSV file (relative to public folder)
 * @returns {Object} { products: Array, loading: boolean, error: string|null }
 */
export function useProducts(csvPath = '/data/proshop-sample.csv') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const parsedProducts = await fetchAndParseCSV(csvPath);

        if (isMounted) {
          setProducts(parsedProducts);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          console.error('Failed to load products:', err);
        }
      }
    }

    loadProducts();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [csvPath]);

  return { products, loading, error };
}
