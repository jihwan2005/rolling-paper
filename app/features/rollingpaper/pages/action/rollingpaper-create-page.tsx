import { makeSSRClient } from "~/supa-client";

import { getRollingPaperByJoinCode } from "../../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  createAudioNode,
  createImageNode,
  createPathNode,
  createTextNode,
  updateTextNode,
} from "../../data/mutations";
import type { Route } from "./+types/rollingpaper-create-page";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const { rolling_paper_id } = await getRollingPaperByJoinCode(client, {
    joinCode: params.joinCode,
  });
  const userId = await getLoggedInUserId(client);
  const type = formData.get("type");
  if (type === "textbox") {
    const textNodeId = formData.get("textNodeId");
    const textContent = formData.get("text") as string;
    const fontFamily = formData.get("fontFamily") as string;
    const fontSize = formData.get("fontSize") as string;
    const fill = formData.get("fill") as string;
    const left = formData.get("left") as string;
    const top = formData.get("top") as string;
    const scaleX = formData.get("scaleX") as string;
    const scaleY = formData.get("scaleY") as string;
    const angle = formData.get("angle") as string;
    const width = formData.get("width") as string;
    const canvasIndex = formData.get("canvasIndex") as string;
    if (textNodeId) {
      // 🔄 업데이트
      await updateTextNode(client, {
        nodeId: Number(textNodeId),
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
      });
    } else {
      // 🆕 새로 생성
      await createTextNode(client, {
        rolling_paper_id: Number(rolling_paper_id),
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
        canvasIndex,
      });
    }
  } else if (type === "image") {
    const left = formData.get("left") as string;
    const top = formData.get("top") as string;
    const scaleX = formData.get("scaleX") as string;
    const scaleY = formData.get("scaleY") as string;
    const angle = formData.get("angle") as string;
    const width = formData.get("width") as string;
    const height = formData.get("height") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const canvasIndex = formData.get("canvasIndex") as string;
    await createImageNode(client, {
      rolling_paper_id: Number(rolling_paper_id),
      userId,
      left,
      top,
      scaleX,
      scaleY,
      angle,
      width,
      height,
      imageUrl,
      canvasIndex,
    });
  } else if(type === "path") {
    const path = formData.get("path") as string;
    const stroke = formData.get("stroke") as string;
    const strokeWidth = formData.get("strokeWidth") as string;
    const left = formData.get("left") as string;
    const top = formData.get("top") as string;
    const scaleX = formData.get("scaleX") as string;
    const scaleY = formData.get("scaleY") as string;
    const angle = formData.get("angle") as string;
    const canvasIndex = formData.get("canvasIndex") as string;
    await createPathNode(client, {
      rolling_paper_id: Number(rolling_paper_id),
      userId,
      left,
      top,
      scaleX,
      scaleY,
      angle,
      path,
      stroke,
      strokeWidth,
      canvasIndex
    })
  } else if(type === "audio") {
    const audioUrl = formData.get("audioUrl") as string;
    const left = formData.get("left") as string;
    const top = formData.get("top") as string;
    const canvasIndex = formData.get("canvasIndex") as string;
    await createAudioNode(client,{
      audioUrl,
      left,
      top,
      canvasIndex,
      rolling_paper_id: Number(rolling_paper_id),
      userId,
    })
  }
};
