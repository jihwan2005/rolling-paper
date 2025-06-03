CREATE TABLE "rolling_paper_path" (
	"path_node_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rolling_paper_path_path_node_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"path" text NOT NULL,
	"stroke" text NOT NULL,
	"stroke_width" double precision NOT NULL,
	"left" double precision NOT NULL,
	"top" double precision NOT NULL,
	"scaleX" double precision NOT NULL,
	"scaleY" double precision NOT NULL,
	"angle" double precision NOT NULL,
	"rolling_paper_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"canvas_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolling_paper_path" ADD CONSTRAINT "rolling_paper_path_rolling_paper_id_rolling_paper_rolling_paper_id_fk" FOREIGN KEY ("rolling_paper_id") REFERENCES "public"."rolling_paper"("rolling_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolling_paper_path" ADD CONSTRAINT "rolling_paper_path_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;