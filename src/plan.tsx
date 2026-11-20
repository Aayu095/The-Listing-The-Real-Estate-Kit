import React from "react";
import { Circle, Column, Ellipse, Layer, Line, Polygon, Rect, Row, Svg, Text } from "@hyper-elements/react";
import { fonts, palette } from "./theme";
import {
  ftIn,
  innerPlate,
  northSegments,
  sideSegments,
  southSegments,
  type DoorSpec,
  type RoomFact,
  roomFacts,
} from "./data";

// The floor plan — the kit's centerpiece, drawn entirely in code from
// the room geometry in src/data.ts. Walls are the room cells' own
// borders (exterior walls a slightly heavier 4px / 3.5px compact,
// shared partitions 1.25px drawn by both neighbours ≈ 2.5px, as a
// wall has thickness); each room is a Layer —
// a centred lettered label under an Svg overlay that carries the door
// swings (arcs built from Line segments, since a stroke-only Path is
// not in the style system), the window bands and the fixtures.
// Dimension strings sit outside the plate: HTML labels whose flex
// shares are the segment lengths themselves, over Svg line-work with
// ticks and arrowheads — so the labels can never drift from the lines.

const pt = (n: number) => Math.round(n * 10) / 10;
const byName = (name: string): RoomFact => roomFacts.find((r) => r.name === name)!;

/** Column groups of the plan, west → east, rooms stacked north → south. */
const BANDS: { depth: number; columns: RoomFact[][] }[] = [
  { depth: 12, columns: [[byName("Master Bedroom")], [byName("Master Bath"), byName("Dress")], [byName("Bedroom 2")], [byName("Bedroom 3")]] },
  { depth: 13, columns: [[byName("Living Room")], [byName("Dining")], [byName("Kitchen")]] },
  { depth: 10, columns: [[byName("Balcony")], [byName("Puja")], [byName("Store")], [byName("Bath")], [byName("Foyer")]] },
];

// ——— Door swings, windows, fixtures (one room's overlay) ———
function arcSegs(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const steps = 12;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts.slice(0, -1).map((p, i) => ({ a: p, b: pts[i + 1] }));
}

function DoorSwing({ door, s, w, h }: { door: DoorSpec; s: number; w: number; h: number }) {
  const L = (door.widthFt ?? 2.5) * s;
  const color = door.main ? palette.oxblood : palette.ink;
  const leafW = door.main ? 2.4 : 1.8;
  const arcW = door.main ? 1.1 : 0.85;
  let leaf: { x1: number; y1: number; x2: number; y2: number };
  let segs: { a: { x: number; y: number }; b: { x: number; y: number } }[];
  if (door.wall === "S") {
    const hx = door.at * s;
    leaf = { x1: hx, y1: h, x2: hx, y2: h - L };
    segs = arcSegs(hx, h, L, 0, -90);
  } else if (door.wall === "N") {
    const hx = door.at * s;
    leaf = { x1: hx, y1: 0, x2: hx, y2: L };
    segs = arcSegs(hx, 0, L, 0, 90);
  } else if (door.wall === "W") {
    const hy = door.at * s;
    leaf = { x1: 0, y1: hy, x2: L, y2: hy };
    segs = arcSegs(0, hy, L, 90, 0);
  } else {
    const hy = door.at * s;
    leaf = { x1: w, y1: hy, x2: w - L, y2: hy };
    segs = arcSegs(w, hy, L, 90, 180);
  }
  return (
    <>
      <Line x1={pt(leaf.x1)} y1={pt(leaf.y1)} x2={pt(leaf.x2)} y2={pt(leaf.y2)} style={{ stroke: color, strokeWidth: leafW }} />
      {segs.map((sg, i) => (
        <Line key={i} x1={pt(sg.a.x)} y1={pt(sg.a.y)} x2={pt(sg.b.x)} y2={pt(sg.b.y)} style={{ stroke: color, strokeWidth: arcW }} />
      ))}
    </>
  );
}

