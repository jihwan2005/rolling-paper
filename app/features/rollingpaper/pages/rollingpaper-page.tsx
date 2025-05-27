import { useEffect, useRef, useState } from "react";
import { Canvas, Textbox } from "fabric";
import type { Route } from "./+types/rollingpaper-page";
import { makeSSRClient } from "~/supa-client";
import {
  getRollingPaperByJoinCode,
  getRollingPaperTextNode,
} from "../data/queries";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  createTextNode,
  deleteTextNode,
  updateTextNode,
} from "../data/mutations";
import { ImageIcon } from "lucide-react";

interface CustomTextbox extends Textbox {
  textNodeId?: string;
  profile_id?: string;
  username?: string;
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  if (request.method === "POST") {
    const formData = await request.formData();
    const { rolling_paper_id } = await getRollingPaperByJoinCode(client, {
      joinCode: params.joinCode,
    });
    const userId = await getLoggedInUserId(client);
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
      });
    }
  }

  if (request.method === "DELETE") {
    const formData = await request.formData();
    const textNodeId = Number(formData.get("textNodeId"));
    await deleteTextNode(client, {
      nodeId: textNodeId,
    });
  }
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const joinCode = params.joinCode;
  const { rolling_paper_title } = await getRollingPaperByJoinCode(client, {
    joinCode,
  });
  const { rolling_paper_id } = await getRollingPaperByJoinCode(client, {
    joinCode,
  });
  const textNodes = await getRollingPaperTextNode(client, {
    paperId: rolling_paper_id,
  });
  return { joinCode, rolling_paper_title, textNodes, userId };
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
      } else {
        tooltip.style.display = "none";
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

  const handleSubmit = async () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;

    const textbox = obj as CustomTextbox;

    const formData = new FormData();
    formData.append("textNodeId", String(textbox.textNodeId || ""));
    formData.append("text", textbox.text || "");
    formData.append("fontFamily", textbox.fontFamily || "");
    formData.append("fontSize", String(textbox.fontSize));
    formData.append("fill", textbox.fill?.toString() || "");

    formData.append("left", String(textbox.left));
    formData.append("top", String(textbox.top));
    formData.append("scaleX", String(textbox.scaleX));
    formData.append("scaleY", String(textbox.scaleY));
    formData.append("angle", String(textbox.angle));

    await fetch(`/rolling-paper/${loaderData.joinCode}`, {
      method: "POST",
      body: formData,
    });
  };

  const handleDeleteText = async () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "textbox") {
      // @ts-ignore
      const textNodeId = activeObject.textNodeId;

      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      if (textNodeId) {
        const formData = new FormData();
        formData.append("textNodeId", String(textNodeId));
        await fetch(`/rolling-paper/${loaderData.joinCode}`, {
          method: "DELETE",
          body: formData,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-3xl">{loaderData.rolling_paper_title}</span>
        <span className="text-xl text-gray-400">{loaderData.joinCode}</span>
      </div>
      <div className="flex gap-4">
        {/* 폰트 선택 */}
        <label>
          Font:
          <select
            value={font}
            onChange={handleFontChange}
            className="ml-2 p-1 border rounded"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
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
          className="p-2 bg-green-500 text-white rounded"
        >
          추가하기
        </button>
        <button
          onClick={handleDeleteText}
          className="p-2 bg-red-500 text-white rounded"
        >
          삭제하기
        </button>
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          저장하기
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="p-2 bg-yellow-500 text-white rounded cursor-pointer"
        >
          <ImageIcon />
        </label>
      </div>
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
