-- Script 3: Migrate cleaned webshop data to products and store_products tables
-- Usage: Replace {source_table} and {store_name} with your values
-- Example: {source_table} = 'elkjop', {store_name} = 'elkjop'

-- Prerequisites:
-- 1. Source table must have cleaned data (quotes removed, prices as numeric)
-- 2. Source table should have standard Google Shopping Feed columns
-- 3. Products are deduplicated by GTIN (if available) or title+brand combination

DO $$
DECLARE
    source_table TEXT := '{source_table}'; -- Replace with your source table name
    store_name TEXT := '{store_name}';     -- Replace with store name (lowercase, underscores for spaces)
    products_inserted INT := 0;
    store_products_inserted INT := 0;
    products_updated INT := 0;
BEGIN
    RAISE NOTICE 'Starting migration from % to products and store_products...', source_table;

    -- Step 1: Insert/Update products in the master products table
    -- Products are deduplicated by GTIN (or title+brand if no GTIN)
    EXECUTE format('
        INSERT INTO products (
            gtin,
            mpn,
            title,
            description,
            brand,
            product_type,
            google_product_category,
            item_group_id,
            gender,
            age_group,
            color,
            material,
            pattern,
            size,
            energy_efficiency_class,
            image_link,
            created_at,
            updated_at
        )
        SELECT DISTINCT ON (COALESCE(gtin, title || brand))
            gtin,
            mpn,
            title,
            description,
            brand,
            product_type,
            google_product_category,
            item_group_id,
            gender,
            age_group,
            color,
            material,
            pattern,
            size,
            energy_efficiency_class,
            image_link,
            NOW(),
            NOW()
        FROM %I
        WHERE title IS NOT NULL
        ON CONFLICT (gtin)
        WHERE gtin IS NOT NULL
        DO UPDATE SET
            mpn = COALESCE(EXCLUDED.mpn, products.mpn),
            title = COALESCE(EXCLUDED.title, products.title),
            description = COALESCE(EXCLUDED.description, products.description),
            brand = COALESCE(EXCLUDED.brand, products.brand),
            product_type = COALESCE(EXCLUDED.product_type, products.product_type),
            google_product_category = COALESCE(EXCLUDED.google_product_category, products.google_product_category),
            image_link = COALESCE(EXCLUDED.image_link, products.image_link),
            updated_at = NOW()
    ', source_table);

    GET DIAGNOSTICS products_inserted = ROW_COUNT;
    RAISE NOTICE 'Inserted/updated % products', products_inserted;

    -- Step 2: Insert store-specific product data into store_products
    -- Links to products table via GTIN or creates new product if needed
    EXECUTE format('
        INSERT INTO store_products (
            product_id,
            store_name,
            store_product_id,
            price,
            sale_price,
            availability,
            condition,
            link,
            shipping,
            is_bundle,
            multipack,
            unit_pricing_measure,
            unit_pricing_base_measure,
            custom_label_0,
            custom_label_1,
            custom_label_2,
            custom_label_3,
            custom_label_4,
            created_at,
            updated_at
        )
        SELECT
            p.id AS product_id,
            %L AS store_name,
            s.product_id AS store_product_id,
            s.price,
            s.sale_price,
            s.availability,
            s.condition,
            s.link,
            s.shipping,
            s.is_bundle,
            s.multipack,
            s.unit_pricing_measure,
            s.unit_pricing_base_measure,
            s.custom_label_0,
            s.custom_label_1,
            s.custom_label_2,
            s.custom_label_3,
            s.custom_label_4,
            NOW(),
            NOW()
        FROM %I s
        LEFT JOIN products p ON (
            (s.gtin IS NOT NULL AND p.gtin = s.gtin)
            OR (s.gtin IS NULL AND p.title = s.title AND p.brand = s.brand)
        )
        WHERE p.id IS NOT NULL
        ON CONFLICT (store_product_id, store_name)
        DO UPDATE SET
            price = EXCLUDED.price,
            sale_price = EXCLUDED.sale_price,
            availability = EXCLUDED.availability,
            condition = EXCLUDED.condition,
            link = EXCLUDED.link,
            updated_at = NOW()
    ', store_name, source_table);

    GET DIAGNOSTICS store_products_inserted = ROW_COUNT;
    RAISE NOTICE 'Inserted/updated % store products for %', store_products_inserted, store_name;

    -- Step 3: Report statistics
    RAISE NOTICE '================================';
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Source table: %', source_table;
    RAISE NOTICE 'Store name: %', store_name;
    RAISE NOTICE 'Products inserted/updated: %', products_inserted;
    RAISE NOTICE 'Store products inserted/updated: %', store_products_inserted;
    RAISE NOTICE '================================';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during migration: %', SQLERRM;
        RAISE EXCEPTION 'Migration failed. Rolling back changes.';
END $$;

-- Verify the migration:
-- SELECT COUNT(*) FROM products;
-- SELECT COUNT(*) FROM store_products WHERE store_name = '{store_name}';

-- Check sample data:
-- SELECT p.title, p.brand, sp.store_name, sp.price, sp.sale_price
-- FROM products p
-- JOIN store_products sp ON sp.product_id = p.id
-- WHERE sp.store_name = '{store_name}'
-- LIMIT 10;
