import { Link, useOutletContext } from "react-router";

export default function HomePage() {
  const { isLoggedIn, username } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
  }>();
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
          </div>
        </div>
      )}
    </div>
  );
}
