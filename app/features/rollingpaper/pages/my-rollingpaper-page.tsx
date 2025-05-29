import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/my-rollingpaper-page";
import {
  getRollingPaperByJoinCode,
  getRollingPaperImageNode,
  getRollingPaperTextNode,
} from "../data/queries";
import { Canvas, Textbox, FabricImage } from "fabric";
import { useEffect, useRef, useState } from "react";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const joinCode = params.joinCode;
  const userId = await getLoggedInUserId(client);
  const { rolling_paper_title, rolling_paper_id } =
    await getRollingPaperByJoinCode(client, {
      joinCode,
    });
  const textNodes = await getRollingPaperTextNode(client, {
    paperId: rolling_paper_id,
  });
  const imageNodes = await getRollingPaperImageNode(client, {
    paperId: rolling_paper_id,
  });
  const textAuthors = textNodes.map((node) => node.profiles);
  const imageAuthors = imageNodes.map((node) => node.profiles);

  // 2. 합치기
  const allAuthors = [...textAuthors, ...imageAuthors];

  // 3. 중복 제거 (예: profile_id 기준)
  const uniqueAuthorsMap = new Map<string, (typeof allAuthors)[number]>();
  for (const author of allAuthors) {
    uniqueAuthorsMap.set(author.username, author);
  }

  const uniqueAuthors = Array.from(uniqueAuthorsMap.values());
  return { rolling_paper_title, textNodes, imageNodes, userId, uniqueAuthors };
};

export default function MyRollingPaper({ loaderData }: Route.ComponentProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]); // 여러 개의 canvas
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [activeCanvasIndex, setActiveCanvasIndex] = useState<number>(0);
  const initialCanvasCount = Math.max(
    1, // 최소 1개의 캔버스는 항상 존재
    ...loaderData.textNodes.map((n) => n.canvas_index + 1), // textNodes 중 가장 큰 canvas_index + 1
    ...loaderData.imageNodes.map((n) => n.canvas_index + 1) // imageNodes 중 가장 큰 canvas_index + 1
  );
  const [canvasCount, setCanvasCount] = useState(initialCanvasCount);
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
  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-3xl">{loaderData.rolling_paper_title}</span>
      </div>
      <div>
        {/* 탭 버튼 */}
        <div className="flex space-x-2 mb-4">
          {[...Array(canvasCount)].map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCanvasIndex(i)}
              className={`px-4 py-2 rounded ${
                activeCanvasIndex === i
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              캔버스 {i + 1}
            </button>
          ))}
        </div>
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
        {loaderData.uniqueAuthors.map((author) => (
          <span className="mr-2 text-lg">{author.username}</span>
        ))}
        님이 참여함
      </div>
    </div>
  );
}
