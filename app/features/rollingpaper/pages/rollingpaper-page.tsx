import { useEffect, useRef, useState } from "react";
import { Canvas, Textbox, FabricImage, PencilBrush, Path } from "fabric";
import type { Route } from "./+types/rollingpaper-page";
import { makeSSRClient } from "~/supa-client";
import {
  getRollingPaperAudioNode,
  getRollingPaperByJoinCode,
  getRollingPaperImageNode,
  getRollingPaperPathNode,
  getRollingPaperTextNode,
} from "../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";
import RollingPaperUI from "../components/RollingPaperUI";
import CanvasTabButtons from "../components/CanvasTabButtons";
import CanvasSection from "../components/CanvasSection";
import { useTextBoxStyles } from "../hooks/useTextBoxStyles";
import { useHandleObject } from "../hooks/useHandleObject";
import { useObjectCreation } from "../hooks/useObjectCreation";
import CanvasTooltip from "../components/Tooltip";
import { useBrushStyles } from "../hooks/useBrushStyles";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const joinCode = params.joinCode;
  const { rolling_paper_title, rolling_paper_id, profile_id } =
    await getRollingPaperByJoinCode(client, {
      joinCode,
    });
  const textNodes = await getRollingPaperTextNode(client, {
    paperId: rolling_paper_id,
  });
  const imageNodes = await getRollingPaperImageNode(client, {
    paperId: rolling_paper_id,
  });
  const pathNodes = await getRollingPaperPathNode(client, {
    paperId: rolling_paper_id,
  });
  const audioNodes = await getRollingPaperAudioNode(client, {
    paperId: rolling_paper_id,
  });
  return {
    joinCode,
    rolling_paper_title,
    textNodes,
    userId,
    imageNodes,
    profile_id,
    pathNodes,
    audioNodes,
  };
};

