import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-send-page";
import { getRollingPaperByJoinCode } from "../../data/queries";
import { getUserIdByUsername } from "~/features/users/queries";
import { createMyRollingPaper } from "../../data/mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const joinCode = params.joinCode;
  const { rolling_paper_id } = await getRollingPaperByJoinCode(client, {
    joinCode,
  });
  const user = await getUserIdByUsername(client, {
    username,
  });
  if (!user) {
    return { error: "존재하지 않는 이름입니다." };
  }
  const { profile_id } = user;
  await createMyRollingPaper(client, {
    paperId: rolling_paper_id,
    userId: profile_id,
  });
  return { success: true };
};
