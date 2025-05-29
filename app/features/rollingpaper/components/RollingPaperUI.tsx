// components/RollingPaperUI.tsx (혹은 원하는 경로에)
import React, { useEffect, useState } from "react";
import { ImageIcon, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, useFetcher } from "react-router";

// 필요한 프롭스 타입을 정의합니다.
interface RollingPaperUIProps {
  font: string;
  fontFamilies: string[];
  handleFontChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  color: string;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddText: () => void;
  handleDeleteObject: () => void;
  handleSubmitObject: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  authorId: string;
  userId: string;
  joinCode: string;
}

const RollingPaperUI: React.FC<RollingPaperUIProps> = ({
  font,
  fontFamilies,
  handleFontChange,
  color,
  handleColorChange,
  handleAddText,
  handleDeleteObject,
  handleSubmitObject,
  handleImageUpload,
  authorId,
  userId,
  joinCode,
}) => {
  const author = authorId === userId;
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      alert("성공적으로 전달되었습니다!");
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data]);
  return (
    <div className="flex gap-4">
      {/* 폰트 선택 */}
      <label>
        Font:
        <select
          value={font}
          onChange={handleFontChange}
          className="ml-2 p-1 border rounded"
        >
          {fontFamilies.map(
            (
              f // 'font' 변수와의 충돌을 피하기 위해 'f'로 변경
            ) => (
              <option key={f} value={f}>
                {f}
              </option>
            )
          )}
        </select>
      </label>

      {/* 색상 선택 */}
      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="ml-2"
        />
      </label>
      <button
        onClick={handleAddText}
        className="p-2 bg-green-500 text-white rounded cursor-pointer"
      >
        추가하기
      </button>
      <button
        onClick={handleDeleteObject}
        className="p-2 bg-red-500 text-white rounded cursor-pointer"
      >
        삭제하기
      </button>
      <button
        onClick={handleSubmitObject}
        className="p-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        저장하기
      </button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="image-upload"
        className="p-2 bg-yellow-500 text-white rounded cursor-pointer"
      >
        <ImageIcon />
      </label>
      {author && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <button
              className="p-2 bg-pink-500 text-white rounded cursor-pointer"
              type="button"
            >
              <Send />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <fetcher.Form
              method="post"
              action={`/rolling-paper/${joinCode}/send`}
            >
              <DialogHeader>
                <DialogDescription className="text-xl mb-5">
                  받을 사람의 이름 입력
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <input
                    className="border-1 p-2 rounded"
                    placeholder="이름"
                    name="username"
                  />

                  <button
                    className="rounded p-2 bg-pink-500 text-white cursor-pointer"
                    type="submit"
                  >
                    전달하기
                  </button>
                </div>
                {fetcher.data?.error && (
                  <span className="text-red-500">{fetcher.data?.error}</span>
                )}
              </div>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RollingPaperUI;
