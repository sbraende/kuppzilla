


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."kjell_company" (
    "product_id" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "product_type" "text",
    "google_product_category" "text",
    "link" "text",
    "image_link" "text",
    "condition" "text",
    "availability" "text",
    "price" "text",
    "sale_price" "text",
    "gtin" "text",
    "brand" "text",
    "mpn" "text",
    "item_group_id" "text",
    "gender" "text",
    "age_group" "text",
    "color" "text",
    "material" "text",
    "pattern" "text",
    "size" "text",
    "energy_efficiency_class" "text",
    "shipping" "text",
    "is_bundle" "text",
    "multipack" "text",
    "custom_label_0" "text",
    "custom_label_1" "text",
    "custom_label_2" "text",
    "custom_label_3" "text",
    "custom_label_4" "text",
    "unit_pricing_measure" "text",
    "unit_pricing_base_measure" "text",
    "store_name" "text" DEFAULT 'kjell_company'::"text"
);


ALTER TABLE "public"."kjell_company" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."komplett" (
    "product_id" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "product_type" "text",
    "google_product_category" "text",
    "link" "text",
    "image_link" "text",
    "condition" "text",
    "availability" "text",
    "price" "text",
    "sale_price" "text",
    "gtin" "text",
    "brand" "text",
    "mpn" "text",
    "item_group_id" "text",
    "gender" "text",
    "age_group" "text",
    "color" "text",
    "material" "text",
    "pattern" "text",
    "size" "text",
    "energy_efficiency_class" "text",
    "shipping" "text",
    "is_bundle" "text",
    "multipack" "text",
    "custom_label_0" "text",
    "custom_label_1" "text",
    "custom_label_2" "text",
    "custom_label_3" "text",
    "custom_label_4" "text",
    "unit_pricing_measure" "text",
    "unit_pricing_base_measure" "text",
    "store_name" "text" DEFAULT 'komplett'::"text"
);


ALTER TABLE "public"."komplett" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."power" (
    "product_id" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "product_type" "text",
    "google_product_category" "text",
    "link" "text",
    "image_link" "text",
    "condition" "text",
    "availability" "text",
    "price" "text",
    "sale_price" "text",
    "gtin" "text",
    "brand" "text",
    "mpn" "text",
    "item_group_id" "text",
    "gender" "text",
    "age_group" "text",
    "color" "text",
    "material" "text",
    "pattern" "text",
    "size" "text",
    "energy_efficiency_class" "text",
    "shipping" "text",
    "is_bundle" "text",
    "multipack" "text",
    "custom_label_0" "text",
    "custom_label_1" "text",
    "custom_label_2" "text",
    "custom_label_3" "text",
    "custom_label_4" "text",
    "unit_pricing_measure" "text",
    "unit_pricing_base_measure" "text",
    "store_name" "text" DEFAULT 'power'::"text"
);


ALTER TABLE "public"."power" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."proshop" (
    "product_id" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "product_type" "text",
    "google_product_category" "text",
    "link" "text",
    "image_link" "text",
    "condition" "text",
    "availability" "text",
    "price" "text",
    "sale_price" "text",
    "gtin" "text",
    "brand" "text",
    "mpn" "text",
    "item_group_id" "text",
    "gender" "text",
    "age_group" "text",
    "color" "text",
    "material" "text",
    "pattern" "text",
    "size" "text",
    "energy_efficiency_class" "text",
    "shipping" "text",
    "is_bundle" "text",
    "multipack" "text",
    "custom_label_0" "text",
    "custom_label_1" "text",
    "custom_label_2" "text",
    "custom_label_3" "text",
    "custom_label_4" "text",
    "unit_pricing_measure" "text",
    "unit_pricing_base_measure" "text",
    "store_name" "text" DEFAULT 'proshop'::"text"
);


ALTER TABLE "public"."proshop" OWNER TO "postgres";


ALTER TABLE ONLY "public"."kjell_company"
    ADD CONSTRAINT "kjell_company_pkey" PRIMARY KEY ("product_id");



ALTER TABLE ONLY "public"."komplett"
    ADD CONSTRAINT "komplett_pkey" PRIMARY KEY ("product_id");



ALTER TABLE ONLY "public"."power"
    ADD CONSTRAINT "power_pkey" PRIMARY KEY ("product_id");



ALTER TABLE ONLY "public"."proshop"
    ADD CONSTRAINT "proshop_pkey" PRIMARY KEY ("product_id");



ALTER TABLE ONLY "public"."kjell_company"
    ADD CONSTRAINT "unique_product_kjell" UNIQUE ("store_name", "product_id");



ALTER TABLE ONLY "public"."komplett"
    ADD CONSTRAINT "unique_product_komplett" UNIQUE ("store_name", "product_id");



ALTER TABLE ONLY "public"."power"
    ADD CONSTRAINT "unique_product_power" UNIQUE ("store_name", "product_id");



ALTER TABLE ONLY "public"."proshop"
    ADD CONSTRAINT "unique_product_proshop" UNIQUE ("store_name", "product_id");



ALTER TABLE "public"."kjell_company" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."komplett" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."power" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proshop" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."kjell_company" TO "anon";
GRANT ALL ON TABLE "public"."kjell_company" TO "authenticated";
GRANT ALL ON TABLE "public"."kjell_company" TO "service_role";



GRANT ALL ON TABLE "public"."komplett" TO "anon";
GRANT ALL ON TABLE "public"."komplett" TO "authenticated";
GRANT ALL ON TABLE "public"."komplett" TO "service_role";



GRANT ALL ON TABLE "public"."power" TO "anon";
GRANT ALL ON TABLE "public"."power" TO "authenticated";
GRANT ALL ON TABLE "public"."power" TO "service_role";



GRANT ALL ON TABLE "public"."proshop" TO "anon";
GRANT ALL ON TABLE "public"."proshop" TO "authenticated";
GRANT ALL ON TABLE "public"."proshop" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


