import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const DATA_DIR = path.join(__dirname, '../public/data_processed');

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function reduceCsvFile(filePath) {
  const fileName = path.basename(filePath);
  const fileSize = getFileSizeInBytes(filePath);

  console.log(`\nProcessing: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

  if (fileSize <= MAX_SIZE_BYTES) {
    console.log(`  ✓ File is already under ${MAX_SIZE_MB}MB, skipping...`);
    return;
  }

  // Calculate reduction ratio
  const reductionRatio = fileSize / MAX_SIZE_BYTES;
  const keepEveryNth = Math.ceil(reductionRatio);

  console.log(`  → Need to reduce by ~${reductionRatio.toFixed(2)}x`);
  console.log(`  → Keeping every ${keepEveryNth}th row (plus header)`);

  // Read file line by line
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Keep header and every nth row
  const reducedLines = [lines[0]]; // Header
  for (let i = 1; i < lines.length; i++) {
    if (i % keepEveryNth === 0) {
      reducedLines.push(lines[i]);
    }
  }

  // Write back to file
  const reducedContent = reducedLines.join('\n');
  fs.writeFileSync(filePath, reducedContent, 'utf-8');

  const newSize = getFileSizeInBytes(filePath);
  console.log(`  ✓ Reduced from ${(fileSize / 1024 / 1024).toFixed(2)} MB to ${(newSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  ✓ Kept ${reducedLines.length - 1} out of ${lines.length - 1} data rows`);
}

// Main execution
console.log(`Reducing CSV files in: ${DATA_DIR}`);
console.log(`Target max size: ${MAX_SIZE_MB}MB\n`);

const files = fs.readdirSync(DATA_DIR)
  .filter(file => file.endsWith('.csv'))
  .map(file => path.join(DATA_DIR, file));

files.forEach(reduceCsvFile);

console.log('\n✓ All files processed!');