function WindowBand({ wall, at, widthFt, slider, s, w, h }: { wall: string; at: number; widthFt: number; slider?: boolean; s: number; w: number; h: number }) {
  const a = at * s;
  const b = (at + widthFt) * s;
  const offs = slider ? [2, 4.6, 7.2] : [2.4, 5.4];
  const horiz = wall === "N" || wall === "S";
  return (
    <>
      {offs.map((o, i) => {
        const off = wall === "S" ? h - o : wall === "E" ? w - o : o;
        return horiz ? (
          <Rect key={i} x={pt(a)} y={pt(off - 0.5)} width={pt(b - a)} height={1} style={{ fill: palette.ink }} />
        ) : (
          <Rect key={i} x={pt(off - 0.5)} y={pt(a)} width={1} height={pt(b - a)} style={{ fill: palette.ink }} />
        );
      })}
      {horiz ? (
        <>
          <Rect x={pt(a - 0.5)} y={pt(wall === "S" ? h - 8 : 1)} width={1} height={7} style={{ fill: palette.ink }} />
          <Rect x={pt(b - 0.5)} y={pt(wall === "S" ? h - 8 : 1)} width={1} height={7} style={{ fill: palette.ink }} />
        </>
      ) : (
        <>
          <Rect x={pt(wall === "E" ? w - 8 : 1)} y={pt(a - 0.5)} width={7} height={1} style={{ fill: palette.ink }} />
          <Rect x={pt(wall === "E" ? w - 8 : 1)} y={pt(b - 0.5)} width={7} height={1} style={{ fill: palette.ink }} />
        </>
      )}
    </>
  );
}

function Fixtures({ kind, s, w, h }: { kind: string; s: number; w: number; h: number }) {
  const stroke = { stroke: palette.ink, strokeWidth: 1.1 };
  if (kind === "bath") {
    const compact = s < 12;
    const tubW = Math.min(5.4 * s, w * 0.44);
    // The tub hugs the north wall, sized to clear the room's centred
    // label block (see RoomCell): at full scale a double-outlined tub
    // 1.6 ft deep; at compact scale a shallow single outline — the
    // inner line would vanish, and a deeper tub would strike the name.
    const tubH = compact ? 0.85 * s : 1.6 * s;
    return (
      <>
        <Rect x={4} y={4} width={pt(tubW)} height={pt(tubH)} style={{ fill: palette.parchment, ...stroke }} />
        {tubH >= 13 ? (
          <Rect x={8} y={8} width={pt(tubW - 8)} height={pt(tubH - 8)} style={{ fill: palette.paper, ...stroke }} />
        ) : null}
        {compact ? (
          <Ellipse cx={pt(w - 0.95 * s)} cy={pt(h - 1.3 * s)} rx={pt(0.62 * s)} ry={pt(0.78 * s)} style={{ fill: palette.paper, ...stroke }} />
        ) : (
          <Ellipse cx={pt(w - 1.15 * s)} cy={pt(h - 1.5 * s)} rx={pt(0.78 * s)} ry={pt(0.98 * s)} style={{ fill: palette.paper, ...stroke }} />
        )}
        <Rect x={pt(w - 4.5)} y={pt(h - 2.6 * s)} width={4} height={pt(2.2 * s)} style={{ fill: palette.parchment, ...stroke }} />
        {compact ? (
          <Rect x={4} y={pt(h - 1.35 * s)} width={pt(1.7 * s)} height={pt(1.25 * s)} style={{ fill: palette.paper, ...stroke }} />
        ) : (
          <Rect x={4} y={pt(h - 1.7 * s)} width={pt(1.9 * s)} height={pt(1.5 * s)} style={{ fill: palette.paper, ...stroke }} />
        )}
      </>
    );
  }
  if (kind === "kitchen") {
    const cd = 2 * s; // counter depth
    return (
      <>
        <Rect x={pt(w - cd - 2)} y={2} width={pt(cd)} height={pt(h - 4)} style={{ fill: palette.parchment, ...stroke }} />
        <Rect x={2} y={2} width={pt(w - cd - 6)} height={pt(cd)} style={{ fill: palette.parchment, ...stroke }} />
        <Rect x={pt(w - cd + 3)} y={pt(h * 0.38)} width={pt(cd - 6)} height={pt(2.6 * s)} style={{ fill: palette.paper, ...stroke }} />
        <Rect x={pt(w - cd + 6)} y={pt(h * 0.38 + 4)} width={pt(cd - 12)} height={pt(2.6 * s - 8)} style={{ fill: palette.paper, ...stroke }} />
        <Circle cx={pt(1.1 * s + 4)} cy={pt(1 * s + 2)} r={pt(0.52 * s)} style={{ fill: palette.paper, ...stroke }} />
        <Circle cx={pt(2.6 * s + 4)} cy={pt(1 * s + 2)} r={pt(0.38 * s)} style={{ fill: palette.paper, ...stroke }} />
        <Circle cx={pt(1.1 * s + 4)} cy={pt(0.55 * s + 2)} r={pt(0.3 * s)} style={{ fill: palette.paper, ...stroke }} />
        <Circle cx={pt(2.6 * s + 4)} cy={pt(0.55 * s + 2)} r={pt(0.3 * s)} style={{ fill: palette.paper, ...stroke }} />
      </>
    );
  }
  // balcony — railing lines along the south edge, planter ticks
  const ticks: React.ReactNode[] = [];
  for (let x = 1; x < w / s - 1; x += 2.2) {
    ticks.push(<Rect key={x} x={pt(x * s)} y={pt(h - 13)} width={5} height={5} style={{ fill: palette.ink }} />);
  }
  return (
    <>
      <Rect x={1} y={pt(h - 3.4)} width={pt(w - 2)} height={1.1} style={{ fill: palette.ink }} />
      <Rect x={1} y={pt(h - 7)} width={pt(w - 2)} height={1.1} style={{ fill: palette.ink }} />
      {ticks}
    </>
  );
}

