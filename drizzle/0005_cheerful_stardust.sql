ALTER TABLE "postImages" DROP CONSTRAINT "postImages_article_id_articles_id_fk";
--> statement-breakpoint
DROP INDEX "images_public_id_idx";--> statement-breakpoint
DROP INDEX "images_post_id_idx";--> statement-breakpoint
DROP INDEX "images_article_id_idx";--> statement-breakpoint
ALTER TABLE "postImages" DROP COLUMN "article_id";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "images_url";