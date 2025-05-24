CREATE TABLE "rolling_paper_visitor" (
	"profile_id" uuid NOT NULL,
	"rolling_paper_id" bigint,
	"visited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolling_paper_visitor" ADD CONSTRAINT "rolling_paper_visitor_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolling_paper_visitor" ADD CONSTRAINT "rolling_paper_visitor_rolling_paper_id_rolling_paper_rolling_paper_id_fk" FOREIGN KEY ("rolling_paper_id") REFERENCES "public"."rolling_paper"("rolling_paper_id") ON DELETE cascade ON UPDATE no action;