// ——— Furniture — deliberately light ———
// A draughtsman's suggestion, not an inventory: a bed outline with
// its two pillows in each bedroom, a sofa outline in the living
// room, drawn in stone a weight below the walls. Nothing else — no
// dining set, no wardrobes, no kitchen island, no tile grid — the
// sheet keeps its air. Every piece was placed against the label
// system first: the centred three-slot block, the door swings and
// the window bands are keep-out zones, and no furniture edge enters
// them. Coordinates are feet from the room's inner NW corner, the
// same convention as doors and windows. Full detail only — the
// compact plan carries no furniture.
function Furniture({ name, s }: { name: string; s: number }) {
  const line = { stroke: palette.stone, strokeWidth: 0.8 };
  const t = 0.9 / s; // a ~0.9px rule, in feet
  const R = (x: number, y: number, fw: number, fh: number, fill: string = palette.paper) => (
    <Rect x={pt(x * s)} y={pt(y * s)} width={pt(fw * s)} height={pt(fh * s)} style={{ fill, ...line }} />
  );
  const bar = (x: number, y: number, fw: number, fh: number) => (
    <Rect x={pt(x * s)} y={pt(y * s)} width={pt(fw * s)} height={pt(fh * s)} style={{ fill: palette.stone }} />
  );
  switch (name) {
    case "Master Bedroom":
      return (
        <>
          {R(0.35, 5.6, 4.7, 6.1)}
          {R(0.6, 10.35, 1.95, 1.1)}
          {R(2.85, 10.35, 1.95, 1.1)}
          {bar(0.35, 7.4, 4.7, t)}
        </>
      );
    case "Bedroom 2":
      return (
        <>
          {R(9.05, 5.65, 4.65, 6.05)}
          {R(9.3, 10.35, 1.95, 1.1)}
          {R(11.5, 10.35, 1.95, 1.1)}
          {bar(9.05, 7.35, 4.65, t)}
        </>
      );
    case "Bedroom 3":
      // A single bed along the north wall: its foot ends a clear
      // foot above the label block, its pillows sit clear of the
      // window band, and the door swing sweeps the far south-east
      // corner.
      return (
        <>
          {R(0.35, 0.5, 6.2, 3.2)}
          {R(0.6, 0.85, 1.0, 1.1)}
          {R(0.6, 2.25, 1.0, 1.1)}
          {bar(2.3, 0.5, t, 3.2)}
        </>
      );
    case "Living Room":
      return (
        <>
          {R(0.5, 0.35, 7.5, 3.0)}
          {R(0.5, 0.35, 0.7, 3.0, palette.parchment)}
          {R(7.3, 0.35, 0.7, 3.0, palette.parchment)}
          {bar(1.2, 1.02, 6.1, t)}
          {bar(3.0, 1.02, t, 2.33)}
          {bar(5.5, 1.02, t, 2.33)}
        </>
      );
    default:
      return null;
  }
}

