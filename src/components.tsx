import React from "react";
import { Column, Divider, Grid, Polygon, Rect, Row, Span, Svg, Text } from "@hyper-elements/react";
import { fonts, palette, space } from "./theme";
import { localityDiffPct } from "./data";

// Shared blocks for The Listing — "The Drawing Sheet". Everything is
// ruled, lettered and measured: hairline drafting rules, Cormorant
// Garamond display with italic accents, JetBrains Mono reserved for
// measurements and sheet references, oxblood spent only where a
// draughtsman's red pencil would fall — the price, the verdict, the
// stamp.

/** Small mono label — measurements and sheet references only. */
export const monoLabel = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
};

/** The keystone: a trapezoid, drawn. The firm's mark — Svg, so it
 *  stays out of the Email (which uses the text-only variant below). */
export function KeystoneMark({ size = 30, color = palette.ink }: { size?: number; color?: string }) {
  const w = size;
  const h = size * 0.82;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} title="Keystone">
      <Polygon points={`${w * 0.18},0 ${w * 0.82},0 ${w},${h} 0,${h}`} style={{ fill: color }} />
      <Polygon points={`${w * 0.44},${h * 0.3} ${w * 0.56},${h * 0.3} ${w * 0.6},${h} ${w * 0.4},${h}`} style={{ fill: palette.paper }} />
    </Svg>
  );
}

/** Firm wordmark — keystone + KEYSTONE ESTATES in Cormorant caps. */
export function Wordmark({ fontSize = 27, markSize = 26 }: { fontSize?: number; markSize?: number }) {
  // Explicit width: satori double-measures the nested flex row and
  // would push whatever follows it off the sheet (see BUILD_LOG).
  const width = markSize + 23 + Math.round(fontSize * 11.2);
  return (
    <Row style={{ gap: 12, alignItems: "center", flex: "none", width }}>
      <KeystoneMark size={markSize} />
      <Row style={{ gap: 11, alignItems: "end", flex: "none" }}>
        <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize, letterSpacing: 3.5, lineHeight: 1, flex: "none" }}>KEYSTONE</Text>
        <Text style={{ fontFamily: fonts.display, fontWeight: 500, fontSize, letterSpacing: 3.5, lineHeight: 1, flex: "none" }}>ESTATES</Text>
      </Row>
    </Row>
  );
}

/** Email-safe wordmark: a drawn block (layout, not Svg) + type. */
export function EmailWordmark({ fontSize = 21 }: { fontSize?: number }) {
  return (
    <Row style={{ gap: 10, alignItems: "center" }}>
      <Column style={{ width: Math.round(fontSize * 0.62), height: Math.round(fontSize * 0.52), backgroundColor: palette.ink, flex: "none" }} />
      <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize, letterSpacing: 3, lineHeight: 1 }}>
        KEYSTONE ESTATES
      </Text>
    </Row>
  );
}

/**
 * The sheet masthead: wordmark + right-hand mono sheet reference, a
 * rule, then a three-cell meta strip (listing / listed / status).
 */
export function Masthead({
  right,
  metaLeft,
  metaCenter,
  metaRight,
}: {
  right: React.ReactNode;
  metaLeft: React.ReactNode;
  metaCenter?: React.ReactNode;
  metaRight?: React.ReactNode;
}) {
  return (
    <Column style={{ gap: space.lg }}>
      <Row style={{ gap: 12, alignItems: "center" }}>
        <Wordmark />
        <Text style={{ ...monoLabel, fontSize: 11.5, flex: 1, textAlign: "right" }}>{right}</Text>
      </Row>
      <Divider style={{ borderTop: { width: 2.5, style: "solid", color: palette.ink } }} />
      <Row style={{ gap: 16 }}>
        <Text style={{ ...monoLabel, fontSize: 10.5, letterSpacing: 1.2, flex: 1 }}>{metaLeft}</Text>
        {metaCenter ? <Text style={{ ...monoLabel, fontSize: 10.5, letterSpacing: 1.2, flex: 1, textAlign: "center" }}>{metaCenter}</Text> : null}
        {metaRight ? <Text style={{ ...monoLabel, fontSize: 10.5, letterSpacing: 1.2, flex: 1, textAlign: "right" }}>{metaRight}</Text> : null}
      </Row>
    </Column>
  );
}

