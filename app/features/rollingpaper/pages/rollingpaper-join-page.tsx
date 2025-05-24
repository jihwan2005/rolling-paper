import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-join-page";
import { redirect } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";
import { visitRollingPaper } from "../data/mutations";
import { getVisitRollingPaper } from "../data/queries";
import { JoinRollingPaperInput } from "../components/JoinRollingPaperInput";
import { MyJoinRollingPaperList } from "../components/MyJoinRollingPaperList";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const joinCode = formData.get("joinCode") as string;
  if (typeof joinCode !== "string" || joinCode.trim() === "") {
    return {
      message: "코드를 입력해주세요.",
    };
  }
  const { data } = await client
    .from("rolling_paper")
    .select("*")
    .eq("join_code", joinCode)
    .limit(1)
    .maybeSingle();
  if (!data) {
    return {
      message: "코드가 유효하지 않습니다.",
    };
  }
  await visitRollingPaper(client, {
    userId,
    paperId: data.rolling_paper_id,
  });
  return redirect(`/rolling-paper/${data.join_code}`);
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const myRollingPapers = await getVisitRollingPaper(client, {
    userId,
  });
  return { myRollingPapers };
};

export default function RollingPaperJoinPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="flex justify-center mt-100">
      <div className="flex flex-col w-full items-center">
        <JoinRollingPaperInput errorMessage={actionData?.message} />
        <MyJoinRollingPaperList myRollingPapers={loaderData.myRollingPapers} />
      </div>
    </div>
  );
}
