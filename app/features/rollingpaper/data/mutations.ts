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

export const createTextNode = async (
  client: SupabaseClient<Database>,
  {
    rolling_paper_id,
    userId,
    textContent,
    fontFamily,
    fontSize,
    fill,
    left,
    top,
    scaleX,
    scaleY,
    angle,
    width,
  }: {
    rolling_paper_id: number;
    userId: string;
    textContent: string;
    fontFamily: string;
    fontSize: string;
    fill: string;
    left: string;
    top: string;
    scaleX: string;
    scaleY: string;
    angle: string;
    width: string;
  }
) => {
  const { data, error } = await client
    .from("rolling_paper_text")
    .insert({
      rolling_paper_id,
      profile_id: userId,
      text_content: textContent,
      font_family: fontFamily,
      font_size: Number(fontSize),
      fill,
      left: Number(left),
      top: Number(top),
      scaleX: Number(scaleX),
      scaleY: Number(scaleY),
      angle: Number(angle),
      width: Number(width),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTextNode = async (
  client: SupabaseClient<Database>,
  { nodeId }: { nodeId: number }
) => {
  const { error } = await client
    .from("rolling_paper_text")
    .delete()
    .eq("text_node_id", nodeId);
  if (error) throw error;
};

export const updateTextNode = async (
  client: SupabaseClient<Database>,
  {
    nodeId,
    textContent,
    fontFamily,
    fontSize,
    fill,
    left,
    top,
    scaleX,
    scaleY,
    angle,
    width,
  }: {
    nodeId: number;
    textContent: string;
    fontFamily: string;
    fontSize: string;
    fill: string;
    left: string;
    top: string;
    scaleX: string;
    scaleY: string;
    angle: string;
    width: string;
  }
) => {
  const { data, error } = await client
    .from("rolling_paper_text")
    .update({
      text_content: textContent,
      font_family: fontFamily,
      font_size: Number(fontSize),
      fill,
      left: Number(left),
      top: Number(top),
      scaleX: Number(scaleX),
      scaleY: Number(scaleY),
      angle: Number(angle),
      width: Number(width),
    })
    .eq("text_node_id", nodeId);
  if (error) throw error;
  return data;
};

export const createImageNode = async (
  client: SupabaseClient<Database>,
  {
    rolling_paper_id,
    userId,
    left,
    top,
    scaleX,
    scaleY,
    angle,
    width,
    height,
    imageUrl,
  }: {
    rolling_paper_id: number;
    userId: string;
    left: string;
    top: string;
    scaleX: string;
    scaleY: string;
    angle: string;
    width: string;
    height: string;
    imageUrl: string;
  }
) => {
  const { data, error } = await client
    .from("rolling_paper_image")
    .insert({
      rolling_paper_id,
      profile_id: userId,
      left: Number(left),
      top: Number(top),
      scaleX: Number(scaleX),
      scaleY: Number(scaleY),
      angle: Number(angle),
      width: Number(width),
      height: Number(height),
      image_url: imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteImageNode = async (
  client: SupabaseClient<Database>,
  { nodeId }: { nodeId: number }
) => {
  const { error } = await client
    .from("rolling_paper_image")
    .delete()
    .eq("image_node_id", nodeId);
  if (error) throw error;
};
