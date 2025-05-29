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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
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
  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-3xl">{loaderData.rolling_paper_title}</span>
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
      <div>
        {loaderData.uniqueAuthors.map((author) => (
          <span className="mr-2 text-lg">{author.username}</span>
        ))}
        님이 참여함
      </div>
    </div>
  );
}
