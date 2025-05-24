import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-create-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { createRollingPaper } from "../data/mutations";
import { redirect } from "react-router";
import { getRollingPaperByUserId } from "../data/queries";
import { CreateRollingPaperInput } from "../components/CreateRollingPaperInput";
import { MyCreateRollingPaperList } from "../components/MyCreateRollingPaperList";
import { generateJoinCode } from "../functions/generateJoinCode";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const userId = await getLoggedInUserId(client);
  const joinCode = generateJoinCode();
  const { data: existingPaper } = await client
    .from("rolling_paper")
    .select("rolling_paper_id")
    .eq("join_code", joinCode)
    .limit(1)
    .maybeSingle();
  if (existingPaper) {
    return { error: "이미 존재하는 가입 코드입니다." };
  } else {
    const { join_code } = await createRollingPaper(client, {
      title,
      userId,
      joinCode,
    });
    return redirect(`/rolling-paper/${join_code}`);
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const myRollingPapers = await getRollingPaperByUserId(client, {
    userId,
  });
  return { myRollingPapers };
};

export default function RollingPaperPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex justify-center mt-100">
      <div className="flex flex-col w-full items-center">
        <CreateRollingPaperInput />
        <MyCreateRollingPaperList
          myRollingPapers={loaderData.myRollingPapers}
        />
      </div>
    </div>
  );
}
