CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"level1_category" integer NOT NULL,
	"level2_category" integer NOT NULL,
	"level3_category" integer NOT NULL,
	"path" varchar(255),
	"thanh_pho" varchar(255) NOT NULL,
	"thanh_pho_code_name" varchar(255) NOT NULL,
	"quan" varchar(255) NOT NULL,
	"tieu-de" varchar NOT NULL,
	"quan_code_name" varchar(255) NOT NULL,
	"phuong" varchar(255) NOT NULL,
	"phuong_code_name" varchar(255) NOT NULL,
	"duong" varchar(255) NOT NULL,
	"gia_tien" numeric(15, 2) NOT NULL,
	"dien_tich_dat" numeric(10, 2) NOT NULL,
	"so_tang" integer NOT NULL,
	"so_phong_ngu" integer NOT NULL,
	"so_phong_ve_sinh" integer NOT NULL,
	"giay_to_phap_ly" varchar(255) NOT NULL,
	"loai_hinh_nha_o" varchar(255) NOT NULL,
	"noi_dung" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "provider_idx" ON "account" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "token_idx" ON "verification_token" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "email_token_idx" ON "verification_token" USING btree ("email","token");