// ——— The label stack: ONE anchoring system for every room ———
// Every room's label is the same three-slot block — name slot, dims
// slot, area slot, each a fixed height with fixed gaps between — and
// the block is centred on the room's centroid. The dims slot is
// RESERVED even when a room shows no dimensions, so a two-line stack
// occupies exactly the geometry of a three-line one: scan any row of
// rooms and every name line sits at one height, every area line at
// another. Fixtures are sized and placed to clear the centred block
// (see Fixtures) — a label never sits on a tub, counter or railing.
const LABEL = {
  full: { nameSlot: 18, dimsSlot: 12, areaSlot: 13, gap: 4, nameLs: 0.8, dimsSize: 8.5, areaSize: 9.5 },
  compact: { nameSlot: 11, dimsSlot: 9, areaSlot: 11, gap: 3, nameLs: 0.5, dimsSize: 8.5, areaSize: 8.5 },
} as const;

/** Name size by room width — chosen from measured Cormorant glyph
 *  widths so the widest name in each tier clears its cell (and, in
 *  the Bath, the door-leaf tip) with room to spare. */
function nameSizeFor(room: RoomFact, full: boolean) {
  if (!full) return 9;
  return room.w >= 12 ? 15 : room.w >= 10 ? 14 : room.w >= 8 ? 12.5 : room.w >= 6 ? 11 : 10.5;
}

function RoomCell({ room, s, detail }: { room: RoomFact; s: number; detail: "full" | "compact" }) {
  // Wall weights: the plate's outer walls carry a slightly heavier
  // line (4px full / 3.5px compact) against the partitions' 1.25px —
  // structure first, subdivision second. A finishing weight only;
  // no content is added to the sheet.
  const ext = detail === "full" ? 4 : 3.5;
  const bw = {
    top: room.y === 0 ? ext : 1.25,
    bottom: room.y + room.d === innerPlate.dFt ? ext : 1.25,
    left: room.x === 0 ? ext : 1.25,
    right: room.x + room.w === innerPlate.wFt ? ext : 1.25,
  };
  const cellW = room.w * s;
  const cellH = room.d * s;
  const w = cellW - bw.left - bw.right;
  const h = cellH - bw.top - bw.bottom;
  const full = detail === "full";
  const m = LABEL[detail];
  const nameSize = nameSizeFor(room, full);
  const showDims = full && room.w >= 9 && room.d >= 7;
  return (
    <Column
      style={{
        width: cellW,
        height: cellH,
        border: {
          top: { width: bw.top, style: "solid", color: palette.ink },
          right: { width: bw.right, style: "solid", color: palette.ink },
          bottom: { width: bw.bottom, style: "solid", color: palette.ink },
          left: { width: bw.left, style: "solid", color: palette.ink },
        },
      }}
    >
      <Layer style={{ width: w, height: h }}>
        <Svg width={w} height={h} viewBox={`0 0 ${pt(w)} ${pt(h)}`} title={`Plan detail — ${room.name}`}>
          {full ? <Furniture name={room.name} s={s} /> : null}
          {room.fixtures ? <Fixtures kind={room.fixtures} s={s} w={w} h={h} /> : null}
          {room.windows?.map((win, i) => (
            <WindowBand key={i} wall={win.wall} at={win.at} widthFt={win.widthFt} slider={win.slider} s={s} w={w} h={h} />
          ))}
          {room.doors?.map((door, i) => <DoorSwing key={i} door={door} s={s} w={w} h={h} />)}
        </Svg>
        <Column style={{ width: w, height: h, alignItems: "center", justifyContent: "center" }}>
          <Column style={{ alignItems: "center", gap: m.gap }}>
            <Column style={{ height: m.nameSlot, justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: nameSize,
                  letterSpacing: m.nameLs,
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.05,
                  color: room.countsToCarpet ? palette.ink : palette.stone,
                }}
              >
                {room.name}
              </Text>
            </Column>
            <Column style={{ height: m.dimsSlot, justifyContent: "center", alignItems: "center" }}>
              {showDims ? (
                <Text style={{ fontFamily: fonts.mono, fontSize: m.dimsSize, color: palette.stone, textAlign: "center", lineHeight: 1.1 }}>
                  {ftIn(room.w)} × {ftIn(room.d)}
                </Text>
              ) : null}
            </Column>
            <Column style={{ height: m.areaSlot, justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: m.areaSize,
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.1,
                  color: room.countsToCarpet ? palette.ink : palette.stone,
                }}
              >
                {room.areaSqft} SQ FT{room.countsToCarpet ? "" : " · OPEN"}
              </Text>
            </Column>
          </Column>
        </Column>
      </Layer>
    </Column>
  );
}

