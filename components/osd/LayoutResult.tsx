"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import { OSD_LABEL, viewerModelFromLayout, type OsdLayout } from "@/lib/osd/generate";
import { PlanSvg } from "@/components/osd/PlanSvg";

const CleanroomViewer = dynamic(() => import("@/components/three/CleanroomViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-[#0B1220] text-sm text-slate-300">
      Cargando el modelo 3D…
    </div>
  ),
});

async function svgToCanvas(svg: SVGSVGElement) {
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("No se pudo rasterizar el plano."));
      element.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(svg.width.baseVal.value * 2);
    canvas.height = Math.round(svg.height.baseVal.value * 2);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo crear el lienzo.");
    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function LayoutResult({ layout }: { layout: OsdLayout }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const model = useMemo(() => viewerModelFromLayout(layout), [layout]);
  const route = layout.inputs.route === "wet" ? "Granulación húmeda" : "Compresión directa";

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "layout-osd-1m.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (!svgRef.current) return;
    const canvas = await svgToCanvas(svgRef.current);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "layout-osd-1m.png";
    link.click();
  };

  const downloadPdf = async () => {
    if (!svgRef.current) return;
    const canvas = await svgToCanvas(svgRef.current);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
    pdf.setFontSize(16);
    pdf.text(OSD_LABEL, 12, 14);
    pdf.setFontSize(10);
    pdf.text(
      `${layout.building.widthM} × ${layout.building.depthM} m · ${route} · ${layout.sizing.batchesPerMonth} lotes/mes · ${layout.inputs.tabletWeightMg} mg`,
      12,
      21,
    );
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imageWidth = pageWidth - 24;
    const imageHeight = (imageWidth * canvas.height) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 12, 26, imageWidth, Math.min(imageHeight, 250));
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text(OSD_LABEL, 12, 16);
    pdf.setFontSize(9);
    let y = 24;
    for (const room of layout.rooms) {
      const equipment = room.equipment.map((item) => item.tag).join(", ") || "sin equipo de proceso";
      const line = `${room.nameEs} · ${room.areaM2} m² · ${room.grade === "D" ? "Grado D / ISO 8" : "CNC"} · ${room.pressurePa} Pa · ${equipment}`;
      const wrapped = pdf.splitTextToSize(line, 390);
      pdf.text(wrapped, 12, y);
      y += wrapped.length * 5 + 1.5;
      if (y > 270) {
        pdf.addPage();
        y = 16;
      }
    }
    pdf.save("layout-osd-1m.pdf");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>{layout.label}.</strong> No es un diseño de HVAC, ni una calificación, ni una aprobación regulatoria.
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Lotes / mes", String(layout.sizing.batchesPerMonth)],
          ["Núcleo / lote", `${layout.sizing.coreKgPerBatch} kg`],
          ["Recubierto / lote", `${layout.sizing.coatedKgPerBatch} kg`],
          ["Cuello de botella", `${layout.sizing.bottleneckStep} · ${layout.sizing.bottleneckHours} h`],
          ["Horas exigidas", String(layout.sizing.requiredHours)],
          ["Horas disponibles", String(layout.sizing.availableHours)],
          ["Vía", route],
          ["OEB", String(layout.inputs.oeb)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={downloadPng} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Descargar PNG
        </button>
        <button type="button" onClick={downloadPdf} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Descargar PDF
        </button>
        <button type="button" onClick={downloadJson} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink">
          Descargar JSON
        </button>
      </div>

      <div className="overflow-x-auto">
        <PlanSvg layout={layout} svgRef={svgRef} />
      </div>
      <ul className="flex flex-wrap gap-4 text-xs text-slate-600">
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Personal</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Material</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Residuos</li>
        <li>Azul: Grado D / ISO 8. Gris: CNC. Rojo suave: presión negativa.</li>
      </ul>

      <CleanroomViewer
        model={model}
        badge={layout.label}
        sizeLabel={`${layout.building.widthM} × ${layout.building.depthM} m`}
        footnote="Personal en cian, material en ámbar, residuos en rojo. Arrastre para orbitar. Layout conceptual, requiere revisión experta."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Sala</th>
              <th className="px-3 py-2">m²</th>
              <th className="px-3 py-2">Grado</th>
              <th className="px-3 py-2">Pa</th>
              <th className="px-3 py-2">Equipo</th>
            </tr>
          </thead>
          <tbody>
            {layout.rooms.map((room) => (
              <tr key={room.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{room.nameEs}</td>
                <td className="px-3 py-2">{room.areaM2}</td>
                <td className="px-3 py-2">{room.grade === "D" ? "D / ISO 8" : "CNC"}</td>
                <td className="px-3 py-2">{room.pressurePa}</td>
                <td className="px-3 py-2 text-slate-600">
                  {room.equipment.length
                    ? room.equipment.map((item) => `${item.tag} ${item.nameEs} ×${item.qty}`).join("; ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
