// src/hooks/useCanvasObjectStyles.ts

import { Canvas, Textbox } from "fabric"; // Textbox 타입이 필요합니다.
// CustomTextbox 타입이 필요하다면 추가

interface UseTextBoxStylesProps {
  canvases: Canvas[];
  activeCanvasIndex: number;
}

export const useTextBoxStyles = ({
  canvases,
  activeCanvasIndex,
}: UseTextBoxStylesProps) => {
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      // Fabric Textbox는 'fontFamily' 속성을 가집니다.
      activeObject.set("fontFamily", selectedFont);
      canvas.requestRenderAll();
    }
    // 이 훅에서는 상태를 직접 관리하지 않으므로, setFont 호출은 RollingPaperPage에서 유지됩니다.
    // 만약 훅 내부에서 폰트 상태를 관리하고 싶다면, 이곳에 setFont를 추가하고 반환해야 합니다.
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      // Fabric Textbox는 'fill' 속성을 가집니다.
      activeObject.set("fill", selectedColor);
      canvas.requestRenderAll();
    }
    // 이 훅에서는 상태를 직접 관리하지 않으므로, setColor 호출은 RollingPaperPage에서 유지됩니다.
  };

  return {
    handleFontChange,
    handleColorChange,
  };
};