// ——— Dimension strings ———
function DimLabelsRow({ segments, width, overall }: { segments: number[]; width: number; overall?: boolean }) {
  if (overall) {
    return (
      <Row style={{ width }}>
        <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, fontWeight: 600, flex: 1, textAlign: "center" }}>
          {ftIn(segments.reduce((a, b) => a + b, 0))} OVERALL
        </Text>
      </Row>
    );
  }
  return (
    <Row style={{ width }}>
      {segments.map((seg, i) => (
        <Text key={i} style={{ fontFamily: fonts.mono, fontSize: 9, flex: seg, textAlign: "center" }}>
          {ftIn(seg)}
        </Text>
      ))}
    </Row>
  );
}

function DimStripH({ segments, width, overall = false }: { segments: number[]; width: number; overall?: boolean }) {
  const bounds = [0];
  segments.forEach((seg) => bounds.push(bounds[bounds.length - 1] + seg));
  const s = width / bounds[bounds.length - 1];
  const y = 12;
  return (
    <Svg width={width} height={17} viewBox={`0 0 ${width} 17`} title="Dimension line">
      {bounds.map((b, i) => (
        <Rect key={i} x={pt(b * s - 0.6)} y={overall ? 6 : 3} width={1.2} height={overall ? 11 : 14} style={{ fill: palette.ink }} />
      ))}
      <Rect x={0} y={y - 0.6} width={width} height={1.2} style={{ fill: palette.ink }} />
      <Polygon points={`0,${y} 9,${y - 3.4} 9,${y + 3.4}`} style={{ fill: palette.ink }} />
      <Polygon points={`${width},${y} ${width - 9},${y - 3.4} ${width - 9},${y + 3.4}`} style={{ fill: palette.ink }} />
    </Svg>
  );
}

function DimStripV({ segments, height }: { segments: number[]; height: number }) {
  const bounds = [0];
  segments.forEach((seg) => bounds.push(bounds[bounds.length - 1] + seg));
  const s = height / bounds[bounds.length - 1];
  const x = 5;
  return (
    <Svg width={11} height={height} viewBox={`0 0 11 ${height}`} title="Dimension line">
      {bounds.map((b, i) => (
        <Rect key={i} x={0} y={pt(b * s - 0.6)} width={11} height={1.2} style={{ fill: palette.ink }} />
      ))}
      <Rect x={x - 0.6} y={0} width={1.2} height={height} style={{ fill: palette.ink }} />
      <Polygon points={`${x},0 ${x - 3.4},9 ${x + 3.4},9`} style={{ fill: palette.ink }} />
      <Polygon points={`${x},${height} ${x - 3.4},${height - 9} ${x + 3.4},${height - 9}`} style={{ fill: palette.ink }} />
    </Svg>
  );
}

/** The north arrow — drawn, with its letter beside it. */
export function NorthArrow({ size = 46 }: { size?: number }) {
  return (
    <Row style={{ gap: 7, alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} title="North">
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1.5} style={{ fill: palette.paper, stroke: palette.ink, strokeWidth: 1.25 }} />
        <Polygon points={`${size / 2},5 ${size / 2 + 6},${size / 2} ${size / 2},${size / 2 - 6}`} style={{ fill: palette.oxblood }} />
        <Polygon points={`${size / 2},${size - 5} ${size / 2 + 6},${size / 2} ${size / 2},${size / 2 - 6}`} style={{ fill: palette.ink }} />
        <Polygon points={`${size / 2},5 ${size / 2 - 6},${size / 2} ${size / 2},${size / 2 - 6}`} style={{ fill: palette.ink }} />
        <Polygon points={`${size / 2},${size - 5} ${size / 2 - 6},${size / 2} ${size / 2},${size / 2 - 6}`} style={{ fill: palette.parchment }} />
      </Svg>
      <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 19 }}>N</Text>
    </Row>
  );
}

/**
 * The floor plan, complete with dimension strings. `width` is the
 * whole drawing including the left dimension strip.
 */
