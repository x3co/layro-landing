export type IsoClass = "ISO 5" | "ISO 7" | "ISO 8" | "CNC";
export type Edge = "n" | "s" | "e" | "w";

export type Door = {
  edge: Edge;
  /** Center of the opening along the edge, in meters from the start of that edge. */
  offset: number;
  width: number;
};

export type Room = {
  id: string;
  nameEs: string;
  nameEn: string;
  shortEs: string;
  shortEn: string;
  iso: IsoClass;
  /** Short grade tag drawn in the 3D view. Example rooms keep using `iso`. */
  badge?: string;
  x: number;
  z: number;
  w: number;
  d: number;
  doors: Door[];
};

export type FlowId = "personnel" | "material" | "waste";

export type Flow = {
  id: string;
  kind: FlowId;
  points: [number, number][];
};

export const WALL_HEIGHT = 1.05;
export const WALL_THICKNESS = 0.16;
export const BUILDING = { width: 30, depth: 12 };
export const BUILDING_CENTER: [number, number, number] = [15, 0, 6];

export const ISO_COLORS: Record<IsoClass, string> = {
  "ISO 5": "#0F766E",
  "ISO 7": "#1D4ED8",
  "ISO 8": "#475569",
  CNC: "#78716C",
};

export const FLOW_COLORS: Record<FlowId, string> = {
  personnel: "#22D3EE",
  material: "#FBBF24",
  waste: "#F43F5E",
};

/**
 * Didactic fill-finish suite. Invented for the public demo.
 * Coordinates are meters. +x east, +z south.
 */
export const EXAMPLE_ROOMS: Room[] = [
  {
    id: "pasillo",
    nameEs: "Pasillo limpio",
    nameEn: "Clean corridor",
    shortEs: "Pasillo",
    shortEn: "Corridor",
    iso: "ISO 8",
    x: 0,
    z: 0,
    w: 24,
    d: 4,
    doors: [
      { edge: "e", offset: 2, width: 1.4 },
      { edge: "s", offset: 2.5, width: 1.1 },
      { edge: "s", offset: 6.5, width: 1.1 },
      { edge: "s", offset: 11, width: 1.2 },
      { edge: "s", offset: 17, width: 1.2 },
      { edge: "s", offset: 22, width: 1.2 },
    ],
  },
  {
    id: "mal",
    nameEs: "Esclusa de material",
    nameEn: "Material airlock",
    shortEs: "E. material",
    shortEn: "MAL",
    iso: "ISO 8",
    x: 24,
    z: 0,
    w: 6,
    d: 4,
    doors: [
      { edge: "w", offset: 2, width: 1.4 },
      { edge: "e", offset: 2, width: 1.4 },
      { edge: "s", offset: 1, width: 1.1 },
      { edge: "s", offset: 4, width: 1.1 },
    ],
  },
  {
    id: "vestuario",
    nameEs: "Vestuario",
    nameEn: "Gowning",
    shortEs: "Vestuario",
    shortEn: "Gowning",
    iso: "ISO 8",
    x: 0,
    z: 4,
    w: 5,
    d: 8,
    doors: [
      { edge: "n", offset: 2.5, width: 1.1 },
      { edge: "w", offset: 4, width: 1.2 },
      { edge: "e", offset: 4, width: 1.1 },
    ],
  },
  {
    id: "pal",
    nameEs: "Esclusa de personal",
    nameEn: "Personnel airlock",
    shortEs: "E. personal",
    shortEn: "PAL",
    iso: "ISO 7",
    x: 5,
    z: 4,
    w: 3,
    d: 8,
    doors: [
      { edge: "n", offset: 1.5, width: 1.1 },
      { edge: "w", offset: 4, width: 1.1 },
      { edge: "e", offset: 4, width: 1.1 },
    ],
  },
  {
    id: "pesada",
    nameEs: "Pesada",
    nameEn: "Weighing",
    shortEs: "Pesada",
    shortEn: "Weighing",
    iso: "ISO 7",
    x: 8,
    z: 4,
    w: 6,
    d: 8,
    doors: [
      { edge: "n", offset: 3, width: 1.2 },
      { edge: "w", offset: 4, width: 1.1 },
      { edge: "e", offset: 4, width: 1.2 },
    ],
  },
  {
    id: "preparacion",
    nameEs: "Preparación",
    nameEn: "Preparation",
    shortEs: "Preparación",
    shortEn: "Prep",
    iso: "ISO 7",
    x: 14,
    z: 4,
    w: 6,
    d: 8,
    doors: [
      { edge: "n", offset: 3, width: 1.2 },
      { edge: "w", offset: 4, width: 1.2 },
      { edge: "e", offset: 4, width: 1.2 },
    ],
  },
  {
    id: "llenado",
    nameEs: "Llenado",
    nameEn: "Filling",
    shortEs: "Llenado",
    shortEn: "Filling",
    iso: "ISO 5",
    x: 20,
    z: 4,
    w: 6,
    d: 8,
    doors: [
      { edge: "n", offset: 2, width: 1.2 },
      { edge: "n", offset: 5, width: 1.1 },
      { edge: "w", offset: 4, width: 1.2 },
      { edge: "e", offset: 4, width: 1.2 },
    ],
  },
  {
    id: "acondicionado",
    nameEs: "Acondicionado",
    nameEn: "Packaging",
    shortEs: "Acond.",
    shortEn: "Pack",
    iso: "ISO 8",
    x: 26,
    z: 4,
    w: 4,
    d: 8,
    doors: [
      { edge: "n", offset: 2, width: 1.1 },
      { edge: "w", offset: 4, width: 1.2 },
    ],
  },
];

