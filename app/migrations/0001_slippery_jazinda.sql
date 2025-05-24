CREATE TABLE "rolling_paper" (
	"rolling_paper_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rolling_paper_rolling_paper_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"rolling_paper_title" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"join_code" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolling_paper" ADD CONSTRAINT "rolling_paper_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;