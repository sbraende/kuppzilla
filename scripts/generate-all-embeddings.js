/**
 * Script to batch process all products and generate embeddings via Edge Function
 * This calls the generate-embeddings edge function which uses OpenAI
 *
 * Usage: node scripts/generate-all-embeddings.js
 */

const SUPABASE_URL = "https://fwmrnajxuulbqegegzah.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bXJuYWp4dXVsYnFlZ2VnemFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNzkzNTcsImV4cCI6MjA3Nzk1NTM1N30.fj59G3sP1FeIHUl5_8ifIntcWndaAoOU5ENFVB64q2w";

const BATCH_SIZE = 10; // Process 10 products at a time
const DELAY_MS = 2000; // Wait 2 seconds between batches

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Error: Missing Supabase credentials");
  process.exit(1);
}

async function processBatch() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/generate-embeddings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          batchSize: BATCH_SIZE,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Failed to process batch: ${error.message}`);
  }
}

async function main() {
  console.log("🚀 Starting embedding generation process...");
  console.log(`Batch size: ${BATCH_SIZE} products`);
  console.log(`Delay between batches: ${DELAY_MS}ms`);
  console.log("Using OpenAI text-embedding-3-small via Edge Function");
  console.log("");

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
