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

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = canvases[activeCanvasIndex];
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    // 드로잉 모드일 경우 오디오 추가 비활성화
    if (isDrawingMode) {
      alert("드로잉 모드에서는 오디오를 추가할 수 없습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const audioUrl = reader.result as string;
      const iconUrl =
        "https://media.istockphoto.com/id/1189124876/video/black-and-white-sound-icon-audio-music-speaker-animation.jpg?s=640x640&k=20&c=-MH5kixm4YfRIersYM8rKij1RVgAH8ixtTw0xJ17tj4=";

      await FabricImage.fromURL(iconUrl).then((img) => {
        img.set({
          scaleX: 0.2,
          scaleY: 0.2,
          left: 150,
          top: 150,
          stroke: "black", // 테두리 색상
          strokeWidth: 2, // 테두리 두께
          strokeUniform: true,
        });
        (img as any).audioUrl = audioUrl;
        (img as any).isAudio = true;
        img.on("mousedown", () => {
          const audio = new Audio((img as any).audioUrl);
          audio.play();
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
    handleAudioUpload,
  };
};

