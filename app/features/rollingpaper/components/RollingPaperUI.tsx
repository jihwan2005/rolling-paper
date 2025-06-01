// components/RollingPaperUI.tsx
import React, { useEffect, useState } from "react";
import { ImageIcon, Send, Palette, PenTool } from "lucide-react"; // PenTool 아이콘 추가
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
  // 브러쉬 모드 관련 props 추가
  isDrawingMode: boolean;
  handleToggleDrawingMode: () => void;
  brushColor: string;
  handleBrushColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  brushWidth: number;
  handleBrushWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  isDrawingMode,
  handleToggleDrawingMode,
  brushColor,
  handleBrushColorChange,
  brushWidth,
  handleBrushWidthChange,
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
    <div className="flex flex-wrap gap-4 p-4 border rounded-lg shadow-md">
      {/* 텍스트 도구 */}
      <div className="flex flex-col gap-2 p-2 border rounded">
        <h3 className="font-semibold">텍스트 도구</h3>
        <label htmlFor="font-family" className="text-sm">
          폰트:
        </label>
        <select
          id="font-family"
          value={font}
          onChange={handleFontChange}
          className="p-1 border rounded text-sm"
          disabled={isDrawingMode}
        >
          {fontFamilies.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <label htmlFor="text-color" className="text-sm">
          색상:
        </label>
        <input
          type="color"
          id="text-color"
          value={color}
          onChange={handleColorChange}
          className="w-10 h-10 border rounded"
          disabled={isDrawingMode}
        />
        <button
          onClick={handleAddText}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isDrawingMode}
        >
          텍스트 추가
        </button>
      </div>

      {/* 이미지 도구 */}
      <div className="flex flex-col gap-2 p-2 border rounded">
        <h3 className="font-semibold">이미지 도구</h3>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageUpload}
          disabled={isDrawingMode}
        />
        <label
          htmlFor="image-upload"
          className={`p-2 bg-yellow-500 text-white rounded cursor-pointer flex items-center justify-center ${
            isDrawingMode
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-yellow-600"
          }`}
        >
          <ImageIcon className="mr-2" /> 이미지 추가
        </label>
      </div>

      {/* 브러쉬 도구 */}
      <div className="flex flex-col gap-2 p-2 border rounded">
        <h3 className="font-semibold">브러쉬 도구</h3>
        <button
          onClick={handleToggleDrawingMode}
          className={`p-2 rounded flex items-center justify-center ${
            isDrawingMode ? "bg-red-500 text-white" : "bg-green-500 text-white"
          } hover:opacity-80`}
        >
          <PenTool className="mr-2" />
          {isDrawingMode ? "드로잉 모드 끄기" : "드로잉 모드 켜기"}
        </button>
        {isDrawingMode && (
          <>
            <label htmlFor="brush-color" className="text-sm">
              브러쉬 색상:
            </label>
            <input
              type="color"
              id="brush-color"
              value={brushColor}
              onChange={handleBrushColorChange}
              className="w-10 h-10 border rounded"
            />
            <label htmlFor="brush-width" className="text-sm">
              브러쉬 두께:
            </label>
            <input
              type="range"
              id="brush-width"
              min="1"
              max="20"
              value={brushWidth}
              onChange={handleBrushWidthChange}
              className="w-full"
            />
            <span className="text-xs text-gray-500">두께: {brushWidth}</span>
            {/* **브러쉬 종류 선택 추가** */}
          </>
        )}
      </div>

      {/* 공통 작업 */}
      <div className="flex flex-col gap-2 p-2 border rounded">
        <h3 className="font-semibold">공통 작업</h3>
        <button
          onClick={handleSubmitObject}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
          disabled={isDrawingMode} // 드로잉 모드일 때 비활성화
        >
          저장하기
        </button>
        <button
          onClick={handleDeleteObject}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>

      {/* 롤링페이퍼 전달 (기존 코드 유지) */}
      {author && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <button
              className="p-2 bg-pink-500 text-white rounded cursor-pointer flex items-center justify-center"
              type="button"
            >
              <Send className="mr-2" /> 전달하기
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
