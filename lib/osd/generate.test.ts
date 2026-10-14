import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DOOR_LINKS } from "./assumptions.ts";
import { DEFAULT_INPUTS, generateLayout, OSD_LABEL, ScopeError } from "./generate.ts";

const REQUIRED = [
  "recepcion",
  "cuarentena",
  "almacen-mp",
  "almacen-pt",
  "muestreo",
  "pesada",
  "molienda",
  "mezcla",
  "compresion",
  "recubrimiento",
  "solucion",
  "ipc",
  "inspeccion",
  "blister",
  "secundario",
  "lavado",
  "alm-limpio",
  "alm-sucio",
  "ibc",
  "mal-in",
  "mal-out",
  "vestuario",
  "pal",
  "pasillo",
  "pasillo-sucio",
  "residuos",
  "taller",
];

function tags(layout: ReturnType<typeof generateLayout>, roomId: string) {
  return layout.rooms.find((room) => room.id === roomId)?.equipment.map((item) => item.tag) ?? [];
}

function contains(room: { x: number; z: number; w: number; d: number }, point: [number, number]) {
  const [x, z] = point;
  return x > room.x + 0.05 && x < room.x + room.w - 0.05 && z > room.z + 0.05 && z < room.z + room.d - 0.05;
}

describe("layout OSD 1.000.000", () => {
  it("genera el layout por defecto con la leyenda conceptual", () => {
    const layout = generateLayout(DEFAULT_INPUTS);
    assert.equal(layout.label, "Layout conceptual, requiere revisión experta");
    assert.equal(layout.label, OSD_LABEL);
    assert.equal(layout.building.widthM, 60);
    assert.equal(layout.building.depthM, 22);
    const ids = layout.rooms.map((room) => room.id);
    for (const id of REQUIRED) assert.ok(ids.includes(id), id);
    assert.ok(ids.includes("granulacion"));
    for (const room of layout.rooms) {
      assert.ok(room.areaM2 > 0);
      assert.ok(room.w > 0 && room.d > 0);
    }
    const sum = layout.rooms.reduce((total, room) => total + room.areaM2, 0);
    assert.ok(Math.abs(sum - layout.building.grossAreaM2) < 0.2);
    assert.ok(layout.flows.some((flow) => flow.kind === "personnel"));
    assert.ok(layout.flows.some((flow) => flow.kind === "material"));
    assert.ok(layout.flows.some((flow) => flow.kind === "waste"));
    assert.deepEqual(tags(layout, "granulacion"), ["HSG-01", "FBD-01"]);
    assert.equal(tags(layout, "recubrimiento")[0], "PC-01");
    assert.equal(layout.rooms.find((room) => room.id === "recubrimiento")?.equipment[0].qty, 1);
  });

  it("es determinista", () => {
    assert.deepEqual(generateLayout(DEFAULT_INPUTS), generateLayout({ ...DEFAULT_INPUTS }));
  });

  it("la compresión directa ocupa el mismo rectángulo y no lleva granulador", () => {
    const wet = generateLayout(DEFAULT_INPUTS);
    const direct = generateLayout({ ...DEFAULT_INPUTS, route: "direct-compression" });
    const gran = wet.rooms.find((room) => room.id === "granulacion");
    const pre = direct.rooms.find((room) => room.id === "premezcla");
    assert.ok(gran && pre);
    assert.deepEqual([pre.x, pre.z, pre.w, pre.d], [gran.x, gran.z, gran.w, gran.d]);
    assert.equal(direct.rooms.some((room) => room.id === "granulacion"), false);
    const allTags = direct.rooms.flatMap((room) => room.equipment.map((item) => item.tag));
    assert.equal(allTags.includes("HSG-01"), false);
    assert.equal(allTags.includes("FBD-01"), false);
    assert.ok(allTags.includes("BB-01"));
    assert.ok(allTags.includes("IBC-01"));
  });

  it("el material de proceso avanza hacia el este y el residuo no entra al pasillo limpio", () => {
    const layout = generateLayout(DEFAULT_INPUTS);
    const process = layout.flows.find((flow) => flow.id === "material-proceso");
    assert.ok(process);
    for (let index = 1; index < process.points.length; index += 1) {
      assert.ok(process.points[index][0] >= process.points[index - 1][0] - 0.01);
    }
    const clean = layout.rooms.find((room) => room.id === "pasillo");
    const malIn = layout.rooms.find((room) => room.id === "mal-in");
    const malOut = layout.rooms.find((room) => room.id === "mal-out");
    assert.ok(clean && malIn && malOut);
    for (const flow of layout.flows.filter((item) => item.kind === "personnel")) {
      for (const point of flow.points) {
        assert.equal(contains(malIn, point), false);
        assert.equal(contains(malOut, point), false);
      }
    }
    for (const flow of layout.flows.filter((item) => item.kind === "waste")) {
      for (const point of flow.points) {
        assert.equal(contains(clean, point), false);
      }
    }
    const blocked = [
      ["pasillo", "pasillo-sucio"],
      ["lavado", "muestreo"],
      ["vestuario", "lavado"],
      ["solucion", "secundario"],
      ["solucion", "pasillo-fg"],
      ["mal-out", "pasillo"],
      ["taller", "mal-in"],
      ["alm-limpio", "alm-sucio"],
    ];
    for (const [a, b] of blocked) {
      assert.equal(
        DOOR_LINKS.some((link) => (link.a === a && link.b === b) || (link.a === b && link.b === a)),
        false,
        `${a}–${b}`,
      );
    }
  });

  it("rechaza lo que queda fuera del escenario", () => {
    const expectV2 = (input: unknown) => {
      assert.throws(() => generateLayout(input), (error: unknown) => {
        assert.ok(error instanceof ScopeError);
        assert.match(error.message, /^Fuera de alcance de esta versión \(v2\):/);
        return true;
      });
    };
    expectV2({ ...DEFAULT_INPUTS, capacityPerMonth: 2_000_000 });
    expectV2({ ...DEFAULT_INPUTS, grade: "B" });
    expectV2({ ...DEFAULT_INPUTS, oeb: 4 });
    expectV2({ ...DEFAULT_INPUTS, dosageForm: "capsulas" });
    expectV2({ ...DEFAULT_INPUTS, route: "seca" });
    expectV2({ ...DEFAULT_INPUTS, footprintWidthM: 40, footprintDepthM: null });
    expectV2({ ...DEFAULT_INPUTS, footprintWidthM: 40, footprintDepthM: 22 });
    const fitted = generateLayout({ ...DEFAULT_INPUTS, footprintWidthM: 60, footprintDepthM: 22 });
    assert.equal(fitted.building.widthM, 60);
  });

  it("OEB 3 deja la pesada por debajo del pasillo limpio", () => {
    const layout = generateLayout({ ...DEFAULT_INPUTS, oeb: 3 });
    const corridor = layout.rooms.find((room) => room.id === "pasillo");
    const weighing = layout.rooms.find((room) => room.id === "pesada");
    const compression = layout.rooms.find((room) => room.id === "compresion");
    assert.ok(corridor && weighing && compression);
    assert.ok(weighing.pressurePa < corridor.pressurePa);
    assert.ok(compression.pressurePa > corridor.pressurePa);
  });
});
