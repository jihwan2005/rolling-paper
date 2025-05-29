import { makeSSRClient } from "~/supa-client";

import { getLoggedInUserId } from "~/features/users/queries";
import { getMyRollingPaper } from "../data/queries";
import { Link } from "react-router";
import type { Route } from "./+types/my-rollingpapers-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const myPapers = await getMyRollingPaper(client, {
    userId,
  });
  return { myPapers };
};

export default function MyRollingPapers({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex justify-center mt-100">
      <div className="w-full flex flex-col items-center">
        {loaderData.myPapers.map((paper) => (
          <Link
            to={`/rolling-paper/${paper.rolling_paper?.join_code}/my`}
            className="w-1/3"
          >
            <div className="flex items-center justify-between border p-2 rounded shadow hover:bg-gray-200 mb-3 cursor-pointer">
              <span>{paper.rolling_paper.rolling_paper_title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
