import React from "react";

interface CanvasTabButtonsProps {
  canvasCount: number;
  activeCanvasIndex: number;
  setActiveCanvasIndex: (index: number) => void;
  addCanvas: () => void;
}

const CanvasTabButtons: React.FC<CanvasTabButtonsProps> = ({
  canvasCount,
  activeCanvasIndex,
  setActiveCanvasIndex,
  addCanvas,
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      {[...Array(canvasCount)].map((_, i) => (
        <button
          key={i}
          onClick={() => setActiveCanvasIndex(i)}
          className={`px-4 py-2 rounded ${
            activeCanvasIndex === i ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          캔버스 {i + 1}
        </button>
      ))}
      <button
        onClick={addCanvas}
        className="px-4 py-2 rounded border hover:bg-gray-200"
        aria-label="Add Canvas"
      >
        +
      </button>
    </div>
  );
};

export default CanvasTabButtons;
