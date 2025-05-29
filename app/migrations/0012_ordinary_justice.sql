CREATE TABLE "my_rolling_paper" (
	"rolling_paper_id" bigint NOT NULL,
	"recipient" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "my_rolling_paper" ADD CONSTRAINT "my_rolling_paper_rolling_paper_id_rolling_paper_rolling_paper_id_fk" FOREIGN KEY ("rolling_paper_id") REFERENCES "public"."rolling_paper"("rolling_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "my_rolling_paper" ADD CONSTRAINT "my_rolling_paper_recipient_profiles_profile_id_fk" FOREIGN KEY ("recipient") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;