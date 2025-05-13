CREATE TABLE "postImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" varchar(255) NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"version" integer NOT NULL,
	"version_id" varchar(255) NOT NULL,
	"signature" varchar(255) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"format" varchar(50) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"created_at" timestamp NOT NULL,
	"tags" text[],
	"bytes" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"etag" varchar(255) NOT NULL,
	"placeholder" boolean DEFAULT false NOT NULL,
	"url" text NOT NULL,
	"secure_url" text NOT NULL,
	"asset_folder" varchar(255),
	"display_name" varchar(255),
	"original_filename" text,
	"post_id" integer,
	"article_id" integer,
	CONSTRAINT "postImages_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "images_url" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "postImages" ADD CONSTRAINT "postImages_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postImages" ADD CONSTRAINT "postImages_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "images_public_id_idx" ON "postImages" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "images_post_id_idx" ON "postImages" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "images_article_id_idx" ON "postImages" USING btree ("article_id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;