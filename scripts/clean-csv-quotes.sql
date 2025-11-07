-- Script 1: Clean single quotes from column names and cell values
-- Usage: Replace {table_name} with your actual table name (e.g., proshop, power, etc.)

-- Step 1: Remove single quotes from all text columns
-- This updates all text/varchar columns by replacing single quotes with empty strings
DO $$
DECLARE
    col_record RECORD;
    table_name TEXT := '{table_name}'; -- Replace with your table name
BEGIN
    FOR col_record IN
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = table_name
        AND data_type IN ('text', 'character varying')
    LOOP
        EXECUTE format(
            'UPDATE %I SET %I = REPLACE(%I, %L, %L) WHERE %I IS NOT NULL',
            table_name,
            col_record.column_name,
            col_record.column_name,
            '''',
            '',
            col_record.column_name
        );

        RAISE NOTICE 'Cleaned quotes from column: %', col_record.column_name;
    END LOOP;
END $$;

-- Step 2: Rename columns that have single quotes in their names
-- Note: This requires manual execution for each column
-- Example for a column named 'product''id' -> 'product_id':
-- ALTER TABLE {table_name} RENAME COLUMN "product''id" TO product_id;

-- To find columns with quotes in their names, run:
-- SELECT column_name
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
-- AND table_name = '{table_name}'
-- AND column_name LIKE '%''%';
