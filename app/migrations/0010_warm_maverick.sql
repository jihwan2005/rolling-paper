CREATE TABLE "rolling_paper_image" (
	"image_node_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rolling_paper_image_image_node_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"left" double precision NOT NULL,
	"top" double precision NOT NULL,
	"scaleX" double precision NOT NULL,
	"scaleY" double precision NOT NULL,
	"angle" double precision NOT NULL,
	"width" double precision NOT NULL,
	"height" double precision NOT NULL,
	"image_url" text NOT NULL
);
