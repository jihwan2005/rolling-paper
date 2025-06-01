// src/hooks/useCanvasObjectCreation.ts

import { Canvas, Textbox, FabricImage } from "fabric";

interface UseObjectCreationProps {
  canvases: Canvas[];
  activeCanvasIndex: number;
  isDrawingMode: boolean;
  font: string; // 텍스트 추가 시 필요한 font 상태
  color: string; // 텍스트 추가 시 필요한 color 상태
}

export const useObjectCreation = ({
  canvases,
  activeCanvasIndex,
  isDrawingMode,
  font,
  color,
}: UseObjectCreationProps) => {
  const handleAddText = () => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    // 드로잉 모드일 경우 텍스트 추가 비활성화
    if (isDrawingMode) {
      alert("드로잉 모드에서는 텍스트를 추가할 수 없습니다.");
      return;
    }

    const newText = new Textbox("새 메시지를 입력하세요!", {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: color, // 외부에서 받은 color 사용
      fontFamily: font, // 외부에서 받은 font 사용
      editable: true,
    });

    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.requestRenderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = canvases[activeCanvasIndex];
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    // 드로잉 모드일 경우 이미지 추가 비활성화
    if (isDrawingMode) {
      alert("드로잉 모드에서는 이미지를 추가할 수 없습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      const imageUrl = readerEvent.target?.result as string;
      await FabricImage.fromURL(imageUrl).then((img) => {
        img.set({
          scaleX: 0.5,
          scaleY: 0.5,
          left: 150,
          top: 150,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  return {
    handleAddText,
    handleImageUpload,
  };
};
