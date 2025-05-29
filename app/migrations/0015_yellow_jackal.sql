ALTER TABLE "rolling_paper_image" ADD COLUMN "canvas_index" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rolling_paper_text" ADD COLUMN "canvas_index" integer DEFAULT 0 NOT NULL;