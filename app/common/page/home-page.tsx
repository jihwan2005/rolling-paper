import { Link, useFetcher, useOutletContext } from "react-router";
import type { Route } from "./+types/home-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { countNotification } from "~/features/rollingpaper/data/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const count = await countNotification(client, {
    userId,
  });
  return { count };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn, username } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
  }>();
  const fetcher = useFetcher();
  const handleClick = () => {
    fetcher.submit(null, {
      method: "post",
      action: "/rolling-paper/see-notification",
    });
  };

  return (
    <div className="mt-20 flex justify-center items-center flex-col gap-30">
      <div className="flex flex-col items-center gap-4">
        <span className="text-7xl">Rolling Paper</span>
        <span className="text-2xl">당신의 마음을 전하세요</span>
      </div>
      {!isLoggedIn ? (
        <div className="flex flex-col gap-1 items-center">
          <span>로그인 후 롤링페이퍼를 작성하세요</span>
          <Link to={"/auth/login"}>
            <span>Log In &rarr;</span>
          </Link>
        </div>
      ) : (
        <Link to={"/auth/logout"}>
          <div>Log Out</div>
        </Link>
      )}
      {isLoggedIn && (
        <div className="flex flex-col gap-3 items-center">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-2xl">{username}님의 진심이 전해지길!</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={"/rolling-paper/create"}>
              <button className="border-2 rounded-sm p-3 hover:bg-gray-200">
                롤링페이퍼 만들기
              </button>
            </Link>
            <Link to={"/rolling-paper/join"}>
              <button className="border-2 rounded-sm p-3 hover:bg-gray-200">
                롤링페이퍼 참여하기
              </button>
            </Link>
            <Link
              to="/rolling-paper/my"
              className="relative inline-block"
              onClick={handleClick}
            >
              <button className="border-2 rounded-sm p-3 hover:bg-gray-200 relative">
                내 롤링페이퍼
              </button>
              {loaderData.count > 0 && (
                <div className="absolute top-0.5 right-0.5 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-500" />
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
