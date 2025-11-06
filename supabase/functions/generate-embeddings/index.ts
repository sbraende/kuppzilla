import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Initialize the AI model session once (reused across requests)
const model = new Supabase.ai.Session('gte-small')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { batchSize = 10, text, singleQuery = false } = body

    // If this is a single query request (for semantic search)
    if (singleQuery && text) {
      console.log(`Generating embedding for single query: "${text}"`)
      const embedding = await model.run(text, {
        mean_pool: true,
        normalize: true,
      })

      return new Response(
        JSON.stringify({ embedding }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Batch mode - get products without embeddings
    console.log(`Fetching up to ${batchSize} products without embeddings...`)

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, description, brand')
      .is('embedding', null)
      .limit(batchSize)

    if (fetchError) {
      throw fetchError
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No products to process',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing ${products.length} products...`)

    // Process each product
    const updates = []
    for (const product of products) {
      // Combine title, description, and brand for better semantic understanding
      const productText = [
        product.title,
        product.description,
        product.brand
      ].filter(Boolean).join(' ')

      // Generate embedding using Supabase AI
      const embedding = await model.run(productText, {
        mean_pool: true,
        normalize: true,
      })

      updates.push({
        id: product.id,
        embedding: JSON.stringify(Array.from(embedding)),
        embedding_generated_at: new Date().toISOString()
      })
    }

    // Batch update products with embeddings
    const { error: updateError } = await supabase
      .from('products')
      .upsert(updates)

    if (updateError) {
      throw updateError
    }

    // Get total count of products still needing embeddings
    const { count: remainingCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .is('embedding', null)

    return new Response(
      JSON.stringify({
        message: 'Embeddings generated successfully',
        processed: products.length,
        remaining: remainingCount || 0,
        productIds: products.map(p => p.id)
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
