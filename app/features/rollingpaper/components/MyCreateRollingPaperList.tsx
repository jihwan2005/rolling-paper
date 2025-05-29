import { Link } from "react-router";
import { DateTime } from "luxon";

// 롤링 페이퍼 데이터의 타입을 정의합니다.
// 실제 프로젝트의 타입 정의에 따라 필요하면 수정하세요.
interface RollingPaper {
  join_code: string;
  rolling_paper_title: string;
  created_at: string;
}

interface MyCreateRollingPaperListProps {
  myRollingPapers: RollingPaper[];
}

export function MyCreateRollingPaperList({
  myRollingPapers,
}: MyCreateRollingPaperListProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {myRollingPapers.map((paper) => (
        <Link
          to={`/rolling-paper/${paper?.join_code}`}
          className="w-1/3"
          key={paper.join_code} // React 리스트 렌더링을 위한 key prop 추가
        >
          <div className="flex items-center justify-between border p-2 rounded shadow hover:bg-gray-200 mb-3 cursor-pointer">
            <span>{paper.rolling_paper_title}</span>
            <span className="text-sm text-gray-500">
              {DateTime.fromISO(paper.created_at, { zone: "utc" })
                .setZone("Asia/Seoul")
                .toRelative()}{" "}
              에 생성
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
