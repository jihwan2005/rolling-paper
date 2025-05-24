import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/rollingpaper-page";
import { getRollingPaperByJoinCode } from "../data/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const joinCode = params.joinCode;
  const rollingPaper = await getRollingPaperByJoinCode(client, {
    joinCode,
  });
  return { rollingPaper };
};

export default function RollingPaperPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl">
          {loaderData.rollingPaper.rolling_paper_title}
        </span>
        <span className="text-sm text-gray-500">
          가입 코드 : {loaderData.rollingPaper.join_code}
        </span>
      </div>
    </div>
  );
}
