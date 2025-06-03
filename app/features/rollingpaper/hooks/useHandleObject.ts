// src/hooks/useCanvasObjectPersistence.ts

import { Canvas } from "fabric";
import type {
  CustomAudio,
  CustomImage,
  CustomPath,
  CustomTextbox,
} from "../interfaces/fabric-interface";
import { useFetcher } from "react-router"; // useFetcher 훅이 필요합니다.

interface UseHandleObjectProps {
  canvases: Canvas[];
  activeCanvasIndex: number;
  joinCode: string;
  isDrawingMode: boolean; // 드로잉 모드 상태가 필요합니다.
}

export const useHandleObject = ({
  canvases,
  activeCanvasIndex,
  joinCode,
  isDrawingMode,
}: UseHandleObjectProps) => {
  const fetcher = useFetcher(); // 훅 내부에서 useFetcher를 사용합니다.

  const handleSubmitObject = async () => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;
    const obj = canvas.getActiveObject();

    const textbox = obj as CustomTextbox;
    const image = obj as CustomImage;
    const path = obj as CustomPath;
    const audio = obj as CustomAudio;

    const formData = new FormData();
    if (obj?.type === "textbox") {
      formData.append("type", "textbox");
      formData.append("textNodeId", String(textbox.textNodeId || ""));
      formData.append("text", textbox.text || "");
      formData.append("fontFamily", textbox.fontFamily || "");
      formData.append("fontSize", String(textbox.fontSize));
      formData.append("fill", textbox.fill?.toString() || "");
      formData.append("width", String(textbox.width));
      formData.append("left", String(textbox.left));
      formData.append("top", String(textbox.top));
      formData.append("scaleX", String(textbox.scaleX));
      formData.append("scaleY", String(textbox.scaleY));
      formData.append("angle", String(textbox.angle));
      formData.append("canvasIndex", String(activeCanvasIndex));
    } else if (obj?.type === "image") {
      const isAudio = (obj as any).isAudio;
      if (isAudio) {
        formData.append("type", "audio");
        formData.append("audioUrl", (obj as any).audioUrl || "");
        formData.append("left", String(audio.left));
        formData.append("top", String(audio.top));
        formData.append("scaleX", String(audio.scaleX));
        formData.append("scaleY", String(audio.scaleY));
        formData.append("angle", String(audio.angle));
        formData.append("canvasIndex", String(activeCanvasIndex));
      } else {
        formData.append("type", "image");
        formData.append("imageUrl", String(image.getSrc() || ""));
        formData.append("imageNodeId", String(image.imageNodeId || ""));
        formData.append("left", String(image.left));
        formData.append("top", String(image.top));
        formData.append("scaleX", String(image.scaleX));
        formData.append("scaleY", String(image.scaleY));
        formData.append("angle", String(image.angle));
        formData.append("width", String(image.width));
        formData.append("height", String(image.height));
        formData.append("canvasIndex", String(activeCanvasIndex));
      }
    } else if (obj?.type === "path") {
      formData.append("type", "path");
      formData.append("path", JSON.stringify(path.path));
      formData.append(
        "stroke",
        typeof path.stroke === "string"
          ? path.stroke
          : JSON.stringify(path.stroke)
      );
      formData.append("strokeWidth", String(path.strokeWidth));
      formData.append("left", String(path.left));
      formData.append("top", String(path.top));
      formData.append("scaleX", String(path.scaleX));
      formData.append("scaleY", String(path.scaleY));
      formData.append("angle", String(path.angle));
      formData.append("canvasIndex", String(activeCanvasIndex));
    }

    fetcher.submit(formData, {
      method: "POST",
      action: `/rolling-paper/${joinCode}/create`,
    });
  };

  const handleDeleteObject = async () => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      if (isDrawingMode) {
        alert("드로잉 모드에서는 삭제할 객체가 없습니다.");
      }
      return;
    }

    const formData = new FormData();

    // @ts-ignore
    if (activeObject.isAudio) {
      // @ts-ignore
      const audioNodeId = activeObject.audioNodeId;
      if (audioNodeId) {
        formData.append("type", "audio");
        formData.append("audioNodeId", String(audioNodeId));
      }
    } else if (activeObject.type === "textbox") {
      // @ts-ignore
      const textNodeId = activeObject.textNodeId;
      if (textNodeId) {
        formData.append("type", "text");
        formData.append("textNodeId", String(textNodeId));
      }
    } else if (activeObject.type === "image") {
      // @ts-ignore
      const imageNodeId = activeObject.imageNodeId;
      if (imageNodeId) {
        formData.append("type", "image");
        formData.append("imageNodeId", String(imageNodeId));
      }
    } else if (activeObject.type === "path") {
      // @ts-ignore
      const pathNodeId = activeObject.pathNodeId;
      if (pathNodeId) {
        formData.append("type", "path");
        formData.append("pathNodeId", String(pathNodeId));
      }
    }

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    fetcher.submit(formData, {
      method: "POST",
      action: `/rolling-paper/${joinCode}/delete`,
    });
  };

  return {
    handleSubmitObject,
    handleDeleteObject,
  };
};