export function FloorPlan({ width, detail = "full", bottomDims = true }: { width: number; detail?: "full" | "compact"; bottomDims?: boolean }) {
  const full = detail === "full";
  const leftStrip = full ? 48 : 40;
  const planW = width - leftStrip;
  const s = planW / innerPlate.wFt;
  const planH = innerPlate.dFt * s;
  return (
    <Column style={{ width, gap: 0 }}>
      {/* top dimension strings */}
      <Row style={{ gap: 0 }}>
        <Column style={{ width: leftStrip, flex: "none" }} />
        <Column style={{ gap: 1 }}>
          {full ? <DimLabelsRow segments={northSegments} width={planW} overall /> : null}
          {full ? <DimStripH segments={northSegments} width={planW} overall /> : null}
          <DimLabelsRow segments={northSegments} width={planW} />
          <DimStripH segments={northSegments} width={planW} />
        </Column>
      </Row>
      {/* plate + left dimension string */}
      <Row style={{ gap: 0 }}>
        <Row style={{ width: leftStrip, flex: "none", gap: 0 }}>
          <Column style={{ width: leftStrip - 13 }}>
            {sideSegments.map((seg, i) => (
              <Column key={i} style={{ height: seg * s, justifyContent: "center" }}>
                <Text style={{ fontFamily: fonts.mono, fontSize: 9, textAlign: "right" }}>{ftIn(seg)}</Text>
              </Column>
            ))}
          </Column>
          <DimStripV segments={sideSegments} height={planH} />
        </Row>
        <Column style={{ width: planW, flex: "none", gap: 0 }}>
          {BANDS.map((band, bi) => (
            <Row key={bi} style={{ gap: 0, height: band.depth * s, width: planW }}>
              {band.columns.map((colRooms, ci) => (
                <Column key={ci} style={{ gap: 0, width: colRooms[0].w * s, flex: "none" }}>
                  {colRooms.map((room) => (
                    <RoomCell key={room.name} room={room} s={s} detail={detail} />
                  ))}
                </Column>
              ))}
            </Row>
          ))}
        </Column>
      </Row>
      {/* bottom dimension string */}
      {full && bottomDims ? (
        <Row style={{ gap: 0 }}>
          <Column style={{ width: leftStrip, flex: "none" }} />
          <Column style={{ gap: 1 }}>
            <DimStripH segments={southSegments} width={planW} />
            <DimLabelsRow segments={southSegments} width={planW} />
          </Column>
        </Row>
      ) : null}
    </Column>
  );
}

/** The graphic scale bar — alternating ink and paper segments
 *  under the plan, the way a surveyed sheet carries it. Its zero
 *  is aligned to the plate's west edge by the caller, so the bar
 *  measures the drawing it sits under. */
export function ScaleBar({ pxPerFt, maxFt = 20, stepFt = 5 }: { pxPerFt: number; maxFt?: number; stepFt?: number }) {
  const segs = maxFt / stepFt;
  const segW = stepFt * pxPerFt;
  const total = maxFt * pxPerFt;
  return (
    <Column style={{ width: total, gap: 3 }}>
      <Svg width={total} height={8} viewBox={`0 0 ${total} 8`} title="Scale bar">
        {Array.from({ length: segs }, (_, i) => (
          <Rect
            key={i}
            x={pt(i * segW)}
            y={0}
            width={pt(segW)}
            height={8}
            style={{ fill: i % 2 === 0 ? palette.ink : palette.paper, stroke: palette.ink, strokeWidth: 1 }}
          />
        ))}
      </Svg>
      <Row style={{ width: total }}>
        {Array.from({ length: segs }, (_, i) => (
          <Text key={i} style={{ fontFamily: fonts.mono, fontSize: 8, color: palette.stone, flex: 1 }}>
            {i * stepFt}
          </Text>
        ))}
        <Text style={{ fontFamily: fonts.mono, fontSize: 8, fontWeight: 600, color: palette.stone }}>{maxFt} FT</Text>
      </Row>
    </Column>
  );
}

/** The drawing's title block — the strip a real sheet carries. */
export function PlanTitleBlock({ cells }: { cells: { label: string; value: string }[] }) {
  return (
    <Row style={{ gap: 0, border: { width: 1.5, style: "solid", color: palette.ink } }}>
      {cells.map((c, i) => (
        <Column
          key={c.label}
          style={{
            flex: 1,
            gap: 2,
            padding: [9, 14],
            border: i > 0 ? { left: { width: 1, style: "solid", color: palette.ink } } : undefined,
          }}
        >
          <Text style={{ fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1.8, textTransform: "uppercase", color: palette.stone, fontWeight: 600 }}>
            {c.label}
          </Text>
          <Text style={{ fontFamily: fonts.mono, fontSize: 11.5, fontWeight: 600 }}>{c.value}</Text>
        </Column>
      ))}
    </Row>
  );
}
