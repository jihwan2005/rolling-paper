// src/components/CanvasSection.tsx (또는 원하는 경로)

import React from "react";

interface CanvasSectionProps {
  canvasCount: number;
  activeCanvasIndex: number;
  canvasRefs: React.MutableRefObject<(HTMLCanvasElement | null)[]>;
}

const CanvasSection: React.FC<CanvasSectionProps> = ({
  canvasCount,
  activeCanvasIndex,
  canvasRefs,
}) => {
  return (
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
  );
};

export default CanvasSection;
