import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { query, threshold = 0.5, limit = 50 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize embedding model
    console.log('Loading embedding model...')
    const generateEmbedding = await pipeline(
      'feature-extraction',
      'Supabase/gte-small'
    )

    // Generate embedding for search query
    console.log(`Generating embedding for query: "${query}"`)
    const output = await generateEmbedding(query, {
      pooling: 'mean',
      normalize: true
    })

    const queryEmbedding = Array.from(output.data)

    // Search for similar products using the RPC function
    const { data: products, error: searchError } = await supabase.rpc(
      'match_products',
      {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      }
    )

    if (searchError) {
      throw searchError
    }

    // Get full product details with store information
    if (products && products.length > 0) {
      const productIds = products.map(p => p.product_id)

      // Get products with store information from products_with_stores view
      const { data: fullProducts, error: detailsError } = await supabase
        .from('products_with_stores')
        .select('*')
        .in('product_id', productIds)
        .not('sale_price', 'is', null)
        .gt('sale_price', 0)
        .eq('availability', 'in_stock')

      if (detailsError) {
        throw detailsError
      }

      // Merge similarity scores with product details
      const productsWithScores = fullProducts?.map(product => {
        const match = products.find(p => p.product_id === product.product_id)
        return {
          ...product,
          similarity: match?.similarity || 0
        }
      })

      // Sort by similarity (highest first)
      productsWithScores?.sort((a, b) => b.similarity - a.similarity)

      return new Response(
        JSON.stringify({
          query,
          results: productsWithScores || [],
          count: productsWithScores?.length || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        query,
        results: [],
        count: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
