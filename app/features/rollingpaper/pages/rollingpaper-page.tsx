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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [font, setFont] = useState("Arial");
  const [color, setColor] = useState("#000000");
  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    for (const node of loaderData.textNodes) {
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
        editable: node.profile_id === loaderData.userId, // 👈 내가 만든 것만 편집 가능
        selectable: node.profile_id === loaderData.userId, // 👈 내가 만든 것만 선택 가능
      });
      (customText as any).textNodeId = node.text_node_id;
      (customText as any).profile_id = node.profile_id;
      (customText as any).username = node.profiles.username;
      newCanvas.add(customText);
    }

    for (const node of loaderData.imageNodes) {
      // 이미지 URL이 존재해야 합니다
      if (!node.image_url) continue;

      // Fabric.js의 비동기 이미지 로드 방식
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

        // 추가 메타데이터 설정
        (img as any).imageNodeId = node.image_node_id;
        (img as any).profile_id = node.profile_id;
        (img as any).username = node.profiles?.username;

        newCanvas.add(img);
      });
    }

    const tooltip = document.getElementById("tooltip");

    newCanvas.on("mouse:over", (e) => {
      if (!tooltip || !e.pointer) return;
      const target = e.target as any;
      const evt = e.e as MouseEvent;
      if (
        target?.type === "textbox" &&
        target.profile_id !== loaderData.userId &&
        target.username
      ) {
        tooltip.style.left = evt.pageX + 10 + "px";
        tooltip.style.top = evt.pageY + 10 + "px";
        tooltip.innerText = `${target.username}님이 작성함`;
        tooltip.style.display = "block";
      } else if (
        target?.type === "image" &&
        target.profile_id !== loaderData.userId &&
        target.username
      ) {
        tooltip.style.left = evt.pageX + 10 + "px";
        tooltip.style.top = evt.pageY + 10 + "px";
        tooltip.innerText = `${target.username}님이 올림`;
        tooltip.style.display = "block";
      }
    });

    newCanvas.on("mouse:out", () => {
      if (tooltip) tooltip.style.display = "none";
    });
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);

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

    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", selectedColor);
      canvas.requestRenderAll();
    }
  };

  const handleAddText = () => {
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
    } else {
      return;
    }

    await fetch(`/rolling-paper/${loaderData.joinCode}`, {
      method: "POST",
      body: formData,
    });
  };

  const handleDeleteObject = async () => {
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

      <canvas ref={canvasRef} style={{ border: "1px solid red" }} />
    </div>
  );
}
