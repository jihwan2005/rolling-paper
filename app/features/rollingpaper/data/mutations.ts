import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const createRollingPaper = async (
  client: SupabaseClient<Database>,
  {
    title,
    userId,
    joinCode,
  }: {
    title: string;
    userId: string;
    joinCode: string;
  }
) => {
  const { data, error } = await client
    .from("rolling_paper")
    .insert({
      rolling_paper_title: title,
      profile_id: userId,
      join_code: joinCode,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const visitRollingPaper = async (
  client: SupabaseClient<Database>,
  { userId, paperId }: { userId: string; paperId: number }
) => {
  const { data, error } = await client
    .from("rolling_paper_visitor")
    .insert({
      profile_id: userId,
      rolling_paper_id: paperId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
