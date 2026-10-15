/**
 * Supuestos editables del escenario OSD — 1.000.000 comprimidos recubiertos/mes.
 *
 * Esto no es un diseño de HVAC, ni una calificación, ni un layout aprobado.
 * Un ingeniero puede cambiar cifras y volver a generar. Si cambia la geometría,
 * revise también docs/MVP_OSD_1M.md.
 *
 * Unidades: metros, horas, kilogramos, pascales (diferencial conceptual).
 */

export const CONCEPTUAL_LABEL = "Layout conceptual, requiere revisión experta";

export const ASSUMPTIONS = {
  scenarioId: "osd-coated-tablets-1m",
  dosageForm: "comprimido-recubierto",
  capacityTabletsPerMonth: 1_000_000,
  /** Comprimidos por lote. 10 lotes/mes a la capacidad fija. */
  batchSizeTablets: 100_000,
  /** Ganancia de peso del recubrimiento pelicular sobre el núcleo. */
  coatingWeightGain: 0.03,
  /** Horas productivas por turno, ya descontando arranque y limpieza menor. */
  productiveHoursPerShift: 7,
  shiftsMin: 1,
  shiftsMax: 2,
  daysMin: 18,
  daysMax: 23,
  tabletWeightMinMg: 100,
  tabletWeightMaxMg: 800,
  oebMin: 1,
  oebMax: 3,
  /** Único grado de proceso de esta versión. */
  grade: "D",
  /**
   * Capacidad de un bombo perforado, en kg de núcleos recubiertos por carga.
   * A 800 mg y 100.000 comprimidos el lote pesa 82,4 kg: cabe en una carga.
   */
  coaterCapacityKg: 90,
  /** Cadencias y ciclos de un solo equipo por etapa. No hay línea duplicada. */
  cycles: {
    dispensingH: 2,
    /** Alta cizalla, por lote, vía húmeda. */
    highShearH: 1.25,
    /** Lecho fluido, por lote, vía húmeda. Se suma a la cizalla: van en serie en la misma sala. */
    fluidBedH: 3,
    millingH: 1,
    /** Mezcla final en IBC, ambas vías. */
    finalBlendH: 0.5,
    /** Premezcla en contenedor, solo compresión directa. Sustituye HSG + FBD. */
    preBlendDcH: 1,
    compressionRateTabPerH: 80_000,
    compressionSetupH: 1,
    coatingH: 3.5,
    blisterH: 4,
  },
  /**
   * Presiones diferenciales conceptuales (Pa), no un cálculo de caudal.
   * El pasillo limpio está por encima del almacén y por debajo del proceso
   * cuando el producto se protege (OEB 1–2). En OEB 3 las salas de
   * contención quedan por debajo del pasillo.
   */
  pressurePa: {
    cnc: 0,
    gowning: 5,
    airlock: 10,
    cleanCorridor: 15,
    process: 20,
    containment: 5,
    dirtyCorridor: -5,
    waste: -10,
  },
} as const;

export type OsdGrade = "D" | "CNC";

export type RoomSeed = {
  id: string;
  nameEs: string;
  nameEn: string;
  shortEs: string;
  shortEn: string;
  x: number;
  z: number;
  w: number;
  d: number;
  grade: OsdGrade;
  /** Presión base. Las salas marcadas se rebajan si OEB ≥ 3. */
  pressurePa: number;
  containmentSensitive?: boolean;
};

/**
 * Bloque 60 m × 22 m. +x este, +z sur.
 * Cuatro bandas: logística (z 0–5), esclusas y pasillo (z 5–9),
 * proceso (z 9–16) y soporte/acondicionado (z 16–22).
 * La columna x 56–60 es la salida de producto terminado: no cruza
 * la preparación de solución ni el pasillo de personal.
 */
