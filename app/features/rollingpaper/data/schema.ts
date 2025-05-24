import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

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
