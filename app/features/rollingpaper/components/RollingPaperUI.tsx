// components/RollingPaperUI.tsx (혹은 원하는 경로에)
import React from "react";
import { ImageIcon } from "lucide-react";

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
}) => {
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
    </div>
  );
};

export default RollingPaperUI;
