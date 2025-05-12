CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"level1_category_id" integer,
	"level2_category_id" integer,
	"level3_category_id" integer,
	"target_state" varchar(100),
	"target_city" varchar(100),
	"meta_description" varchar(300),
	"meta_keywords" text,
	"author_id" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_level1_category_id_categories_id_fk" FOREIGN KEY ("level1_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_level2_category_id_categories_id_fk" FOREIGN KEY ("level2_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_level3_category_id_categories_id_fk" FOREIGN KEY ("level3_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_category_status_idx" ON "articles" USING btree ("level1_category_id","level2_category_id","level3_category_id","status");--> statement-breakpoint
CREATE INDEX "articles_location_status_idx" ON "articles" USING btree ("target_state","target_city","status");--> statement-breakpoint
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");