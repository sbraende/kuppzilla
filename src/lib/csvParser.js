import Papa from 'papaparse';

/**
 * Removes single quotes from field names and values
 */
function cleanValue(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^'|'$/g, '');
}

/**
 * Parses price string like "68 NOK" or "2499.9 NOK" to a number
 * Returns null if price is empty or invalid
 */
function parsePrice(priceString) {
  if (!priceString || priceString === "''") return null;

  const cleaned = cleanValue(priceString)
    .replace(/NOK/gi, '')
    .replace(/\s+/g, '')
    .trim();

  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
}

/**
 * Calculates discount percentage
 */
function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Maps raw CSV row to clean product object
 */
function mapRowToProduct(row) {
  const price = parsePrice(row["'price'"]);
  const salePrice = parsePrice(row["'sale_price'"]);
  const discount = calculateDiscount(price, salePrice);

  return {
    id: cleanValue(row["'id'"]),
    title: cleanValue(row["'title'"]),
    description: cleanValue(row["'description'"]),
    brand: cleanValue(row["'brand'"]),
    image: cleanValue(row["'image_link'"]),
    link: cleanValue(row["'link'"]),
    price,
    salePrice,
    discount,
    availability: cleanValue(row["'availability'"]),
    productType: cleanValue(row["'product_type'"]),
    // Additional fields that might be useful
    mpn: cleanValue(row["'mpn'"]),
    gtin: cleanValue(row["'gtin'"]),
  };
}

/**
 * Parses CSV file and returns array of product objects
 * @param {File|string} csvData - CSV file object or CSV string
 * @returns {Promise<Array>} Promise that resolves to array of products
 */
export function parseProductsCSV(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      delimiter: '\t',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header, // Keep original headers with quotes
      complete: (results) => {
        try {
          const products = results.data
            .map(mapRowToProduct)
            .filter(product => product.id && product.title); // Filter out invalid rows

          resolve(products);
        } catch (error) {
          reject(new Error(`Failed to map CSV data: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

/**
 * Fetches and parses CSV file from URL
 * @param {string} url - URL to CSV file
 * @returns {Promise<Array>} Promise that resolves to array of products
 */
export async function fetchAndParseCSV(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    return parseProductsCSV(csvText);
  } catch (error) {
    throw new Error(`Failed to load products: ${error.message}`);
  }
}
