import { useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

/**
 * Hook for semantic (AI-powered) search
 * Uses vector embeddings to understand natural language queries
 * Example: "headphones good for running" → finds sports/wireless earbuds
 */
export function useSemanticSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchSemantic = async (query, options = {}) => {
    const { threshold = 0.5, limit = 50 } = options;

    if (!query || query.trim().length === 0) {
      return { results: [], count: 0 };
    }

    setLoading(true);
    setError(null);

    try {
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
            threshold,
            limit
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      console.log(`Found ${data.count} semantic matches`);

      return {
        results: data.results || [],
        count: data.count || 0,
        query: data.query
      };

    } catch (err) {
      console.error('Semantic search error:', err);
      setError(err.message);
      return { results: [], count: 0, error: err.message };

    } finally {
      setLoading(false);
    }
  };

  return {
    searchSemantic,
    loading,
    error
  };
}
