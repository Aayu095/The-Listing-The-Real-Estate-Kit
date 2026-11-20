import React from "react";
import { Canvas, Column, Divider, LineBreak, Row, Span, Text } from "@hyper-elements/react";
import { fonts, listingTheme, palette } from "./theme";
import { Masthead, MonoValue, SheetStamp, monoLabel } from "./components";
import { FloorPlan, ScaleBar } from "./plan";
import {
  agent,
  carpetSqft,
  efficiencyPct,
  emiInr,
  inr,
  inrShort,
  listing,
  localityDiffPct,
  num,
  pct,
  pricePerSqftCarpet,
  product,
  signedPct,
  totalAcquisitionInr,
} from "./data";

// The listing poster as a drawing sheet: masthead, the plan as the
// hero, the price set like a title block, the costs as a measured
// strip, and the open house in the one oxblood band. 1080×1350.
export default function ListingCanvas() {
  return (
    <Canvas
      theme={listingTheme}
      width={1080}
      height={1350}
      title={`The Listing — ${listing.project}, ${listing.locality} — Sheet ${listing.sheet}`}
      style={{ backgroundColor: palette.paper, padding: [34, 52], gap: 0 }}
    >
      <Masthead
        right={`Listing — ${listing.ref}`}
        metaLeft={`Listed — ${listing.listedLabel}`}
        metaCenter={`${listing.locality}, ${listing.city}`}
        metaRight={
          <>
            {"Status — "}
            <Span style={{ color: palette.oxblood, fontWeight: 600 }}>{"\u00A0Open for offers"}</Span>
          </>
        }
      />

      {/* ——— Headline ——— */}
      <Column style={{ gap: 6, padding: [17, 0, 0] }}>
        <Text style={{ ...monoLabel, fontSize: 11, color: palette.oxblood, fontWeight: 600 }}>
          For sale — {listing.config} · {listing.unit} · {listing.tower} · Floor {listing.floor} of {listing.floorsTotal}
        </Text>
        <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 57, lineHeight: 1.0 }}>
          {listing.project}
          <Span style={{ fontWeight: 500, fontStyle: "italic", color: palette.oxblood }}>{"\u00A0— "}{listing.locality}</Span>
        </Text>
      </Column>

      {/* ——— The plan, with the scale bar under the plate ——— */}
      <Column style={{ padding: [12, 0, 0], alignItems: "center" }}>
        <FloorPlan width={960} detail="full" bottomDims={false} />
        <Row style={{ width: 960, padding: [4, 0, 0] }}>
          <Column style={{ width: 48, flex: "none" }} />
          <ScaleBar pxPerFt={19} />
        </Row>
      </Column>

      {/* ——— Price block ——— */}
      <Row style={{ gap: 36, padding: [13, 0, 0], alignItems: "center" }}>
        <Column style={{ gap: 2 }}>
          <Text style={{ ...monoLabel, fontSize: 10, color: palette.stone, fontWeight: 600 }}>Asking price</Text>
          <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1, color: palette.oxblood }}>
            {inrShort(listing.priceInr)}
          </Text>
          <MonoValue text={inr(listing.priceInr)} style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.stone }} />
        </Column>
        <Column style={{ flex: 1, gap: 5, border: { left: { width: 1.5, style: "solid", color: palette.ink } }, padding: [2, 0, 2, 26] }}>
          <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 17.5 }}>
            {inr(pricePerSqftCarpet)} per sq ft · {num(carpetSqft)} sq ft carpet
          </Text>
          <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 17.5 }}>
            Carpet efficiency {pct(efficiencyPct)} · {signedPct(localityDiffPct)} against {listing.locality}
          </Text>
          <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.stone, letterSpacing: 0.5 }}>
            {listing.facing.toUpperCase()} · {listing.furnishing.toUpperCase()} · {listing.status.toUpperCase()}
          </Text>
        </Column>
        <SheetStamp sheet={listing.sheet} small />
      </Row>

      {/* ——— Cost strip ——— */}
      <Column style={{ padding: [16, 0, 0] }}>
        <Divider style={{ borderTop: { width: 1.5, style: "solid", color: palette.ink } }} />
        <Row style={{ gap: 0, padding: [12, 0] }}>
          {[
            { label: "EMI, if you borrow 80%", value: `${inr(emiInr)} / mo` },
            { label: "All-in, with Karnataka charges", value: inrShort(totalAcquisitionInr) },
            { label: "Open house", value: `${listing.openHouse.dateLabel} · ${listing.openHouse.timeLabel}` },
          ].map((c, i) => (
            <Column
              key={c.label}
              style={{
                flex: 1,
                gap: 3,
                padding: [0, 18, 0, i === 0 ? 0 : 18],
                border: i > 0 ? { left: { width: 1, style: "solid", color: palette.hairline } } : undefined,
              }}
            >
              <Text style={{ ...monoLabel, fontSize: 9, color: palette.stone, fontWeight: 600 }}>{c.label}</Text>
              <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 20.5, lineHeight: 1.1 }}>{c.value}</Text>
            </Column>
          ))}
        </Row>
        <Divider style={{ borderTop: { width: 1.5, style: "solid", color: palette.ink } }} />
      </Column>

      {/* ——— Open house band ——— */}
      <Column style={{ padding: [16, 0, 0] }}>
      <Column style={{ backgroundColor: palette.oxblood, padding: [13, 22] }}>
        <Row style={{ gap: 16, alignItems: "center" }}>
          <Text style={{ color: palette.paper, fontFamily: fonts.display, fontWeight: 700, fontSize: 20, letterSpacing: 0.4, flex: 1, lineHeight: 1.15 }}>
            OPEN HOUSE — {listing.openHouse.dayLabel.toUpperCase()}, {listing.openHouse.dateLabel.toUpperCase()}
            <LineBreak />
            {listing.openHouse.timeLabel}
          </Text>
          <Text style={{ color: palette.paper, fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1.2, textAlign: "right" }}>
            {agent.name.toUpperCase()} · {agent.phone}
          </Text>
        </Row>
      </Column>
      </Column>

      {/* ——— Footer ——— */}
      <Column style={{ gap: 8, padding: [13, 0, 0] }}>
        <Row style={{ gap: 16 }}>
          <Text style={{ ...monoLabel, fontSize: 10, flex: 1 }}>
            {product.name} — {product.tagline}
          </Text>
          <Text style={{ ...monoLabel, fontSize: 10, textAlign: "right" }}>
            Sheet {listing.sheet} · Fictional listing — the arithmetic is real
          </Text>
        </Row>
      </Column>
    </Canvas>
  );
}
