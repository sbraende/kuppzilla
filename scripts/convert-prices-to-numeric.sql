-- Script 2: Convert price and sale_price columns from text to numeric
-- Usage: Replace {table_name} with your actual table name (e.g., proshop, power, etc.)

-- Prerequisites:
-- 1. This script assumes price and sale_price are currently TEXT columns
-- 2. Values are formatted like "150 NOK", "1299.00 NOK", etc.
-- 3. Make sure to backup your data before running this script

DO $$
DECLARE
    table_name TEXT := '{table_name}'; -- Replace with your table name
BEGIN
    -- Step 1: Add temporary numeric columns
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS price_numeric NUMERIC', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS sale_price_numeric NUMERIC', table_name);

    RAISE NOTICE 'Added temporary numeric columns';

    -- Step 2: Convert price column - strip " NOK" suffix and convert to numeric
    EXECUTE format(
        'UPDATE %I SET price_numeric = NULLIF(TRIM(REPLACE(price, %L, %L)), %L)::NUMERIC WHERE price IS NOT NULL',
        table_name,
        ' NOK',
        '',
        ''
    );

    RAISE NOTICE 'Converted price values';

    -- Step 3: Convert sale_price column - strip " NOK" suffix and convert to numeric
    EXECUTE format(
        'UPDATE %I SET sale_price_numeric = NULLIF(TRIM(REPLACE(sale_price, %L, %L)), %L)::NUMERIC WHERE sale_price IS NOT NULL',
        table_name,
        ' NOK',
        '',
        ''
    );

    RAISE NOTICE 'Converted sale_price values';

    -- Step 4: Drop old text columns
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS price CASCADE', table_name);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS sale_price CASCADE', table_name);

    RAISE NOTICE 'Dropped old text columns';

    -- Step 5: Rename numeric columns to original names
    EXECUTE format('ALTER TABLE %I RENAME COLUMN price_numeric TO price', table_name);
    EXECUTE format('ALTER TABLE %I RENAME COLUMN sale_price_numeric TO sale_price', table_name);

    RAISE NOTICE 'Renamed numeric columns to original names';
    RAISE NOTICE 'Price conversion completed successfully for table: %', table_name;
END $$;

-- Verify the results:
-- SELECT price, sale_price FROM {table_name} LIMIT 10;

-- Check column types:
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
-- AND table_name = '{table_name}'
-- AND column_name IN ('price', 'sale_price');
