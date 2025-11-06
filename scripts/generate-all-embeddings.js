/**
 * Script to batch process all products and generate embeddings locally
 * This generates embeddings using @xenova/transformers and updates Supabase
 *
 * Usage: node scripts/generate-all-embeddings.js
 */

import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";

const SUPABASE_URL = "https://fwmrnajxuulbqegegzah.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bXJuYWp4dXVsYnFlZ2VnemFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM3OTM1NywiZXhwIjoyMDc3OTU1MzU3fQ.jQs1q-HMtlOYAWrMtnJZsY6aphUabHo29Uw2JEVDI70"; // Replace with your actual service role key
const BATCH_SIZE = 10; // Process 10 products at a time
const DELAY_MS = 2000; // Wait 2 seconds between batches

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

let generateEmbedding;

async function initializeModel() {
  console.log("Loading embedding model...");
  generateEmbedding = await pipeline(
    "feature-extraction",
    "Supabase/gte-small"
  );
  console.log("Model loaded successfully.");
}

async function processBatch() {
  // Get products without embeddings
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("id, title, description, brand")
    .is("embedding", null)
    .limit(BATCH_SIZE);

  if (fetchError) {
    throw fetchError;
  }

  if (!products || products.length === 0) {
    return { processed: 0, remaining: 0 };
  }

  console.log(`Processing ${products.length} products...`);

  // Process each product
  const updates = [];
  for (const product of products) {
    // Combine title, description, and brand for better semantic understanding
    const text = [product.title, product.description, product.brand]
      .filter(Boolean)
      .join(" ");

    // Generate embedding
    const output = await generateEmbedding(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert to array format expected by pgvector
    const embedding = Array.from(output.data);

    updates.push({
      id: product.id,
      embedding: embedding,
      embedding_generated_at: new Date().toISOString(),
    });
  }

  // Batch update products with embeddings
  const { error: updateError } = await supabase
    .from("products")
    .upsert(updates);

  if (updateError) {
    throw updateError;
  }

  // Get total count of products still needing embeddings
  const { count: remainingCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .is("embedding", null);

  return {
    processed: products.length,
    remaining: remainingCount || 0,
    productIds: products.map((p) => p.id),
  };
}

async function main() {
  console.log("🚀 Starting embedding generation process...");
  console.log(`Batch size: ${BATCH_SIZE} products`);
  console.log(`Delay between batches: ${DELAY_MS}ms`);
  console.log("");

  await initializeModel();

  let totalProcessed = 0;
  let batchNumber = 0;

  while (true) {
    batchNumber++;

    try {
      console.log(`\n📦 Processing batch #${batchNumber}...`);

      const result = await processBatch();

      totalProcessed += result.processed;

      console.log(`✅ Batch ${batchNumber} completed:`);
      console.log(`   - Processed: ${result.processed} products`);
      console.log(`   - Remaining: ${result.remaining} products`);
      console.log(`   - Total processed so far: ${totalProcessed} products`);

      // Check if we're done
      if (result.processed === 0 || result.remaining === 0) {
        console.log("\n🎉 All products have been processed!");
        console.log(`Total processed: ${totalProcessed} products`);
        break;
      }

      // Wait before next batch to avoid rate limits
      console.log(`⏳ Waiting ${DELAY_MS}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      console.error(`\n❌ Error in batch ${batchNumber}:`, error.message);
      console.error("Stopping process. You can re-run the script to continue.");
      process.exit(1);
    }
  }

  console.log("\n✨ Embedding generation complete!");
  console.log("You can now use semantic search in your application.");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