export const ROOM_SEEDS: RoomSeed[] = [
  { id: "recepcion", nameEs: "Recepción", nameEn: "Reception", shortEs: "Recepción", shortEn: "Receiving", x: 0, z: 0, w: 8, d: 5, grade: "CNC", pressurePa: 0 },
  { id: "cuarentena", nameEs: "Cuarentena", nameEn: "Quarantine", shortEs: "Cuarentena", shortEn: "Quarantine", x: 8, z: 0, w: 7, d: 5, grade: "CNC", pressurePa: 0 },
  { id: "almacen-mp", nameEs: "Almacén de materias primas", nameEn: "Raw-material warehouse", shortEs: "Almacén MP", shortEn: "RM store", x: 15, z: 0, w: 14, d: 5, grade: "CNC", pressurePa: 0 },
  { id: "mal-in", nameEs: "Esclusa de material (entrada)", nameEn: "Material airlock (in)", shortEs: "MAL in", shortEn: "MAL in", x: 29, z: 0, w: 5, d: 5, grade: "D", pressurePa: 10 },
  { id: "taller", nameEs: "Área técnica (HVAC y servicios)", nameEn: "Technical area (HVAC and utilities)", shortEs: "HVAC", shortEn: "HVAC", x: 34, z: 0, w: 8, d: 5, grade: "CNC", pressurePa: 0 },
  { id: "ipc", nameEs: "Laboratorio IPC", nameEn: "IPC laboratory", shortEs: "IPC", shortEn: "IPC", x: 42, z: 0, w: 6, d: 5, grade: "CNC", pressurePa: 0 },
  { id: "almacen-pt", nameEs: "Almacén de producto terminado", nameEn: "Finished-goods warehouse", shortEs: "Almacén PT", shortEn: "FG store", x: 48, z: 0, w: 12, d: 5, grade: "CNC", pressurePa: 0 },

  { id: "vestuario", nameEs: "Vestuario", nameEn: "Gowning", shortEs: "Vestuario", shortEn: "Gowning", x: 0, z: 5, w: 7, d: 4, grade: "D", pressurePa: 5 },
  { id: "pal", nameEs: "Esclusa de personal", nameEn: "Personnel airlock", shortEs: "PAL", shortEn: "PAL", x: 7, z: 5, w: 4, d: 4, grade: "D", pressurePa: 10 },
  { id: "pasillo", nameEs: "Pasillo limpio", nameEn: "Clean corridor", shortEs: "Pasillo", shortEn: "Corridor", x: 11, z: 5, w: 45, d: 4, grade: "D", pressurePa: 15 },
  { id: "mal-out", nameEs: "Esclusa de material (salida)", nameEn: "Material airlock (out)", shortEs: "MAL out", shortEn: "MAL out", x: 56, z: 5, w: 4, d: 4, grade: "D", pressurePa: 10 },

  { id: "lavado", nameEs: "Lavado de equipos", nameEn: "Equipment wash", shortEs: "Lavado", shortEn: "Wash", x: 0, z: 9, w: 7, d: 7, grade: "CNC", pressurePa: 0 },
  { id: "muestreo", nameEs: "Muestreo", nameEn: "Sampling", shortEs: "Muestreo", shortEn: "Sampling", x: 7, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20 },
  { id: "pesada", nameEs: "Dispensación / pesada", nameEn: "Dispensing / weighing", shortEs: "Pesada", shortEn: "Weighing", x: 13, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20, containmentSensitive: true },
  { id: "granulacion", nameEs: "Granulación", nameEn: "Granulation", shortEs: "Granulación", shortEn: "Granulation", x: 19, z: 9, w: 8, d: 7, grade: "D", pressurePa: 20, containmentSensitive: true },
  { id: "molienda", nameEs: "Molienda y tamizado", nameEn: "Milling and sieving", shortEs: "Molienda", shortEn: "Milling", x: 27, z: 9, w: 5, d: 7, grade: "D", pressurePa: 20, containmentSensitive: true },
  { id: "mezcla", nameEs: "Mezcla final (IBC)", nameEn: "Final blending (IBC)", shortEs: "Mezcla", shortEn: "Blending", x: 32, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20 },
  { id: "compresion", nameEs: "Compresión", nameEn: "Compression", shortEs: "Compresión", shortEn: "Press", x: 38, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20 },
  { id: "recubrimiento", nameEs: "Recubrimiento", nameEn: "Coating", shortEs: "Recubrimiento", shortEn: "Coating", x: 44, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20 },
  { id: "solucion", nameEs: "Preparación de solución de recubrimiento", nameEn: "Coating-solution preparation", shortEs: "Solución", shortEn: "Solution", x: 50, z: 9, w: 6, d: 7, grade: "D", pressurePa: 20 },
  { id: "pasillo-fg", nameEs: "Pasillo de producto terminado", nameEn: "Finished-goods corridor", shortEs: "Salida PT", shortEn: "FG out", x: 56, z: 9, w: 4, d: 7, grade: "D", pressurePa: 10 },

  { id: "alm-limpio", nameEs: "Almacén de equipos limpios", nameEn: "Clean equipment store", shortEs: "Eq. limpio", shortEn: "Clean store", x: 0, z: 16, w: 5, d: 6, grade: "CNC", pressurePa: 0 },
  { id: "alm-sucio", nameEs: "Almacén de equipos sucios", nameEn: "Dirty equipment store", shortEs: "Eq. sucio", shortEn: "Dirty store", x: 5, z: 16, w: 5, d: 6, grade: "CNC", pressurePa: 0 },
  { id: "ibc", nameEs: "Lavado de IBC", nameEn: "IBC wash", shortEs: "Lavado IBC", shortEn: "IBC wash", x: 10, z: 16, w: 6, d: 6, grade: "CNC", pressurePa: 0 },
  { id: "residuos", nameEs: "Residuos", nameEn: "Waste room", shortEs: "Residuos", shortEn: "Waste", x: 16, z: 16, w: 3, d: 6, grade: "CNC", pressurePa: -10 },
  { id: "pasillo-sucio", nameEs: "Pasillo sucio", nameEn: "Dirty corridor", shortEs: "P. sucio", shortEn: "Dirty hall", x: 19, z: 16, w: 27, d: 6, grade: "CNC", pressurePa: -5 },
  { id: "inspeccion", nameEs: "Inspección", nameEn: "Inspection", shortEs: "Inspección", shortEn: "Inspect", x: 46, z: 16, w: 5, d: 6, grade: "D", pressurePa: 20 },
  { id: "blister", nameEs: "Acondicionado primario (blíster)", nameEn: "Primary packaging (blister)", shortEs: "Blíster", shortEn: "Blister", x: 51, z: 16, w: 5, d: 6, grade: "D", pressurePa: 20 },
  { id: "secundario", nameEs: "Acondicionado secundario", nameEn: "Secondary packaging", shortEs: "Secundario", shortEn: "Secondary", x: 56, z: 16, w: 4, d: 6, grade: "CNC", pressurePa: 0 },
];

