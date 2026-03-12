-- Create SCHEMA
CREATE SCHEMA IF NOT EXISTS "public";
ALTER SCHEMA "public" OWNER TO "pg_database_owner";
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Create FUNCTION
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

-- SET VARIABLES
SET default_tablespace = '';
SET default_table_access_method = "heap";


-- Create TABLES customer_feedbacks
CREATE TABLE IF NOT EXISTS "public"."customer_feedbacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" DEFAULT 'Anonymous'::"text" NOT NULL,
    "company_name" "text" DEFAULT 'Unknown Company'::"text" NOT NULL,
    "message" "text" DEFAULT 'No comment provided'::"text" NOT NULL,
    "rating" integer DEFAULT 5 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "text",
    CONSTRAINT "customer_feedbacks_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);
ALTER TABLE "public"."customer_feedbacks" OWNER TO "postgres";

-- Create TABLE project_categories
CREATE TABLE IF NOT EXISTS "public"."project_categories" (
    "name" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."project_categories" OWNER TO "postgres";

-- Create TABLE projects
CREATE TABLE IF NOT EXISTS "public"."projects" (
    "name" character varying(255) NOT NULL,
    "category" character varying(255) NOT NULL,
    "project_description" character varying(512) DEFAULT 'No description provided'::character varying,
    "skills_list" character varying(64)[] DEFAULT '{}'::character varying[] NOT NULL,
    "github_url" character varying(255),
    "website_url" character varying(255),
    "image_filename" character varying(255),
    "likes_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."projects" OWNER TO "postgres";

-- Create TABLE skill_categories
CREATE TABLE IF NOT EXISTS "public"."skill_categories" (
    "name" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."skill_categories" OWNER TO "postgres";

-- Create TABLEskills
CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "category" character varying(255),
    "mastery_level" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "skills_mastery_level_check" CHECK ((("mastery_level" >= 0) AND ("mastery_level" <= 100)))
);
ALTER TABLE "public"."skills" OWNER TO "postgres";

-- Create TABLE TRIGGERs
CREATE OR REPLACE TRIGGER "update_customer_feedbacks_updated_at" BEFORE UPDATE ON "public"."customer_feedbacks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE OR REPLACE TRIGGER "update_project_categories_updated_at" BEFORE UPDATE ON "public"."project_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE OR REPLACE TRIGGER "update_skill_categories_updated_at" BEFORE UPDATE ON "public"."skill_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE OR REPLACE TRIGGER "update_skills_updated_at" BEFORE UPDATE ON "public"."skills" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Create TABLE CONSTRAINTS
ALTER TABLE ONLY "public"."customer_feedbacks"
    ADD CONSTRAINT "customer_feedbacks_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."project_categories"
    ADD CONSTRAINT "project_categories_pkey" PRIMARY KEY ("name");
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("name");
ALTER TABLE ONLY "public"."skill_categories"
    ADD CONSTRAINT "skill_categories_pkey" PRIMARY KEY ("name");
ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."project_categories"("name") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."skill_categories"("name") ON DELETE CASCADE;


-- Create POLICIES
CREATE POLICY "Allow public insert of customer feedbacks" ON "public"."customer_feedbacks" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to project categories" ON "public"."project_categories" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to project categories" ON "public"."skill_categories" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON "public"."customer_feedbacks" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON "public"."projects" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to skills" ON "public"."skills" FOR SELECT USING (true);
CREATE POLICY "Allow public update of project likes" ON "public"."projects" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow to create a TEST project" ON "public"."projects" FOR INSERT WITH CHECK ((("name")::"text" = 'TEST_PROJECT'::"text"));
CREATE POLICY "Allow to delete a TEST project" ON "public"."projects" FOR DELETE USING ((("name")::"text" = 'TEST_PROJECT'::"text"));

-- Create ROW LEVEL SECURITY
ALTER TABLE "public"."customer_feedbacks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."project_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."skill_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";

-- GRANT USAGE ON SCHEMA "public" TO "anon";
-- GRANT USAGE ON SCHEMA "public" TO "authenticated";
-- GRANT USAGE ON SCHEMA "public" TO "service_role";

-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

-- GRANT ALL ON TABLE "public"."customer_feedbacks" TO "anon";
-- GRANT ALL ON TABLE "public"."customer_feedbacks" TO "authenticated";
-- GRANT ALL ON TABLE "public"."customer_feedbacks" TO "service_role";

-- GRANT ALL ON TABLE "public"."project_categories" TO "anon";
-- GRANT ALL ON TABLE "public"."project_categories" TO "authenticated";
-- GRANT ALL ON TABLE "public"."project_categories" TO "service_role";

-- GRANT ALL ON TABLE "public"."projects" TO "anon";
-- GRANT ALL ON TABLE "public"."projects" TO "authenticated";
-- GRANT ALL ON TABLE "public"."projects" TO "service_role";

-- GRANT ALL ON TABLE "public"."skill_categories" TO "anon";
-- GRANT ALL ON TABLE "public"."skill_categories" TO "authenticated";
-- GRANT ALL ON TABLE "public"."skill_categories" TO "service_role";

-- GRANT ALL ON TABLE "public"."skills" TO "anon";
-- GRANT ALL ON TABLE "public"."skills" TO "authenticated";
-- GRANT ALL ON TABLE "public"."skills" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";

-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";

-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
