import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize the AI model session once (reused across requests)
const model = new Supabase.ai.Session("gte-small");

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

    // Generate embedding using Supabase AI native API
    console.log(`Generating embedding for query: "${query}"`);
    const embedding = await model.run(query, {
      mean_pool: true,
      normalize: true,
    });

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
        .in("product_id", productIds)
        .not("sale_price", "is", null)
        .gt("sale_price", 0)
        .eq("availability", "in_stock");

      if (detailsError) {
        console.error("Details error:", detailsError);
        throw detailsError;
      }

      // Merge similarity scores with product details
      const productsWithScores = fullProducts?.map((product) => {
        const match = products.find((p: any) => p.product_id === product.product_id);
        return {
          ...product,
          similarity: match?.similarity || 0,
        };
      });

      // Sort by similarity (highest first)
      productsWithScores?.sort((a, b) => b.similarity - a.similarity);

      console.log(`Returning ${productsWithScores?.length || 0} products with details`);

      return new Response(
        JSON.stringify({
          query,
          results: productsWithScores || [],
          count: productsWithScores?.length || 0,
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
