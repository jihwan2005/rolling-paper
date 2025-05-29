import { LoaderCircle } from "lucide-react";
import { useNavigation } from "react-router";

export function CreateRollingPaperInput() {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <form className="w-1/3 flex items-center mb-3" method="post">
      <input
        className="border-2 p-2 rounded-sm flex-1"
        placeholder="롤링페이퍼 제목"
        name="title"
        required
        type="text"
      />
      <button
        className="border-2 p-2 rounded-sm ml-2 cursor-pointer hover:bg-gray-200"
        type="submit"
      >
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : "생성하기"}
      </button>
    </form>
  );
}
