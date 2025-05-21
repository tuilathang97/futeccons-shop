ALTER TABLE "user" ADD COLUMN "number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_number_unique" UNIQUE("number");