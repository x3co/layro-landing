"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Grid, Html, OrbitControls } from "@react-three/drei";
import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import {
  BUILDING,
  BUILDING_CENTER,
  EXAMPLE_FLOWS,
  EXAMPLE_ROOMS,
  EXAMPLE_WALLS,
  FLOW_COLORS,
  ISO_COLORS,
  type Flow,
} from "@/lib/example-layout";
import { useLocale } from "@/lib/locale";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class CanvasBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function FlowPath({ flow, y, color }: { flow: Flow; y: number; color: string }) {
  const segments = useMemo(() => {
    const list: {
      position: [number, number, number];
      quaternion: [number, number, number, number];
      length: number;
      head: boolean;
      headPosition: [number, number, number];
    }[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (let index = 0; index < flow.points.length - 1; index += 1) {
      const [ax, az] = flow.points[index];
      const [bx, bz] = flow.points[index + 1];
      const start = new THREE.Vector3(ax, y, az);
      const end = new THREE.Vector3(bx, y, bz);
      const direction = end.clone().sub(start);
      const length = direction.length();
      if (length < 0.05) continue;
      const isHead = index === flow.points.length - 2;
      const cone = 0.42;
      const shaft = isHead ? Math.max(length - cone, 0.05) : length;
      const unit = direction.clone().normalize();
      const mid = start.clone().add(unit.clone().multiplyScalar(shaft / 2));
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, unit);
      const headPosition = end.clone().sub(unit.clone().multiplyScalar(cone / 2));
      list.push({
        position: mid.toArray() as [number, number, number],
        quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
        length: shaft,
        head: isHead,
        headPosition: headPosition.toArray() as [number, number, number],
      });
    }
    return list;
  }, [flow, y]);

  return (
    <group>
      {segments.map((segment, index) => (
        <group key={`${flow.id}-${index}`}>
          <mesh position={segment.position} quaternion={segment.quaternion}>
            <cylinderGeometry args={[0.055, 0.055, segment.length, 8]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          {segment.head ? (
            <mesh position={segment.headPosition} quaternion={segment.quaternion}>
              <coneGeometry args={[0.16, 0.42, 10]} />
              <meshStandardMaterial color={color} roughness={0.35} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

function CameraRig({ preset, nonce }: { preset: "iso" | "top"; nonce: number }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const [x, , z] = BUILDING_CENTER;
    if (preset === "top") camera.position.set(x, 30, z + 0.02);
    else camera.position.set(22, 16, 22);
    camera.lookAt(x, 0, z);
    const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
    orbit?.target?.set(x, 0, z);
    orbit?.update?.();
  }, [preset, nonce, camera, controls]);

  return null;
}

function Scene({ locale }: { locale: "es" | "en" }) {
  return (
    <>
      <color attach="background" args={["#0B1220"]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={["#e0f2fe", "#0f172a", 0.4]} />
      <directionalLight position={[14, 22, 10]} intensity={1.2} />
      <directionalLight position={[-10, 8, -4]} intensity={0.3} color="#bfdbfe" />
      <Grid
        args={[50, 30]}
        position={[BUILDING_CENTER[0], 0, BUILDING_CENTER[2]]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={48}
        infiniteGrid
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[BUILDING.width / 2, 0.012, BUILDING.depth / 2]}>
        <planeGeometry args={[BUILDING.width + 0.4, BUILDING.depth + 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {EXAMPLE_ROOMS.map((room) => (
        <mesh key={room.id} position={[room.x + room.w / 2, 0.08, room.z + room.d / 2]}>
          <boxGeometry args={[Math.max(room.w - 0.12, 0.2), 0.08, Math.max(room.d - 0.12, 0.2)]} />
          <meshStandardMaterial color={ISO_COLORS[room.iso]} roughness={0.7} />
        </mesh>
      ))}
      {EXAMPLE_WALLS.map((wall) => (
        <mesh key={wall.id} position={wall.position}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.88} />
        </mesh>
      ))}
      {EXAMPLE_FLOWS.map((flow) => (
        <FlowPath
          key={flow.id}
          flow={flow}
          y={flow.kind === "personnel" ? 0.48 : 0.82}
          color={FLOW_COLORS[flow.kind]}
        />
      ))}
      {EXAMPLE_ROOMS.map((room) => (
        <Html
          key={`${room.id}-label`}
          position={[room.x + room.w / 2, 1.35, room.z + room.d / 2]}
          center
          distanceFactor={16}
          zIndexRange={[20, 0]}
          pointerEvents="none"
        >
          <div className="select-none whitespace-nowrap rounded bg-slate-950/85 px-1.5 py-1 text-center text-white">
            <div className="text-[11px] font-semibold leading-none">
              {locale === "en" ? room.shortEn : room.shortEs}
            </div>
            <div className="mt-1 font-mono text-[10px] leading-none text-slate-200">{room.iso}</div>
          </div>
        </Html>
      ))}
    </>
  );
}

export default function CleanroomViewer() {
  const { locale, t } = useLocale();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [preset, setPreset] = useState<"iso" | "top">("iso");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  const choose = (next: "iso" | "top") => {
    setPreset(next);
    setNonce((value) => value + 1);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-950">
            {t.demo.badge}
          </span>
          <span className="font-mono text-xs text-slate-300">{t.demo.size}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={preset === "iso"}
            onClick={() => choose("iso")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              preset === "iso" ? "bg-white text-ink" : "text-slate-300 hover:text-white"
            }`}
          >
            {t.demo.orbit}
          </button>
          <button
            type="button"
            aria-pressed={preset === "top"}
            onClick={() => choose("top")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              preset === "top" ? "bg-white text-ink" : "text-slate-300 hover:text-white"
            }`}
          >
            {t.demo.top}
          </button>
        </div>
      </div>

      {webgl === false ? (
        <p className="px-4 py-16 text-sm text-slate-300">{t.demo.fallback}</p>
      ) : (
        <CanvasBoundary fallback={<p className="px-4 py-16 text-sm text-slate-300">{t.demo.fallback}</p>}>
          <div className="h-[min(70vh,640px)] min-h-[420px]" role="img" aria-label={t.demo.aria}>
            {webgl ? (
              <Canvas camera={{ position: [22, 16, 22], fov: 40, near: 0.1, far: 220 }} dpr={[1, 1.6]}>
                <Scene locale={locale} />
                <OrbitControls
                  makeDefault
                  target={BUILDING_CENTER}
                  enableDamping
                  maxPolarAngle={Math.PI / 2.08}
                  minDistance={7}
                  maxDistance={50}
                />
                <CameraRig preset={preset} nonce={nonce} />
              </Canvas>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">{t.demo.loading}</div>
            )}
          </div>
        </CanvasBoundary>
      )}
      <p className="px-4 py-3 text-xs text-slate-400">{t.demo.drag}</p>
    </div>
  );
}
