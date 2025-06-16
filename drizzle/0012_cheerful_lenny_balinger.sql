ALTER TABLE "posts" ADD COLUMN "dien_tich_su_dung" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "huong" varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "chieu_ngang" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "chieu_dai" integer DEFAULT 0 NOT NULL;