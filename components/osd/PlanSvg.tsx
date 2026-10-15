import type { Ref } from "react";
import { FLOW_COLORS, type Flow } from "@/lib/example-layout";
import type { OsdLayout, OsdRoom } from "@/lib/osd/generate";

const PAD = 2.4;

function fill(room: OsdRoom) {
  if (room.pressurePa < 0) return "#ffe4e6";
  if (room.grade === "D") return "#dbeafe";
  return "#f1f5f9";
}

function stroke(room: OsdRoom) {
  if (room.pressurePa < 0) return "#be123c";
  if (room.grade === "D") return "#1d4ed8";
  return "#64748b";
}

function FlowLine({ flow }: { flow: Flow }) {
  const color = FLOW_COLORS[flow.kind];
  const points = flow.points.map(([x, z]) => `${x},${z}`).join(" ");
  const last = flow.points[flow.points.length - 1];
  const prev = flow.points[flow.points.length - 2];
  if (!last || !prev) return null;
  const angle = (Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180) / Math.PI;
  return (
    <g>
      <polyline points={points} fill="none" stroke={color} strokeWidth={0.18} strokeLinejoin="round" strokeLinecap="round" />
      <polygon
        points="-0.28,-0.16 0.28,0 -0.28,0.16"
        fill={color}
        transform={`translate(${last[0]} ${last[1]}) rotate(${angle})`}
      />
    </g>
  );
}

export function PlanSvg({ layout, svgRef }: { layout: OsdLayout; svgRef?: Ref<SVGSVGElement> }) {
  const width = layout.building.widthM + PAD * 2;
  const height = layout.building.depthM + PAD * 2;
  const scale = 16;

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width={width * scale}
      height={height * scale}
      viewBox={`${-PAD} ${-PAD} ${width} ${height}`}
      role="img"
      aria-label={layout.label}
      className="h-auto w-full rounded-xl border border-slate-200 bg-slate-50"
    >
      <rect x={-PAD} y={-PAD} width={width} height={height} fill="#f8fafc" />
      <text x={0} y={-1.15} fontSize={0.72} fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#0f172a" fontWeight={700}>
        {layout.label}
      </text>
      <text x={0} y={-0.35} fontSize={0.42} fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#475569">
        {`${layout.building.widthM} m × ${layout.building.depthM} m · norte hacia arriba · +x este`}
      </text>
      {layout.rooms.map((room) => (
        <g key={room.id}>
          <rect
            x={room.x}
            y={room.z}
            width={room.w}
            height={room.d}
            fill={fill(room)}
            stroke={stroke(room)}
            strokeWidth={0.12}
          />
          <text
            x={room.x + room.w / 2}
            y={room.z + room.d / 2 - 0.15}
            textAnchor="middle"
            fontSize={Math.min(0.62, room.w * 0.16)}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fill="#0f172a"
            fontWeight={650}
          >
            {room.shortEs}
          </text>
          <text
            x={room.x + room.w / 2}
            y={room.z + room.d / 2 + 0.55}
            textAnchor="middle"
            fontSize={0.38}
            fontFamily="ui-monospace, monospace"
            fill="#334155"
          >
            {`${room.grade === "D" ? "D" : "CNC"} · ${room.pressurePa} Pa · ${room.areaM2} m²`}
          </text>
        </g>
      ))}
      {layout.flows.map((flow) => (
        <FlowLine key={flow.id} flow={flow} />
      ))}
    </svg>
  );
}
