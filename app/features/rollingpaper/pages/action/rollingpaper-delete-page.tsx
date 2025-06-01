import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-delete-page";
import { deleteImageNode, deleteTextNode } from "../../data/mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
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
  }
};
