import { useEffect, useRef, useState } from "react";
import { Canvas, Textbox, FabricImage } from "fabric";
import type { Route } from "./+types/rollingpaper-page";
import { makeSSRClient } from "~/supa-client";
import {
  getRollingPaperByJoinCode,
  getRollingPaperImageNode,
  getRollingPaperTextNode,
} from "../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  createImageNode,
  createTextNode,
  deleteImageNode,
  deleteTextNode,
  updateTextNode,
} from "../data/mutations";
import RollingPaperUI from "../components/RollingPaperUI";
import type {
  CustomImage,
  CustomTextbox,
} from "../interfaces/fabric-interface";
import CanvasTabButtons from "../components/CanvasTabButtons";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  if (request.method === "POST") {
    const formData = await request.formData();
    const { rolling_paper_id } = await getRollingPaperByJoinCode(client, {
      joinCode: params.joinCode,
    });
    const userId = await getLoggedInUserId(client);
    const type = formData.get("type");
    if (type === "textbox") {
      const textNodeId = formData.get("textNodeId");
      const textContent = formData.get("text") as string;
      const fontFamily = formData.get("fontFamily") as string;
      const fontSize = formData.get("fontSize") as string;
      const fill = formData.get("fill") as string;
      const left = formData.get("left") as string;
      const top = formData.get("top") as string;
      const scaleX = formData.get("scaleX") as string;
      const scaleY = formData.get("scaleY") as string;
      const angle = formData.get("angle") as string;
      const width = formData.get("width") as string;
      const canvasIndex = formData.get("canvasIndex") as string;
      if (textNodeId) {
        // 🔄 업데이트
        await updateTextNode(client, {
          nodeId: Number(textNodeId),
          textContent,
          fontFamily,
          fontSize,
          fill,
          left,
          top,
          scaleX,
          scaleY,
          angle,
          width,
        });
      } else {
        // 🆕 새로 생성
        await createTextNode(client, {
          rolling_paper_id: Number(rolling_paper_id),
          userId,
          textContent,
          fontFamily,
          fontSize,
          fill,
          left,
          top,
          scaleX,
          scaleY,
          angle,
          width,
          canvasIndex,
        });
      }
    } else if (type === "image") {
      const left = formData.get("left") as string;
      const top = formData.get("top") as string;
      const scaleX = formData.get("scaleX") as string;
      const scaleY = formData.get("scaleY") as string;
      const angle = formData.get("angle") as string;
      const width = formData.get("width") as string;
      const height = formData.get("height") as string;
      const imageUrl = formData.get("imageUrl") as string;
      const canvasIndex = formData.get("canvasIndex") as string;
      await createImageNode(client, {
        rolling_paper_id: Number(rolling_paper_id),
        userId,
        left,
        top,
        scaleX,
        scaleY,
        angle,
        width,
        height,
        imageUrl,
        canvasIndex,
      });
    }
  }

  if (request.method === "DELETE") {
    const formData = await request.formData();
    const type = formData.get("type");
    if (type === "text") {
      const textNodeId = Number(formData.get("textNodeId"));
      await deleteTextNode(client, {
        nodeId: textNodeId,
      });
    } else if (type === "image") {
      const imageNodeId = Number(formData.get("imageNodeId"));
      await deleteImageNode(client, {
        nodeId: imageNodeId,
      });
    }
  }
};

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
  return {
    joinCode,
    rolling_paper_title,
    textNodes,
    userId,
    imageNodes,
    profile_id,
  };
};

export default function RollingPaperPage({ loaderData }: Route.ComponentProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]); // 여러 개의 canvas
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [activeCanvasIndex, setActiveCanvasIndex] = useState<number>(0);
  const [font, setFont] = useState("Arial");
  const [color, setColor] = useState("#000000");
  const initialCanvasCount = Math.max(
    1, // 최소 1개의 캔버스는 항상 존재
    ...loaderData.textNodes.map((n) => n.canvas_index + 1), // textNodes 중 가장 큰 canvas_index + 1
    ...loaderData.imageNodes.map((n) => n.canvas_index + 1) // imageNodes 중 가장 큰 canvas_index + 1
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

  useEffect(() => {
    if (!canvasRefs.current.length) return;

    const newCanvases: Canvas[] = [];

    canvasRefs.current.forEach((ref, idx) => {
      if (!ref) return;

      const canvas = new Canvas(ref, {
        width: 800,
        height: 600,
      });

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
          });

          (img as any).imageNodeId = node.image_node_id;
          (img as any).profile_id = node.profile_id;
          (img as any).username = node.profiles?.username;

          canvas.add(img);
        });
      }
      // Tooltip 이벤트
      const tooltip = document.getElementById("tooltip");
      canvas.on("mouse:over", (e) => {
        if (!tooltip || !e.pointer) return;
        const target = e.target as any;
        const evt = e.e as MouseEvent;

        if (
          (target?.type === "textbox" || target?.type === "image") &&
          target.profile_id !== loaderData.userId &&
          target.username
        ) {
          tooltip.style.left = `${evt.pageX + 10}px`;
          tooltip.style.top = `${evt.pageY + 10}px`;
          tooltip.innerText =
            target.type === "textbox"
              ? `${target.username}님이 작성함`
              : `${target.username}님이 올림`;
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

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fontFamily", selectedFont);
      canvas.requestRenderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", selectedColor);
      canvas.requestRenderAll();
    }
  };

  const handleAddText = () => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;

    const newText = new Textbox("새 메시지를 입력하세요!", {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: color,
      fontFamily: font,
      editable: true,
    });

    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.requestRenderAll();
  };

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
      return;
    }

    await fetch(`/rolling-paper/${loaderData.joinCode}`, {
      method: "POST",
      body: formData,
    });
  };

  const handleDeleteObject = async () => {
    const canvas = canvases[activeCanvasIndex];
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    const formData = new FormData();

    if (activeObject.type === "textbox") {
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
    } else {
      return;
    }

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    await fetch(`/rolling-paper/${loaderData.joinCode}`, {
      method: "DELETE",
      body: formData,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = canvases[activeCanvasIndex];
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

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

  const addCanvas = () => {
    setCanvasCount((count) => count + 1);
    setActiveCanvasIndex(canvasCount); // 새로 추가된 탭으로 자동 전환
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
        authorId={loaderData.profile_id}
        userId={loaderData.userId}
        joinCode={loaderData.joinCode}
      />

      <div
        id="tooltip"
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          display: "none",
          zIndex: 100,
        }}
      ></div>
      <div>
        {/* 탭 버튼 */}
        <CanvasTabButtons
          canvasCount={canvasCount}
          activeCanvasIndex={activeCanvasIndex}
          setActiveCanvasIndex={setActiveCanvasIndex}
          addCanvas={addCanvas}
        />
        <div className="relative w-[800px] h-[600px] border">
          {[...Array(canvasCount)].map((_, i) => (
            <div
              key={i}
              style={{
                display: activeCanvasIndex === i ? "block" : "none",
              }}
            >
              <canvas
                ref={(el) => {
                  if (el) canvasRefs.current[i] = el;
                }}
                width={800}
                height={600}
                style={{ border: "1px solid red" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