/** Numbered section head: italic Cormorant numeral in oxblood, caps
 *  label, mono right note, hairline under. */
export function SectionHead({
  index,
  label,
  right,
  rightWidth = 340,
}: {
  index: string;
  label: string;
  right?: string;
  rightWidth?: number;
}) {
  return (
    <Column style={{ gap: 10 }}>
      <Row style={{ gap: 14, alignItems: "end" }}>
        <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 21, color: palette.oxblood, lineHeight: 1, width: 34 }}>
          {index}
        </Text>
        <Text
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 14.5,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            lineHeight: 1,
            flex: 1,
          }}
        >
          {label}
        </Text>
        {right ? (
          <Text style={{ ...monoLabel, fontSize: 10, letterSpacing: 1.2, lineHeight: 1, width: rightWidth, textAlign: "right" }}>
            {right}
          </Text>
        ) : null}
      </Row>
      <Divider style={{ borderTop: { width: 1, style: "solid", color: palette.ink } }} />
    </Column>
  );
}

/**
 * The sheet stamp: a double-ruled rectangle in oxblood — the sheet
 * number and the drawing's status. Column-based (no Svg), so the
 * Email can carry a variant too.
 */
export function SheetStamp({ sheet, line2 = "For sale · Nov 2026", small = false }: { sheet: string; line2?: string; small?: boolean }) {
  return (
    <Column style={{ border: { width: 2.5, style: "solid", color: palette.oxblood }, padding: 3.5, alignItems: "center" }}>
      <Column style={{ border: { width: 1, style: "solid", color: palette.oxblood }, padding: small ? [7, 14] : [10, 20], alignItems: "center", gap: 2 }}>
        <Text style={{ fontFamily: fonts.mono, fontSize: small ? 12 : 14.5, fontWeight: 600, letterSpacing: 2.5, color: palette.oxblood, textAlign: "center" }}>
          SHEET {sheet}
        </Text>
        <Text style={{ fontFamily: fonts.mono, fontSize: small ? 8.5 : 9.5, letterSpacing: 1.8, color: palette.oxblood, textAlign: "center", textTransform: "uppercase" }}>
          {line2}
        </Text>
      </Column>
    </Column>
  );
}

/** Label + value fact (mono label, Cormorant or Inter value). */
export function Fact({
  label,
  value,
  valueSize = 16,
  accent = false,
  display = true,
}: {
  label: string;
  value: string;
  valueSize?: number;
  accent?: boolean;
  display?: boolean;
}) {
  return (
    <Column style={{ gap: space.xs }}>
      <Text style={{ ...monoLabel, fontSize: 9.5, letterSpacing: 2, fontWeight: 600, color: palette.stone }}>{label}</Text>
      <Text
        style={{
          fontFamily: display ? fonts.display : fonts.body,
          fontWeight: display ? 600 : 500,
          fontSize: valueSize,
          color: accent ? palette.oxblood : palette.ink,
          lineHeight: 1.15,
        }}
      >
        {value}
      </Text>
    </Column>
  );
}

/** A mono value that may contain ₹: JetBrains Mono has no rupee
 *  glyph, so the sign itself is set in Inter — the digits stay mono
 *  and tabular, the ₹ sits quietly among them. */
export function MonoValue({ text, style }: { text: string; style?: React.ComponentProps<typeof Text>["style"] }) {
  const parts = text.split("₹");
  return (
    <Text style={style}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Span style={{ fontFamily: fonts.body, fontWeight: 600 }}>₹</Span> : null}
          {p}
        </React.Fragment>
      ))}
    </Text>
  );
}

/** A ruled cost row: label left, mono value right, hairline above
 *  (except the first). The drawing sheet's table substitute. */
export function CostRow({
  label,
  sub,
  value,
  first = false,
  strong = false,
  accent = false,
  labelSize = 15,
  valueSize = 14,
}: {
  label: string;
  sub?: string;
  value: string;
  first?: boolean;
  strong?: boolean;
  accent?: boolean;
  labelSize?: number;
  valueSize?: number;
}) {
  return (
    <Grid
      columns={2}
      style={{
        gap: 16,
        padding: [11, 0],
        alignItems: "center",
        border: first ? undefined : { top: { width: 1, style: "solid", color: palette.hairline } },
      }}
    >
      <Column style={{ gap: 1 }}>
        <Text
          style={{
            fontFamily: strong ? fonts.display : fonts.body,
            fontWeight: strong ? 700 : 500,
            fontSize: strong ? labelSize + 2 : labelSize,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
        {sub ? <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.stone, letterSpacing: 0.6 }}>{sub}</Text> : null}
      </Column>
      <MonoValue
        text={value}
        style={{
          fontFamily: fonts.mono,
          fontSize: valueSize,
          fontWeight: 600,
          color: accent ? palette.oxblood : palette.ink,
          textAlign: "right",
        }}
      />
    </Grid>
  );
}

