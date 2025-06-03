import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-delete-page";
import {
  deleteAudioNode,
  deleteImageNode,
  deletePathNode,
  deleteTextNode,
} from "../../data/mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  console.log(formData);
  const type = formData.get("type");
  if (type === "text") {
    const textNodeId = Number(formData.get("textNodeId"));
    await deleteTextNode(client, {
      nodeId: textNodeId,
    });
  } else if (type === "image") {
    const imageNodeId = Number(formData.get("imageNodeId"));
    await deleteImageNode(client, {
      nodeId: imageNodeId,
    });
  } else if (type === "path") {
    const pathNodeId = Number(formData.get("pathNodeId"));
    await deletePathNode(client, {
      nodeId: pathNodeId,
    });
  } else if (type === "audio") {
    const audioNodeId = Number(formData.get("audioNodeId"));
    await deleteAudioNode(client, {
      nodeId: audioNodeId,
    });
  }
};
