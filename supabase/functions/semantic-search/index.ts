import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper function to generate embeddings using OpenAI
async function generateEmbedding(text: string): Promise<number[]> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 384, // Match database vector(384)
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { query, threshold = 0.5, limit = 50 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Generate embedding using OpenAI
    console.log(`Generating embedding for query: "${query}"`);
    const embedding = await generateEmbedding(query);

    console.log(`Generated embedding with ${embedding.length} dimensions`);

    // Search for similar products using the RPC function
    const { data: products, error: searchError } = await supabase.rpc(
      "match_products",
      {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
      },
    );

    if (searchError) {
      console.error("Search error:", searchError);
      throw searchError;
    }

    console.log(`Found ${products?.length || 0} matching products`);

    // Get full product details with store information
    if (products && products.length > 0) {
      const productIds = products.map((p: any) => p.product_id);

      // Get products with store information from products_with_stores view
      const { data: fullProducts, error: detailsError } = await supabase
        .from("products_with_stores")
        .select("*")
        .in("product_id", productIds);

      if (detailsError) {
        console.error("Details error:", detailsError);
        throw detailsError;
      }

      // Merge similarity scores with product details
      const productsWithScores = fullProducts?.map((product) => {
        const match = products.find((p: any) =>
          p.product_id === product.product_id
        );

        // Calculate normalized discount score (0-1 range)
        const discountScore = Math.min((product.discount_percentage || 0) / 100, 1);

        // Combined score: 60% similarity + 40% discount
        const similarity = match?.similarity || 0;
        const combinedScore = (similarity * 0.6) + (discountScore * 0.4);

        return {
          ...product,
          similarity: similarity,
          discount_score: discountScore,
          combined_score: combinedScore,
        };
      });

      // Sort by combined score (highest first), then product_id (stable tiebreaker)
      productsWithScores?.sort((a, b) => {
        if (b.combined_score !== a.combined_score) {
          return b.combined_score - a.combined_score;
        }
        // Stable tiebreaker
        return a.product_id.localeCompare(b.product_id);
      });

      // Limit to 50 results for search mode
      const limitedResults = productsWithScores?.slice(0, 50);

      console.log(
        `Returning ${limitedResults?.length || 0} products with combined scoring (max 50)`,
      );

      return new Response(
        JSON.stringify({
          query,
          results: limitedResults || [],
          count: limitedResults?.length || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        query,
        results: [],
        count: 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