export const EXAMPLE_FLOWS: Flow[] = [
  {
    id: "personnel-main",
    kind: "personnel",
    points: [
      [-1.4, 8],
      [2.5, 8],
      [6.5, 8],
      [6.5, 2.7],
      [22, 2.7],
      [22, 7.2],
    ],
  },
  {
    id: "personnel-weigh",
    kind: "personnel",
    points: [
      [11, 2.7],
      [11, 7.2],
    ],
  },
  {
    id: "personnel-prep",
    kind: "personnel",
    points: [
      [17, 2.7],
      [17, 7.2],
    ],
  },
  {
    id: "material-main",
    kind: "material",
    points: [
      [31.4, 2],
      [27, 1.5],
      [11, 1.5],
      [11, 8.8],
      [17, 8.8],
      [23, 8.8],
      [28, 8.8],
      [28, 1.6],
    ],
  },
];

export function wallRuns(length: number, doors: Door[]) {
  const gaps = doors
    .map((door) => ({
      start: Math.max(0, door.offset - door.width / 2),
      end: Math.min(length, door.offset + door.width / 2),
    }))
    .filter((gap) => gap.end - gap.start > 0.02)
    .sort((a, b) => a.start - b.start);

  const runs: { start: number; end: number }[] = [];
  let cursor = 0;
  for (const gap of gaps) {
    if (gap.start - cursor > 0.04) runs.push({ start: cursor, end: gap.start });
    cursor = Math.max(cursor, gap.end);
  }
  if (length - cursor > 0.04) runs.push({ start: cursor, end: length });
  return runs;
}

export type WallMesh = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
};

export function buildWalls(rooms: Room[]): WallMesh[] {
  const t = WALL_THICKNESS;
  const h = WALL_HEIGHT;
  const y = h / 2 + 0.06;
  const meshes: WallMesh[] = [];

  for (const room of rooms) {
    const grouped: Record<Edge, Door[]> = { n: [], s: [], e: [], w: [] };
    for (const door of room.doors) grouped[door.edge].push(door);

    for (const run of wallRuns(room.w, grouped.n)) {
      meshes.push({
        id: `${room.id}-n-${run.start.toFixed(2)}`,
        position: [room.x + (run.start + run.end) / 2, y, room.z + t / 2],
        size: [run.end - run.start, h, t],
      });
    }
    for (const run of wallRuns(room.w, grouped.s)) {
      meshes.push({
        id: `${room.id}-s-${run.start.toFixed(2)}`,
        position: [room.x + (run.start + run.end) / 2, y, room.z + room.d - t / 2],
        size: [run.end - run.start, h, t],
      });
    }
    for (const run of wallRuns(room.d, grouped.w)) {
      meshes.push({
        id: `${room.id}-w-${run.start.toFixed(2)}`,
        position: [room.x + t / 2, y, room.z + (run.start + run.end) / 2],
        size: [t, h, run.end - run.start],
      });
    }
    for (const run of wallRuns(room.d, grouped.e)) {
      meshes.push({
        id: `${room.id}-e-${run.start.toFixed(2)}`,
        position: [room.x + room.w - t / 2, y, room.z + (run.start + run.end) / 2],
        size: [t, h, run.end - run.start],
      });
    }
  }

  return meshes;
}

export const EXAMPLE_WALLS = buildWalls(EXAMPLE_ROOMS);

export type LayoutModel = {
  rooms: Room[];
  walls: WallMesh[];
  flows: Flow[];
  building: { width: number; depth: number };
  center: [number, number, number];
};

export const EXAMPLE_MODEL: LayoutModel = {
  rooms: EXAMPLE_ROOMS,
  walls: EXAMPLE_WALLS,
  flows: EXAMPLE_FLOWS,
  building: BUILDING,
  center: BUILDING_CENTER,
};

export function roomLabel(room: Room, locale: "es" | "en") {
  return locale === "en" ? room.nameEn : room.nameEs;
}

export function roomShortLabel(room: Room, locale: "es" | "en") {
  return locale === "en" ? room.shortEn : room.shortEs;
}
