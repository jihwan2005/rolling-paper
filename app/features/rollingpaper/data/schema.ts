import {
  bigint,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "~/features/users/schema";

export const rollingPaper = pgTable("rolling_paper", {
  rolling_paper_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  rolling_paper_title: text().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
  join_code: text().notNull().unique(),
});

export const rollingPaperVisitor = pgTable("rolling_paper_visitor", {
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  rolling_paper_id: bigint({ mode: "number" }).references(
    () => rollingPaper.rolling_paper_id,
    {
      onDelete: "cascade",
    }
  ),
  visited_at: timestamp().notNull().defaultNow(),
});

export const rollingPaperText = pgTable("rolling_paper_text", {
  text_node_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  text_content: text().notNull(),
  font_family: text().notNull(),
  font_size: integer().notNull(),
  fill: text().notNull(),
  left: doublePrecision().notNull(),
  top: doublePrecision().notNull(),
  scaleX: doublePrecision().notNull(),
  scaleY: doublePrecision().notNull(),
  angle: doublePrecision().notNull(),
  rolling_paper_id: bigint({ mode: "number" })
    .references(() => rollingPaper.rolling_paper_id, {
      onDelete: "cascade",
    })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  width: doublePrecision().notNull(),
});

export const rollingPaperImage = pgTable("rolling_paper_image", {
  image_node_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  left: doublePrecision().notNull(),
  top: doublePrecision().notNull(),
  scaleX: doublePrecision().notNull(),
  scaleY: doublePrecision().notNull(),
  angle: doublePrecision().notNull(),
  width: doublePrecision().notNull(),
  height: doublePrecision().notNull(),
  image_url: text().notNull(),
  rolling_paper_id: bigint({ mode: "number" })
    .references(() => rollingPaper.rolling_paper_id, {
      onDelete: "cascade",
    })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
});