CREATE TABLE "rolling_paper_audio" (
	"audio_node_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rolling_paper_audio_audio_node_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"rolling_paper_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"audio_url" text NOT NULL,
	"left" double precision NOT NULL,
	"top" double precision NOT NULL,
	"canvas_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolling_paper_audio" ADD CONSTRAINT "rolling_paper_audio_rolling_paper_id_rolling_paper_rolling_paper_id_fk" FOREIGN KEY ("rolling_paper_id") REFERENCES "public"."rolling_paper"("rolling_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolling_paper_audio" ADD CONSTRAINT "rolling_paper_audio_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;