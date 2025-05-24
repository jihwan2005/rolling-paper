import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getRollingPaper = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("rolling_paper_view").select("*");
  if (error) throw error;
  return data;
};

export const getRollingPaperByUserId = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("rolling_paper_view")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getRollingPaperByJoinCode = async (
  client: SupabaseClient<Database>,
  { joinCode }: { joinCode: string }
) => {
  const { data, error } = await client
    .from("rolling_paper_view")
    .select("*")
    .eq("join_code", joinCode)
    .single();
  if (error) throw error;
  return data;
};

export const getVisitRollingPaper = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("rolling_paper_visitor")
    .select("visited_at, rolling_paper(rolling_paper_title, join_code)")
    .eq("profile_id", userId)
    .order("visited_at", { ascending: false });
  if (error) throw error;
  return data;
};
