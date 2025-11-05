import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define broad categories for Norwegian e-commerce
const CATEGORIES = {
  'Elektronikk': 'Electronics and technology products',
  'Hjem & interiør': 'Home and interior products',
  'Mote & klær': 'Fashion and clothing',
  'Sport & fritid': 'Sports and leisure',
  'Helse & skjønnhet': 'Health and beauty',
  'Kontorartikler': 'Office supplies',
  'Verktøy & hage': 'Tools and garden',
  'Kjøkken': 'Kitchen products',
  'Leker & hobby': 'Toys and hobbies',
  'Dyreprodukter': 'Pet products',
  'Andre': 'Other products'
};

/**
 * Removes single quotes from values
 */
function cleanValue(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^'|'$/g, '');
}

/**
 * Extract unique product types from CSV
 */
async function extractProductTypes(csvPath) {
  return new Promise((resolve, reject) => {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    Papa.parse(csvContent, {
      delimiter: '\t',
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const productTypes = new Set();

          results.data.forEach(row => {
            const productType = cleanValue(row["'product_type'"]);
            if (productType && productType.trim()) {
              productTypes.add(productType.trim());
            }
          });

          resolve(Array.from(productTypes).sort());
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * AI-powered categorization prompt
 * This generates the prompt to use with Claude API or manually
 */
function generateCategorizationPrompt(productTypes) {
  return `I need to categorize Norwegian product types into broader categories for e-commerce filtering.

Available categories:
${Object.entries(CATEGORIES).map(([key, desc]) => `- ${key}: ${desc}`).join('\n')}

Rules:
1. Each product type can belong to multiple categories (output as array)
2. Use the most specific applicable categories
3. Use "Andre" only if no other category fits
4. Output as JSON object mapping: product type → category array

Product types to categorize (${productTypes.length} total):
${productTypes.map((type, i) => `${i + 1}. "${type}"`).join('\n')}

Please provide the output as a JSON object like:
{
  "Printertilbehoer blekktoner": ["Elektronikk", "Kontorartikler"],
  "Spill Tilbehoer": ["Elektronikk", "Leker & hobby"],
  ...
}`;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Extracting product types from CSV...\n');

    const csvPath = path.join(__dirname, '..', 'public', 'data', 'proshop-sample.csv');
    const productTypes = await extractProductTypes(csvPath);

    console.log(`✅ Found ${productTypes.length} unique product types\n`);

    // Save unique product types for reference
    const productTypesPath = path.join(__dirname, 'product-types.json');
    fs.writeFileSync(
      productTypesPath,
      JSON.stringify(productTypes, null, 2),
      'utf-8'
    );
    console.log(`📄 Saved product types to: ${productTypesPath}\n`);

    // Generate the prompt
    const prompt = generateCategorizationPrompt(productTypes);
    const promptPath = path.join(__dirname, 'categorization-prompt.txt');
    fs.writeFileSync(promptPath, prompt, 'utf-8');
    console.log(`📝 Generated categorization prompt: ${promptPath}\n`);

    console.log('=' .repeat(80));
    console.log('NEXT STEPS:');
    console.log('=' .repeat(80));
    console.log('1. Review the categorization prompt in: scripts/categorization-prompt.txt');
    console.log('2. Use Claude (or Claude API) to generate the category mapping');
    console.log('3. Save the JSON response as: src/data/categoryMapping.json');
    console.log('4. Run the app - csvParser will automatically use the mapping');
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