/** An outlined bar meter (area shares, efficiency) — parchment track,
 *  ink fill, hairline frame. */
export function ShareBar({ value, width, height = 10, accent = false }: { value: number; width: number; height?: number; accent?: boolean }) {
  const pt = (n: number) => Math.round(n * 10) / 10;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} title={`Bar — ${Math.round(value)}`}>
      <Rect x={0.75} y={0.75} width={width - 1.5} height={height - 1.5} style={{ fill: palette.parchment, stroke: palette.ink, strokeWidth: 1.25 }} />
      <Rect x={2.5} y={2.5} width={pt(Math.max(0, (width - 5) * (value / 100)))} height={height - 5} style={{ fill: accent ? palette.oxblood : palette.ink }} />
    </Svg>
  );
}

/**
 * The locality gauge: a draughtsman's scale from −15% to +15% against
 * the locality average, the zero tick at centre, the listing's marker
 * placed by the computed difference. Pure geometry — the labels sit
 * in HTML beneath it.
 */
export function LocalityGauge({ width = 520, height = 40 }: { width?: number; height?: number }) {
  const lo = -15;
  const hi = 15;
  const x = (v: number) => ((v - lo) / (hi - lo)) * width;
  const midY = height - 12;
  const markerX = x(Math.max(lo, Math.min(hi, localityDiffPct)));
  const ticks = [-15, -10, -5, 0, 5, 10, 15];
  const pt = (n: number) => Math.round(n * 10) / 10;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} title="Locality gauge">
      {ticks.map((t) => (
        <Rect key={t} x={pt(x(t) - 0.75)} y={t === 0 ? midY - 13 : midY - 8} width={1.5} height={t === 0 ? 13 : 8} style={{ fill: palette.ink }} />
      ))}
      <Rect x={0} y={midY - 0.75} width={width} height={1.5} style={{ fill: palette.ink }} />
      <Polygon
        points={`${pt(markerX)},${midY - 24} ${pt(markerX - 7)},${midY - 13} ${pt(markerX + 7)},${midY - 13}`}
        style={{ fill: palette.oxblood }}
      />
      <Rect x={pt(markerX - 1.25)} y={midY - 13} width={2.5} height={13} style={{ fill: palette.oxblood }} />
    </Svg>
  );
}

/** Faint graph-paper grid, drawn — the drafting table under the ink.
 *  Used as a hero band behind headings (inside a Layer). */
export function GridTexture({ width, height, step = 26 }: { width: number; height: number; step?: number }) {
  const lines: React.ReactNode[] = [];
  for (let x = step; x < width; x += step) {
    lines.push(<Rect key={`v${x}`} x={x} y={0} width={0.75} height={height} style={{ fill: palette.grid }} />);
  }
  for (let y = step; y < height; y += step) {
    lines.push(<Rect key={`h${y}`} x={0} y={y} width={width} height={0.75} style={{ fill: palette.grid }} />);
  }
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} title="Drafting grid">
      {lines}
    </Svg>
  );
}

/** A draughtsman's crosshair register mark. */
export function Crosshair({ size = 18, color = palette.ink }: { size?: number; color?: string }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} title="Register mark">
      <Rect x={c - 0.75} y={0} width={1.5} height={size} style={{ fill: color }} />
      <Rect x={0} y={c - 0.75} width={size} height={1.5} style={{ fill: color }} />
      <Rect x={c - 3} y={c - 3} width={6} height={1} style={{ fill: color }} />
      <Rect x={c - 3} y={c + 2} width={6} height={1} style={{ fill: color }} />
      <Rect x={c - 3} y={c - 3} width={1} height={6} style={{ fill: color }} />
      <Rect x={c + 2} y={c - 3} width={1} height={6} style={{ fill: color }} />
    </Svg>
  );
}
