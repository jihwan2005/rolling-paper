// src/hooks/useCanvasObjectPersistence.ts

import { Canvas } from "fabric";
import type {
  CustomImage,
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
    } else {
      alert("드로잉 모드에서 그려진 내용은 현재 저장되지 않습니다.");
      return;
    }

    fetcher.submit(formData, {
      method: "POST",
      action: `/rolling-paper/${joinCode}/create`, // joinCode를 훅의 props로 받아서 사용
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

    if (activeObject.type === "textbox") {
      // @ts-ignore // Fabric.js 객체에 직접 추가한 속성이므로 필요할 수 있습니다.
      const textNodeId = activeObject.textNodeId;
      if (textNodeId) {
        formData.append("type", "text");
        formData.append("textNodeId", String(textNodeId));
      }
    } else if (activeObject.type === "image") {
      // @ts-ignore // Fabric.js 객체에 직접 추가한 속성이므로 필요할 수 있습니다.
      const imageNodeId = activeObject.imageNodeId;
      if (imageNodeId) {
        formData.append("type", "image");
        formData.append("imageNodeId", String(imageNodeId));
      }
    } else if (activeObject.type === "path") {
      // 드로잉 모드에서 그려진 선(path) 삭제
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      return; // 데이터베이스에 저장되지 않으므로 API 호출 필요 없음
    } else {
      return;
    }

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    fetcher.submit(formData, {
      method: "POST",
      action: `/rolling-paper/${joinCode}/delete`, // joinCode를 훅의 props로 받아서 사용
    });
  };

  return {
    handleSubmitObject,
    handleDeleteObject,
  };
};
