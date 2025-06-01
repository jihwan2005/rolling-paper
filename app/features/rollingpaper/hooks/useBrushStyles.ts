// src/hooks/useBrushStyles.ts
import { useState, useEffect } from "react";
import { Canvas, PencilBrush, CircleBrush, SprayBrush } from "fabric";

// 브러쉬 종류 타입을 정의합니다. RollingPaperPage와 RollingPaperUI에서도 동일하게 사용됩니다.
export type BrushType = "pencil" | "circle" | "spray";

interface UseBrushStylesProps {
  canvases: Canvas[];
  activeCanvasIndex: number;
  isDrawingMode: boolean;
}

export const useBrushStyles = ({
  canvases,
  activeCanvasIndex,
  isDrawingMode,
}: UseBrushStylesProps) => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [brushType, setBrushType] = useState<BrushType>("pencil");

  // 브러쉬 속성 업데이트 및 브러쉬 종류 변경 로직
  useEffect(() => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    let newBrush;
    switch (brushType) {
      case "circle":
        newBrush = new CircleBrush(canvas);
        break;
      case "spray":
        newBrush = new SprayBrush(canvas);
        break;
      case "pencil":
      default:
        newBrush = new PencilBrush(canvas);
        break;
    }

    canvas.freeDrawingBrush = newBrush;
    canvas.isDrawingMode = isDrawingMode;
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;

    // 필요하다면 브러쉬 종류별 추가 속성 설정
    if (brushType === "spray" && newBrush instanceof SprayBrush) {
      newBrush.density = brushWidth * 2;
    }
  }, [
    activeCanvasIndex,
    canvases,
    isDrawingMode,
    brushColor,
    brushWidth,
    brushType,
  ]);

  // 브러쉬 색상 변경 핸들러
  const handleBrushColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value);
  };

  // 브러쉬 두께 변경 핸들러
  const handleBrushWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(Number(e.target.value));
  };
  return {
    brushColor,
    setBrushColor, // 필요한 경우 외부에서 상태를 직접 설정할 수 있도록 반환
    brushWidth,
    setBrushWidth,
    setBrushType,
    handleBrushColorChange,
    handleBrushWidthChange,
  };
};
