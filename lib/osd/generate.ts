import { buildWalls, type Door, type Flow, type Room } from "../example-layout";
import {
  ASSUMPTIONS,
  CONCEPTUAL_LABEL,
  DOOR_LINKS,
  EXTERNAL_DOORS,
  PREBLEND_ROOM,
  ROOM_SEEDS,
  type RoomSeed,
} from "./assumptions";

export const OSD_LABEL = CONCEPTUAL_LABEL;

export type OsdRoute = "wet" | "direct-compression";

export type OsdInputs = {
  dosageForm: string;
  capacityPerMonth: number;
  shiftsPerDay: number;
  workingDaysPerMonth: number;
  tabletWeightMg: number;
  route: OsdRoute;
  oeb: number;
  grade: string;
  footprintWidthM: number | null;
  footprintDepthM: number | null;
};

export const DEFAULT_INPUTS: OsdInputs = {
  dosageForm: ASSUMPTIONS.dosageForm,
  capacityPerMonth: ASSUMPTIONS.capacityTabletsPerMonth,
  shiftsPerDay: 1,
  workingDaysPerMonth: 20,
  tabletWeightMg: 400,
  route: "wet",
  oeb: 1,
  grade: "D",
  footprintWidthM: null,
  footprintDepthM: null,
};

export type EquipmentItem = {
  tag: string;
  nameEs: string;
  qty: number;
  basis: string;
};

export type OsdRoom = Room & {
  areaM2: number;
  grade: "D" | "CNC";
  pressurePa: number;
  badge: string;
  equipment: EquipmentItem[];
};

export type SizingStep = { id: string; nameEs: string; hours: number };

export type OsdSizing = {
  batchSizeTablets: number;
  batchesPerMonth: number;
  coreKgPerBatch: number;
  coatedKgPerBatch: number;
  steps: SizingStep[];
  bottleneckStep: string;
  bottleneckHours: number;
  requiredHours: number;
  availableHours: number;
  productiveHoursPerShift: number;
  coaterQty: number;
};

export type OsdLayout = {
  label: typeof OSD_LABEL;
  scenarioId: string;
  inputs: OsdInputs;
  building: { widthM: number; depthM: number; grossAreaM2: number };
  sizing: OsdSizing;
  rooms: OsdRoom[];
  flows: Flow[];
};

export class ScopeError extends Error {
  constructor(detail: string) {
    super(`Fuera de alcance de esta versión (v2): ${detail}`);
    this.name = "ScopeError";
  }
}

function v2(detail: string): never {
  throw new ScopeError(detail);
}

function asRecord(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    v2("el cuerpo de parámetros no es válido.");
  }
  return input as Record<string, unknown>;
}

function requiredNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    v2(`«${key}» tiene que ser un número.`);
  }
  return value;
}

function optionalFootprint(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    v2(`«${key}» tiene que ser un número o quedarse vacío.`);
  }
  return value;
}

export function parseInputs(input: unknown): OsdInputs {
  const source = asRecord(input);
  const dosageForm = source.dosageForm;
  if (dosageForm !== ASSUMPTIONS.dosageForm) {
    v2("la forma farmacéutica de este escenario es comprimido recubierto (pelicular).");
  }
  const capacityPerMonth = requiredNumber(source, "capacityPerMonth");
  if (capacityPerMonth !== ASSUMPTIONS.capacityTabletsPerMonth) {
    v2("la capacidad de este escenario es exactamente 1.000.000 comprimidos/mes.");
  }
  const shiftsPerDay = requiredNumber(source, "shiftsPerDay");
  if (!Number.isInteger(shiftsPerDay) || shiftsPerDay < ASSUMPTIONS.shiftsMin || shiftsPerDay > ASSUMPTIONS.shiftsMax) {
    v2("los turnos por día de este escenario son 1 o 2.");
  }
  const workingDaysPerMonth = requiredNumber(source, "workingDaysPerMonth");
  if (
    !Number.isInteger(workingDaysPerMonth) ||
    workingDaysPerMonth < ASSUMPTIONS.daysMin ||
    workingDaysPerMonth > ASSUMPTIONS.daysMax
  ) {
    v2("los días laborables por mes de este escenario van de 18 a 23.");
  }
  const tabletWeightMg = requiredNumber(source, "tabletWeightMg");
  if (tabletWeightMg < ASSUMPTIONS.tabletWeightMinMg || tabletWeightMg > ASSUMPTIONS.tabletWeightMaxMg) {
    v2("el peso del comprimido de este escenario está entre 100 y 800 mg.");
  }
  const route = source.route;
  if (route !== "wet" && route !== "direct-compression") {
    v2("la vía de fabricación es granulación húmeda o compresión directa.");
  }
  const oeb = requiredNumber(source, "oeb");
  if (!Number.isInteger(oeb) || oeb < ASSUMPTIONS.oebMin || oeb > ASSUMPTIONS.oebMax) {
    v2("OEB 4 o superior, o un valor fuera de 1 a 3, no entra en este escenario.");
  }
  const grade = source.grade;
  if (grade !== ASSUMPTIONS.grade) {
    v2("el grado de este escenario es D (ISO 8) en las salas de proceso.");
  }
  const footprintWidthM = optionalFootprint(source, "footprintWidthM");
  const footprintDepthM = optionalFootprint(source, "footprintDepthM");
  if ((footprintWidthM === null) !== (footprintDepthM === null)) {
    v2("indique ancho y fondo de la huella, o deje ambos vacíos.");
  }
  return {
    dosageForm,
    capacityPerMonth,
    shiftsPerDay,
    workingDaysPerMonth,
    tabletWeightMg,
    route,
    oeb,
    grade,
    footprintWidthM,
    footprintDepthM,
  };
}

