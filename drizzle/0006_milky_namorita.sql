CREATE UNIQUE INDEX "categories_path_idx" ON "categories" USING btree ("path");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_path_unique" UNIQUE("path");