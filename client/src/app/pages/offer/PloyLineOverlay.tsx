import React, { PureComponent } from "react";
import { CanvasOverlay } from "react-map-gl";

const settings = {
  color: "#08143bed",
  lineWidth: 3,
  renderWhileDragging: true,
};

export const PolylineOverlay: React.FC<{ points: unknown[] }> = ({
  points,
}) => {
  const _redraw = ({
    width,
    height,
    ctx,
    isDragging,
    project,
    unproject,
  }: any) => {
    const {
      color,
      lineWidth,
      renderWhileDragging = true,
    } = settings;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach((point: any) => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  };
  return <CanvasOverlay redraw={_redraw} />;
};
