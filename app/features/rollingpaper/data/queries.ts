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

export const getRollingPaperTextNode = async (
  client: SupabaseClient<Database>,
  { paperId }: { paperId: number }
) => {
  const { data, error } = await client
    .from("rolling_paper_text")
    .select("*,profiles(username)")
    .eq("rolling_paper_id", paperId);
  if (error) throw error;
  return data;
};

export const getRollingPaperImageNode = async (
  client: SupabaseClient<Database>,
  { paperId }: { paperId: number }
) => {
  const { data, error } = await client
    .from("rolling_paper_image")
    .select("*,profiles(username)")
    .eq("rolling_paper_id", paperId);
  if (error) throw error;
  return data;
};

export const getRollingPaperPathNode = async (
  client: SupabaseClient<Database>,
  { paperId }: { paperId: number }
) => {
  const { data, error } = await client
    .from("rolling_paper_path")
    .select("*,profiles(username)")
    .eq("rolling_paper_id", paperId);
  if (error) throw error;
  return data;
};

export const getRollingPaperAudioNode = async (
  client: SupabaseClient<Database>,
  { paperId }: { paperId: number }
) => {
  const { data, error } = await client
    .from("rolling_paper_audio")
    .select("*,profiles(username)")
    .eq("rolling_paper_id", paperId);
  if (error) throw error;
  return data;
};

export const getMyRollingPaper = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("my_rolling_paper")
    .select("*,rolling_paper(rolling_paper_title,join_code)")
    .eq("recipient", userId);
  if (error) throw error;
  return data;
};

export const countNotification = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { count, error } = await client
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("seen", false)
    .eq("target_id", userId);
  if (error) throw error;
  return count ?? 0;
};