export default function RollingPaperPage({ loaderData }: Route.ComponentProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]); // 여러 개의 canvas
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [activeCanvasIndex, setActiveCanvasIndex] = useState<number>(0);
  const [font, setFont] = useState("Arial");
  const [color, setColor] = useState("#000000");
  // 브러쉬 모드 관련 상태 추가
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const initialCanvasCount = Math.max(
    1, // 최소 1개의 캔버스는 항상 존재
    ...loaderData.textNodes.map((n) => n.canvas_index + 1),
    ...loaderData.imageNodes.map((n) => n.canvas_index + 1),
    ...loaderData.pathNodes.map((n) => n.canvas_index + 1)
  );
  const [canvasCount, setCanvasCount] = useState(initialCanvasCount);
  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
  ];

  const {
    brushColor,
    brushWidth,
    handleBrushColorChange,
    handleBrushWidthChange,
  } = useBrushStyles({
    canvases,
    activeCanvasIndex,
    isDrawingMode,
  });

  useEffect(() => {
    if (!canvasRefs.current.length) return;

    const newCanvases: Canvas[] = [];

    canvasRefs.current.forEach((ref, idx) => {
      if (!ref) return;

      const canvas = new Canvas(ref, {
        width: 800,
        height: 600,
      });

      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;

      // ✅ 공통 데이터 사용
      for (const node of loaderData.textNodes.filter(
        (n) => n.canvas_index === idx
      )) {
        const customText = new Textbox(node.text_content, {
          left: node.left,
          top: node.top,
          fontSize: node.font_size,
          fill: node.fill,
          fontFamily: node.font_family,
          width: node.width ?? 0,
          scaleX: node.scaleX,
          scaleY: node.scaleY,
          angle: node.angle,
          editable: node.profile_id === loaderData.userId,
          selectable: node.profile_id === loaderData.userId,
          hoverCursor:
            node.profile_id !== loaderData.userId ? "default" : "move",
        });
        (customText as any).textNodeId = node.text_node_id;
        (customText as any).profile_id = node.profile_id;
        (customText as any).username = node.profiles?.username;

        canvas.add(customText);
      }

      for (const node of loaderData.imageNodes.filter(
        (n) => n.canvas_index === idx
      )) {
        if (!node.image_url) continue;

        FabricImage.fromURL(node.image_url).then((img) => {
          img.set({
            left: node.left,
            top: node.top,
            scaleX: node.scaleX,
            scaleY: node.scaleY,
            angle: node.angle,
            width: node.width,
            height: node.height,
            selectable: node.profile_id === loaderData.userId,
            editable: node.profile_id === loaderData.userId,
            hoverCursor: node.profile_id !== loaderData.userId && "default",
          });

          (img as any).imageNodeId = node.image_node_id;
          (img as any).profile_id = node.profile_id;
          (img as any).username = node.profiles?.username;

          canvas.add(img);
        });
      }

      for (const node of loaderData.audioNodes.filter(
        (n) => n.canvas_index === idx
      )) {
        const audioUrl = node.audio_url;
        const iconUrl =
          "https://media.istockphoto.com/id/1189124876/video/black-and-white-sound-icon-audio-music-speaker-animation.jpg?s=640x640&k=20&c=-MH5kixm4YfRIersYM8rKij1RVgAH8ixtTw0xJ17tj4=";
        FabricImage.fromURL(iconUrl).then((img) => {
          img.set({
            scaleX: 0.2,
            scaleY: 0.2,
            left: node.left,
            top: node.top,
            stroke: "black", // 테두리 색상
            strokeWidth: 2, // 테두리 두께
            strokeUniform: true,
            selectable: node.profile_id === loaderData.userId,
            editable: node.profile_id === loaderData.userId,
            hoverCursor: node.profile_id !== loaderData.userId && "pointer",
          });
          (img as any).audioUrl = audioUrl;
          (img as any).audioNodeId = node.audio_node_id;
          (img as any).profile_id = node.profile_id;
          (img as any).username = node.profiles?.username;
          (img as any).isAudio = true;
          img.on("mousedown", () => {
            const audio = new Audio((img as any).audioUrl);
            audio.play();
          });
          canvas.add(img);
        });
      }

      for (const node of loaderData.pathNodes.filter(
        (n) => n.canvas_index === idx
      )) {
        const pathObj = JSON.parse(node.path); // JSON → 객체
        const path = new Path(pathObj, {
          left: node.left,
          top: node.top,
          scaleX: node.scaleX,
          scaleY: node.scaleY,
          angle: node.angle,
          fill: null,
          stroke: node.stroke,
          strokeWidth: node.stroke_width,
          selectable: node.profile_id === loaderData.userId,
          editable: node.profile_id === loaderData.userId,
          hoverCursor:
            node.profile_id !== loaderData.userId ? "default" : "move",
        });

        // 사용자 정보 주입
        (path as any).pathNodeId = node.path_node_id;
        (path as any).profile_id = node.profile_id;
        (path as any).username = node.profiles?.username;

        canvas.add(path);
      }
      // Tooltip 이벤트
      const tooltip = document.getElementById("tooltip");
      canvas.on("mouse:over", (e) => {
        if (!tooltip || !e.pointer) return;
        const target = e.target as any;
        const evt = e.e as MouseEvent;

        if (
          (target?.type === "textbox" ||
            target?.type === "image" ||
            target?.type === "path") &&
          target.profile_id !== loaderData.userId &&
          target.username
        ) {
          tooltip.style.left = `${evt.pageX + 10}px`;
          tooltip.style.top = `${evt.pageY + 10}px`;
          tooltip.innerText = `${target.username}님이 올림`;
          tooltip.style.display = "block";
        }
      });

      canvas.on("mouse:out", () => {
        if (tooltip) tooltip.style.display = "none";
      });

      newCanvases.push(canvas);
    });

    setCanvases(newCanvases);

    return () => {
      newCanvases.forEach((canvas) => canvas.dispose());
      const tooltip = document.getElementById("tooltip");
      if (tooltip) tooltip.style.display = "none";
    };
  }, [loaderData, canvasCount]);

  useEffect(() => {
    const canvas = canvases[activeCanvasIndex];
    if (canvas && canvas.freeDrawingBrush) {
      // <-- useEffect 내에서도 freeDrawingBrush 체크 추가
      canvas.isDrawingMode = isDrawingMode;
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [activeCanvasIndex, canvases, isDrawingMode, brushColor, brushWidth]);

  const {
    handleFontChange, // 이름 충돌을 피하기 위해 이름 변경
    handleColorChange, // 이름 충돌을 피하기 위해 이름 변경
  } = useTextBoxStyles({ canvases, activeCanvasIndex });

  const { handleSubmitObject, handleDeleteObject } = useHandleObject({
    canvases,
    activeCanvasIndex,
    joinCode: loaderData.joinCode,
    isDrawingMode,
  });

  const { handleAddText, handleImageUpload, handleAudioUpload } =
    useObjectCreation({
      canvases,
      activeCanvasIndex,
      isDrawingMode,
      font, // font 상태 전달
      color, // color 상태 전달
    });

  const handleToggleDrawingMode = () => {
    setIsDrawingMode((prev) => {
      const newDrawingMode = !prev;
      const canvas = canvases[activeCanvasIndex];
      if (canvas) {
        canvas.isDrawingMode = newDrawingMode; // 캔버스 상태 즉시 업데이트
        canvas.selection = !newDrawingMode; // 드로잉 모드에 따라 객체 선택 비활성화/활성화
        canvas.discardActiveObject(); // 현재 선택된 객체 해제        canvas.requestRenderAll();

        // 브러쉬 모드 활성화 시 브러쉬 속성 적용
        if (newDrawingMode && canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = brushColor;
          canvas.freeDrawingBrush.width = brushWidth;
        }
      }
      return newDrawingMode;
    });
  };

  const addCanvas = () => {
    setCanvasCount((count) => count + 1);
    setActiveCanvasIndex(canvasCount);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-3xl">{loaderData.rolling_paper_title}</span>
        <span className="text-xl text-gray-400">{loaderData.joinCode}</span>
      </div>

      <RollingPaperUI
        font={font}
        fontFamilies={fontFamilies}
        handleFontChange={handleFontChange}
        color={color}
        handleColorChange={handleColorChange}
        handleAddText={handleAddText}
        handleDeleteObject={handleDeleteObject}
        handleSubmitObject={handleSubmitObject}
        handleImageUpload={handleImageUpload}
        handleAudioUpload={handleAudioUpload}
        authorId={loaderData.profile_id}
        userId={loaderData.userId}
        joinCode={loaderData.joinCode}
        isDrawingMode={isDrawingMode}
        handleToggleDrawingMode={handleToggleDrawingMode}
        brushColor={brushColor}
        handleBrushColorChange={handleBrushColorChange}
        brushWidth={brushWidth}
        handleBrushWidthChange={handleBrushWidthChange}
      />

      <CanvasTooltip />
      <div>
        {/* 탭 버튼 */}
        <CanvasTabButtons
          canvasCount={canvasCount}
          activeCanvasIndex={activeCanvasIndex}
          setActiveCanvasIndex={setActiveCanvasIndex}
          addCanvas={addCanvas}
        />
        <CanvasSection
          canvasCount={canvasCount}
          activeCanvasIndex={activeCanvasIndex}
          canvasRefs={canvasRefs}
        />
      </div>
    </div>
  );
}