export function compressionHours(batchSize: number): number {
  return ASSUMPTIONS.cycles.compressionSetupH + batchSize / ASSUMPTIONS.cycles.compressionRateTabPerH;
}

export function sizingFor(inputs: OsdInputs): OsdSizing {
  const batchSizeTablets = ASSUMPTIONS.batchSizeTablets;
  const batchesPerMonth = ASSUMPTIONS.capacityTabletsPerMonth / batchSizeTablets;
  const coreKgPerBatch = (batchSizeTablets * inputs.tabletWeightMg) / 1_000_000;
  const coatedKgPerBatch = coreKgPerBatch * (1 + ASSUMPTIONS.coatingWeightGain);
  const coaterQty = coatedKgPerBatch <= ASSUMPTIONS.coaterCapacityKg ? 1 : Math.ceil(coatedKgPerBatch / ASSUMPTIONS.coaterCapacityKg);
  if (coaterQty !== 1) {
    v2("el lote recubierto no cabe en un solo bombo de la capacidad supuesta. Habría que cambiar el equipo o el tamaño de lote.");
  }

  const wet = inputs.route === "wet";
  const steps: SizingStep[] = [
    { id: "pesada", nameEs: "Dispensación", hours: ASSUMPTIONS.cycles.dispensingH },
    wet
      ? {
          id: "granulacion",
          nameEs: "Granulación (alta cizalla + lecho fluido, en serie)",
          hours: ASSUMPTIONS.cycles.highShearH + ASSUMPTIONS.cycles.fluidBedH,
        }
      : { id: "premezcla", nameEs: "Premezcla en contenedor", hours: ASSUMPTIONS.cycles.preBlendDcH },
    { id: "molienda", nameEs: "Molienda y tamizado", hours: ASSUMPTIONS.cycles.millingH },
    { id: "mezcla", nameEs: "Mezcla final IBC", hours: ASSUMPTIONS.cycles.finalBlendH },
    { id: "compresion", nameEs: "Compresión", hours: compressionHours(batchSizeTablets) },
    { id: "recubrimiento", nameEs: "Recubrimiento", hours: ASSUMPTIONS.cycles.coatingH },
    { id: "blister", nameEs: "Blíster", hours: ASSUMPTIONS.cycles.blisterH },
  ];
  const bottleneck = steps.reduce((max, step) => (step.hours > max.hours ? step : max), steps[0]);
  const requiredHours = bottleneck.hours * batchesPerMonth;
  const availableHours = inputs.shiftsPerDay * ASSUMPTIONS.productiveHoursPerShift * inputs.workingDaysPerMonth;
  if (requiredHours > availableHours) {
    v2(
      "el tiempo de ocupación del cuello de botella supera las horas disponibles. Haría falta otro turno, fuera del rango, o una segunda línea.",
    );
  }
  return {
    batchSizeTablets,
    batchesPerMonth,
    coreKgPerBatch: round(coreKgPerBatch, 2),
    coatedKgPerBatch: round(coatedKgPerBatch, 2),
    steps: steps.map((step) => ({ ...step, hours: round(step.hours, 2) })),
    bottleneckStep: bottleneck.nameEs,
    bottleneckHours: round(bottleneck.hours, 2),
    requiredHours: round(requiredHours, 2),
    availableHours: round(availableHours, 2),
    productiveHoursPerShift: ASSUMPTIONS.productiveHoursPerShift,
    coaterQty,
  };
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function processRoomId(route: OsdRoute) {
  return route === "wet" ? "granulacion" : "premezcla";
}

function seedsFor(route: OsdRoute): RoomSeed[] {
  if (route === "wet") return ROOM_SEEDS.map((seed) => ({ ...seed }));
  return ROOM_SEEDS.map((seed) =>
    seed.id === "granulacion" ? { ...seed, ...PREBLEND_ROOM, containmentSensitive: true } : { ...seed },
  );
}

function pressureFor(seed: RoomSeed, oeb: number) {
  if (seed.containmentSensitive && oeb >= 3) return ASSUMPTIONS.pressurePa.containment;
  return seed.pressurePa;
}

function overlap1d(a0: number, a1: number, b0: number, b1: number) {
  const start = Math.max(a0, b0);
  const end = Math.min(a1, b1);
  if (end - start <= 0.9) return null;
  return { start, end, mid: (start + end) / 2 };
}

function addSharedDoor(rooms: OsdRoom[], aId: string, bId: string, width = 1.2) {
  const a = rooms.find((room) => room.id === aId);
  const b = rooms.find((room) => room.id === bId);
  if (!a || !b) {
    throw new Error(`Puerta ${aId}–${bId}: falta una sala.`);
  }
  const tol = 0.08;
  const touchEast = Math.abs(a.x + a.w - b.x) < tol;
  const touchWest = Math.abs(b.x + b.w - a.x) < tol;
  if (touchEast || touchWest) {
    const span = overlap1d(a.z, a.z + a.d, b.z, b.z + b.d);
    if (!span) throw new Error(`Puerta ${aId}–${bId}: no hay solape vertical.`);
    const door = Math.min(width, span.end - span.start - 0.12);
    pushDoor(a, { edge: touchEast ? "e" : "w", offset: round(span.mid - a.z, 3), width: round(door, 3) });
    pushDoor(b, { edge: touchEast ? "w" : "e", offset: round(span.mid - b.z, 3), width: round(door, 3) });
    return;
  }
  const touchSouth = Math.abs(a.z + a.d - b.z) < tol;
  const touchNorth = Math.abs(b.z + b.d - a.z) < tol;
  if (touchSouth || touchNorth) {
    const span = overlap1d(a.x, a.x + a.w, b.x, b.x + b.w);
    if (!span) throw new Error(`Puerta ${aId}–${bId}: no hay solape horizontal.`);
    const door = Math.min(width, span.end - span.start - 0.12);
    pushDoor(a, { edge: touchSouth ? "s" : "n", offset: round(span.mid - a.x, 3), width: round(door, 3) });
    pushDoor(b, { edge: touchSouth ? "n" : "s", offset: round(span.mid - b.x, 3), width: round(door, 3) });
    return;
  }
  throw new Error(`Puerta ${aId}–${bId}: las salas no comparten un lado.`);
}

function pushDoor(room: OsdRoom, door: Door) {
  room.doors.push(door);
}

function equipmentFor(id: string, sizing: OsdSizing): EquipmentItem[] {
  const lot = `${sizing.coreKgPerBatch} kg de núcleos por lote de ${sizing.batchSizeTablets.toLocaleString("es-ES")} comprimidos`;
  const coated = `${sizing.coatedKgPerBatch} kg recubiertos (ganancia ${ASSUMPTIONS.coatingWeightGain * 100} %)`;
  switch (id) {
    case "muestreo":
      return [{ tag: "SM-01", nameEs: "Cabina de muestreo", qty: 1, basis: "Una cabina para el muestreo de materias primas de este escenario." }];
    case "pesada":
      return [{
        tag: "WB-01",
        nameEs: "Cabina de pesada (flujo descendente)",
        qty: 1,
        basis: `${lot}. Ciclo supuesto ${ASSUMPTIONS.cycles.dispensingH} h.`,
      }];
    case "granulacion":
      return [
        { tag: "HSG-01", nameEs: "Granulador de alta cizalla", qty: 1, basis: `${lot}. Ciclo supuesto ${ASSUMPTIONS.cycles.highShearH} h.` },
        { tag: "FBD-01", nameEs: "Secador de lecho fluido", qty: 1, basis: `${lot}. Ciclo supuesto ${ASSUMPTIONS.cycles.fluidBedH} h, en serie con el granulador.` },
      ];
    case "premezcla":
      return [{
        tag: "BB-01",
        nameEs: "Mezclador de contenedores para premezcla",
        qty: 1,
        basis: `${lot}. Compresión directa, ciclo supuesto ${ASSUMPTIONS.cycles.preBlendDcH} h. No hay granulador ni lecho fluido.`,
      }];
    case "molienda":
      return [{ tag: "ML-01", nameEs: "Molino cónico y tamiz", qty: 1, basis: `Ciclo supuesto ${ASSUMPTIONS.cycles.millingH} h por lote.` }];
    case "mezcla":
      return [{ tag: "IBC-01", nameEs: "Mezclador de contenedores IBC", qty: 1, basis: `Mezcla final. Ciclo supuesto ${ASSUMPTIONS.cycles.finalBlendH} h por lote.` }];
    case "compresion":
      return [{
        tag: "CP-01",
        nameEs: "Comprimidora rotativa",
        qty: 1,
        basis: `${ASSUMPTIONS.cycles.compressionRateTabPerH.toLocaleString("es-ES")} comprimidos/h más ${ASSUMPTIONS.cycles.compressionSetupH} h de preparación.`,
      }];
    case "recubrimiento":
      return [{
        tag: "PC-01",
        nameEs: "Bombo perforado de recubrimiento",
        qty: sizing.coaterQty,
        basis: `${coated}. Capacidad supuesta del bombo ${ASSUMPTIONS.coaterCapacityKg} kg por carga. Ciclo ${ASSUMPTIONS.cycles.coatingH} h.`,
      }];
    case "solucion":
      return [{ tag: "VS-01", nameEs: "Reactor de preparación de solución de recubrimiento", qty: 1, basis: "Un recipiente para la solución pelicular del lote." }];
    case "ipc":
      return [{ tag: "IPC-01", nameEs: "Banco de control en proceso", qty: 1, basis: "Control de peso, dureza, friabilidad y desintegración. No es un laboratorio de control de calidad completo." }];
    case "blister":
      return [{ tag: "BL-01", nameEs: "Línea de blíster", qty: 1, basis: `Ciclo supuesto ${ASSUMPTIONS.cycles.blisterH} h por lote.` }];
    case "ibc":
      return [{ tag: "IW-01", nameEs: "Cabina de lavado de IBC", qty: 1, basis: "Un puesto de lavado para los contenedores del escenario." }];
    case "lavado":
      return [{ tag: "EW-01", nameEs: "Zona de lavado de piezas de equipo", qty: 1, basis: "Lavado manual/asistido de piezas. No dimensiona un tren CIP." }];
    default:
      return [];
  }
}

function center(rooms: OsdRoom[], id: string): [number, number] {
  const room = rooms.find((item) => item.id === id);
  if (!room) throw new Error(`Sala de flujo inexistente: ${id}`);
  return [round(room.x + room.w / 2, 3), round(room.z + room.d / 2, 3)];
}

function polyline(rooms: OsdRoom[], ids: string[]): [number, number][] {
  return ids.map((id) => center(rooms, id));
}

/** Ortogonal: el trazo no corta en diagonal salas que no están en el recorrido. */
function buildFlows(rooms: OsdRoom[], processId: string): Flow[] {
  const gown = rooms.find((room) => room.id === "vestuario");
  if (!gown) throw new Error("Falta el vestuario.");
  const at = (id: string) => center(rooms, id);
  const xOf = (id: string) => at(id)[0];
  const zOf = (id: string) => at(id)[1];
  const outside: [number, number] = [-1.6, round(gown.z + gown.d / 2, 3)];
  const corridorZ = zOf("pasillo");
  const dirtyZ = zOf("pasillo-sucio");
  const wasteDoorX = 45;

  return [
    {
      id: "personal-ingreso",
      kind: "personnel",
      points: [outside, ...polyline(rooms, ["vestuario", "pal", "pasillo"])],
    },
    {
      id: "personal-proceso",
      kind: "personnel",
      points: [
        [xOf("pesada"), corridorZ],
        at("pesada"),
        at(processId),
        at("compresion"),
        at("recubrimiento"),
      ],
    },
    {
      id: "personal-ipc",
      kind: "personnel",
      points: [
        [xOf("ipc"), corridorZ],
        at("ipc"),
      ],
    },
    {
      id: "material-entrada",
      kind: "material",
      points: [
        ...polyline(rooms, ["recepcion", "cuarentena", "almacen-mp", "mal-in"]),
        [xOf("mal-in"), corridorZ],
        [12, corridorZ],
        [12, zOf("muestreo")],
        at("muestreo"),
      ],
    },
    {
      id: "material-proceso",
      kind: "material",
      points: polyline(rooms, ["muestreo", "pesada", processId, "molienda", "mezcla", "compresion", "recubrimiento"]),
    },
    {
      id: "material-solucion",
      kind: "material",
      points: polyline(rooms, ["solucion", "recubrimiento"]),
    },
    {
      id: "material-salida",
      kind: "material",
      points: [
        at("recubrimiento"),
        [xOf("recubrimiento"), dirtyZ],
        at("inspeccion"),
        at("blister"),
        at("secundario"),
        at("pasillo-fg"),
        at("mal-out"),
        [xOf("mal-out"), zOf("almacen-pt")],
        at("almacen-pt"),
      ],
    },
    {
      id: "residuos-granulacion",
      kind: "waste",
      points: [at(processId), [xOf(processId), dirtyZ], [xOf("residuos"), dirtyZ], at("residuos")],
    },
    {
      id: "residuos-compresion",
      kind: "waste",
      points: [at("compresion"), [xOf("compresion"), dirtyZ], [xOf("residuos"), dirtyZ], at("residuos")],
    },
    {
      id: "residuos-recubrimiento",
      kind: "waste",
      points: [
        at("recubrimiento"),
        [wasteDoorX, zOf("recubrimiento")],
        [wasteDoorX, dirtyZ],
        [xOf("residuos"), dirtyZ],
        at("residuos"),
      ],
    },
  ];
}

export function buildingBox(rooms: { x: number; z: number; w: number; d: number }[]) {
  const widthM = round(Math.max(...rooms.map((room) => room.x + room.w)), 3);
  const depthM = round(Math.max(...rooms.map((room) => room.z + room.d)), 3);
  return { widthM, depthM, grossAreaM2: round(widthM * depthM, 1) };
}

export function generateLayout(input: unknown = DEFAULT_INPUTS): OsdLayout {
  const inputs = parseInputs(input);
  const sizing = sizingFor(inputs);
  const processId = processRoomId(inputs.route);
  const rooms: OsdRoom[] = seedsFor(inputs.route).map((seed) => {
    const pressurePa = pressureFor(seed, inputs.oeb);
    const grade = seed.grade;
    return {
      id: seed.id,
      nameEs: seed.nameEs,
      nameEn: seed.nameEn,
      shortEs: seed.shortEs,
      shortEn: seed.shortEn,
      iso: grade === "D" ? "ISO 8" : "CNC",
      x: seed.x,
      z: seed.z,
      w: seed.w,
      d: seed.d,
      doors: [],
      areaM2: round(seed.w * seed.d, 2),
      grade,
      pressurePa,
      badge: grade === "D" ? "Grado D" : "CNC",
      equipment: equipmentFor(seed.id, sizing),
    };
  });

  for (const link of DOOR_LINKS) {
    const a = link.a === "granulacion" ? processId : link.a;
    const b = link.b === "granulacion" ? processId : link.b;
    addSharedDoor(rooms, a, b, link.width);
  }
  for (const door of EXTERNAL_DOORS) {
    const room = rooms.find((item) => item.id === door.id);
    if (!room) throw new Error(`Puerta exterior sin sala: ${door.id}`);
    pushDoor(room, { edge: door.edge, offset: door.offset, width: door.width });
  }

  const building = buildingBox(rooms);
  if (inputs.footprintWidthM !== null && inputs.footprintDepthM !== null) {
    if (inputs.footprintWidthM < building.widthM || inputs.footprintDepthM < building.depthM) {
      v2(
        `la huella disponible es menor que el bloque generado (${building.widthM} m × ${building.depthM} m). Esta versión no escala la planta.`,
      );
    }
  }

  buildWalls(rooms);

  return {
    label: OSD_LABEL,
    scenarioId: ASSUMPTIONS.scenarioId,
    inputs,
    building,
    sizing,
    rooms,
    flows: buildFlows(rooms, processId),
  };
}

export function viewerModelFromLayout(layout: OsdLayout) {
  return {
    rooms: layout.rooms,
    walls: buildWalls(layout.rooms),
    flows: layout.flows,
    building: { width: layout.building.widthM, depth: layout.building.depthM },
    center: [layout.building.widthM / 2, 0, layout.building.depthM / 2] as [number, number, number],
  };
}
