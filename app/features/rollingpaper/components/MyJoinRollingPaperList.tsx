import { Link } from "react-router";
import { DateTime } from "luxon";

// 롤링 페이퍼 방문 기록 데이터의 타입을 정의합니다.
// 실제 프로젝트의 타입 정의에 따라 필요하면 수정하세요.
interface VisitedRollingPaper {
  rolling_paper: {
    join_code: string;
    rolling_paper_title: string;
  } | null; // rolling_paper가 null일 수 있음을 명시
  visited_at: string;
}

interface MyJoinRollingPaperListProps {
  myRollingPapers: VisitedRollingPaper[] | null;
}

export function MyJoinRollingPaperList({
  myRollingPapers,
}: MyJoinRollingPaperListProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {myRollingPapers?.map((paper) => (
        <Link
          to={`/rolling-paper/${paper.rolling_paper?.join_code}`}
          className="w-1/2"
          key={paper.rolling_paper?.join_code || paper.visited_at} // 고유한 key를 위해 join_code 또는 visited_at 사용
        >
          <div className="flex items-center justify-between border p-2 rounded shadow hover:bg-gray-200 mb-3 cursor-pointer">
            <span className="text-lg font-semibold">
              {paper.rolling_paper?.rolling_paper_title}
            </span>
            <span className="text-sm text-gray-500">
              {DateTime.fromISO(paper.visited_at, { zone: "utc" })
                .setZone("Asia/Seoul")
                .toRelative()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