/**
 * Puertas explícitas. No se abren por solape: así el pasillo sucio no
 * vuelve al pasillo limpio, el lavado no entra a Grado D y el personal
 * no cruza las MAL.
 *
 * «granulacion» se sustituye por «premezcla» en compresión directa,
 * con el mismo rectángulo.
 */
export const DOOR_LINKS: { a: string; b: string; width?: number }[] = [
  { a: "recepcion", b: "cuarentena", width: 1.6 },
  { a: "cuarentena", b: "almacen-mp", width: 1.6 },
  { a: "almacen-mp", b: "mal-in", width: 1.4 },
  { a: "mal-in", b: "pasillo", width: 1.4 },
  { a: "vestuario", b: "pal", width: 1.2 },
  { a: "pal", b: "pasillo", width: 1.2 },
  { a: "ipc", b: "pasillo", width: 1.2 },
  { a: "pasillo", b: "muestreo", width: 1.1 },
  { a: "pasillo", b: "pesada", width: 1.2 },
  { a: "pasillo", b: "granulacion", width: 1.2 },
  { a: "pasillo", b: "molienda", width: 1.2 },
  { a: "pasillo", b: "mezcla", width: 1.2 },
  { a: "pasillo", b: "compresion", width: 1.2 },
  { a: "pasillo", b: "recubrimiento", width: 1.2 },
  { a: "pasillo", b: "solucion", width: 1.2 },
  { a: "muestreo", b: "pesada", width: 1.2 },
  { a: "pesada", b: "granulacion", width: 1.2 },
  { a: "granulacion", b: "molienda", width: 1.2 },
  { a: "molienda", b: "mezcla", width: 1.2 },
  { a: "mezcla", b: "compresion", width: 1.2 },
  { a: "compresion", b: "recubrimiento", width: 1.2 },
  { a: "recubrimiento", b: "solucion", width: 1.2 },
  { a: "lavado", b: "alm-sucio", width: 1.2 },
  { a: "alm-sucio", b: "ibc", width: 1.2 },
  { a: "ibc", b: "residuos", width: 1.1 },
  { a: "residuos", b: "pasillo-sucio", width: 1.2 },
  { a: "granulacion", b: "pasillo-sucio", width: 1.2 },
  { a: "compresion", b: "pasillo-sucio", width: 1.2 },
  { a: "recubrimiento", b: "pasillo-sucio", width: 1.1 },
  { a: "recubrimiento", b: "inspeccion", width: 1.4 },
  { a: "inspeccion", b: "blister", width: 1.4 },
  { a: "blister", b: "secundario", width: 1.2 },
  { a: "secundario", b: "pasillo-fg", width: 1.2 },
  { a: "pasillo-fg", b: "mal-out", width: 1.2 },
  { a: "mal-out", b: "almacen-pt", width: 1.4 },
];

/** Puertas al exterior o al patio técnico. No conectan zonas limpias con sucias. */
export const EXTERNAL_DOORS: { id: string; edge: "n" | "s" | "e" | "w"; offset: number; width: number }[] = [
  { id: "recepcion", edge: "w", offset: 2.5, width: 1.8 },
  { id: "vestuario", edge: "w", offset: 2, width: 1.2 },
  { id: "taller", edge: "n", offset: 4, width: 1.8 },
  { id: "alm-limpio", edge: "w", offset: 3, width: 1.2 },
];

export const PREBLEND_ROOM = {
  id: "premezcla",
  nameEs: "Premezcla (compresión directa)",
  nameEn: "Pre-blend (direct compression)",
  shortEs: "Premezcla",
  shortEn: "Pre-blend",
} as const;
