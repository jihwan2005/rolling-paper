// src/components/CanvasTooltip.tsx

import React from 'react';

const CanvasTooltip: React.FC = () => {
  return (
    <div
      id="tooltip"
      style={{
        position: "absolute",
        pointerEvents: "none", // 툴팁 위로 마우스 이벤트를 허용하지 않음
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        display: "none", // 초기에는 숨겨져 있습니다.
        zIndex: 100,
      }}
    ></div>
  );
};

export default CanvasTooltip;