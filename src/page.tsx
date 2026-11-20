import React from "react";
import { Button, Column, Divider, Grid, LineBreak, Page, Row, Section, Span, Text } from "@hyper-elements/react";
import { fontFaces, fonts, listingTheme, palette, space } from "./theme";
import { CostRow, Crosshair, Fact, GridTexture, LocalityGauge, Masthead, SectionHead, ShareBar, SheetStamp, monoLabel } from "./components";
import { FloorPlan, NorthArrow, PlanTitleBlock, ScaleBar } from "./plan";
import {
  agent,
  balconySqft,
  carpetSqft,
  demoBaseUrl,
  disclaimer,
  efficiencyPct,
  emiInr,
  inr,
  inrShort,
  listing,
  localityDiffPct,
  localityVerdictLabel,
  loanPrincipalInr,
  num,
  pct,
  pricePerSqftCarpet,
  pricePerSqftSuper,
  product,
  registrationInr,
  roomFacts,
  signedPct,
  stampDutyInr,
  superBuiltupSqft,
  totalAcquisitionInr,
  totalChargesInr,
  totalInterestInr,
  totalRepaymentInr,
  ftIn,
} from "./data";

// The listing page as an architect's sheet: masthead, the plan as
// hero, the room schedule as a measured table, the money as a cost
// sheet with its arithmetic showing, and the visit. Everything on it
// is computed from the one listing file.
export default function ListingPage() {
  const carpetRooms = roomFacts.filter((r) => r.countsToCarpet);
  return (
    <Page
      theme={listingTheme}
      width={1120}
      title={`The Listing — ${listing.project}, ${listing.locality} — Keystone Estates`}
      description="A real-estate listing drawn as an architect's sheet: a floor plan drawn in code from the room file, a measured room schedule, and a cost sheet whose EMI, stamp duty and locality verdict are all computed."
      fonts={fontFaces}
      style={{ backgroundColor: palette.paper, gap: 0 }}
    >
      <Section style={{ backgroundColor: palette.paper, padding: [48, 64, 56] }}>
        <Column style={{ gap: 0 }}>
          <Masthead
            right={`Listing — ${listing.ref} · Sheet ${listing.sheet}`}
            metaLeft={`Listed — ${listing.listedLabel}`}
            metaCenter={`${listing.project} · ${listing.locality}, ${listing.city}`}
            metaRight={
              <>
                {"Status — "}
                <Span style={{ color: palette.oxblood, fontWeight: 600 }}>Open for offers</Span>
              </>
            }
          />

          {/* ——— Hero ——— */}
          <Column style={{ gap: 20, padding: [36, 0, 0] }}>
            <Row style={{ gap: 48 }}>
              <Column style={{ flex: 1.85, gap: 18 }}>
                <Text style={{ ...monoLabel, fontSize: 11, color: palette.oxblood, fontWeight: 600 }}>
                  A new sheet on the register — {listing.config} · {listing.unit} · {listing.tower}
                </Text>
                <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 63, lineHeight: 1.02, letterSpacing: 0.2 }}>
                  {listing.project},
                  <LineBreak />
                  <Span style={{ fontStyle: "italic", color: palette.oxblood }}>drawn to measure.</Span>
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 1.6, maxWidth: 590 }}>
                  An {listing.facing.toLowerCase()} {listing.config} on the {listing.floor}th floor of{" "}
                  {listing.floorsTotal} at {listing.locality} — {listing.status.toLowerCase()},{" "}
                  {listing.furnishing.toLowerCase()}, and measured the way a draughtsman measures:
                  every room below is drawn from the plan, and every rupee on this sheet is
                  arithmetic, not adjectives. The premium over {listing.locality} is stated, not
                  hidden — and the sheet shows what it buys.
                </Text>
                <Row style={{ gap: 10, alignItems: "center", padding: [4, 0, 0] }}>
                  <Crosshair size={15} />
                  <Text style={{ ...monoLabel, fontSize: 10 }}>
                    Plan, schedule &amp; costs — one file, src/data.ts
                  </Text>
                </Row>
              </Column>
              <Column
                style={{
                  flex: 1,
                  gap: 6,
                  border: { left: { width: 1.5, style: "solid", color: palette.ink } },
                  padding: [4, 0, 0, 28],
                }}
              >
                <Text style={{ ...monoLabel, fontSize: 10.5, color: palette.stone, fontWeight: 600 }}>Asking price</Text>
                <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1, color: palette.oxblood }}>
                  {inrShort(listing.priceInr)}
                </Text>
                <Text style={{ fontFamily: fonts.mono, fontSize: 11.5, color: palette.stone }}>{inr(listing.priceInr)}</Text>
                <Column style={{ padding: [10, 0, 0] }}>
                  <CostRow label="Per sq ft — carpet" value={inr(pricePerSqftCarpet)} first labelSize={13.5} valueSize={12.5} />
                  <CostRow label="Per sq ft — super built-up" value={inr(pricePerSqftSuper)} labelSize={13.5} valueSize={12.5} />
                  <CostRow label="Carpet efficiency" value={pct(efficiencyPct)} labelSize={13.5} valueSize={12.5} />
                  <CostRow label="Against Whitefield" value={signedPct(localityDiffPct)} accent labelSize={13.5} valueSize={12.5} />
                </Column>
              </Column>
            </Row>
            <Row style={{ gap: 14, alignItems: "center", padding: [10, 0, 0] }}>
              <Crosshair size={15} color={palette.oxblood} />
              <GridTexture width={916} height={30} step={26} />
              <Crosshair size={15} color={palette.oxblood} />
            </Row>
          </Column>

          {/* ——— 01 · The plan ——— */}
          <Column style={{ gap: 18, padding: [44, 0, 0] }}>
            <SectionHead index="01" label="The plan" right="Drawn in code from the room file — walls, doors, windows, fixtures" rightWidth={430} />
            <Column style={{ gap: 8 }}>
              <FloorPlan width={992} detail="full" />
              <Row style={{ width: 992 }}>
                <Column style={{ width: 48, flex: "none" }} />
                <ScaleBar pxPerFt={944 / 48} />
              </Row>
            </Column>
            <Row style={{ gap: 18, alignItems: "stretch" }}>
              <Column style={{ flex: 1 }}>
                <PlanTitleBlock
                  cells={[
                    { label: "Project", value: `${listing.project} · ${listing.tower}` },
                    { label: "Unit", value: `${listing.unit} · Floor ${listing.floor} of ${listing.floorsTotal}` },
                    { label: "Dimensions", value: "Feet & inches, as drawn" },
                    { label: "Sheet", value: listing.sheet },
                  ]}
                />
              </Column>
              <Column style={{ justifyContent: "center" }}>
                <NorthArrow size={44} />
              </Column>
            </Row>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, maxWidth: 800 }}>
              Read the plan as the surveyor left it: the plate is {listing.plate.wFt}'-0" × {listing.plate.dFt}'-0" —{" "}
              {num(superBuiltupSqft)} sq ft of super built-up area. The rooms inside sum to{" "}
              {num(carpetSqft)} sq ft of carpet; the {balconySqft} sq ft balcony is drawn and
              scheduled, but — as RERA requires — it is <Span style={{ fontStyle: "italic" }}>not</Span> counted in the carpet. Door
              swings, window bands and the kitchen and bath fixtures are all placed by the same
              file that prices the home.
            </Text>
          </Column>

          {/* ——— 02 · The rooms ——— */}
          <Column style={{ gap: 14, padding: [44, 0, 0] }}>
            <SectionHead index="02" label="The room schedule" right="Areas computed — width × depth, from the plan" rightWidth={360} />
            <Row style={{ gap: 20, padding: [8, 0, 10] }}>
              <Text style={{ ...monoLabel, fontSize: 9.5, letterSpacing: 2, fontWeight: 600, flex: 1 }}>Room</Text>
              <Text style={{ ...monoLabel, fontSize: 9.5, letterSpacing: 2, fontWeight: 600, width: 190 }}>Dimensions</Text>
              <Text style={{ ...monoLabel, fontSize: 9.5, letterSpacing: 2, fontWeight: 600, width: 330 }}>Share of carpet</Text>
              <Text style={{ ...monoLabel, fontSize: 9.5, letterSpacing: 2, fontWeight: 600, width: 110, textAlign: "right" }}>Area</Text>
            </Row>
            <Divider style={{ borderTop: { width: 2, style: "solid", color: palette.ink } }} />
            {roomFacts.map((r) => (
              <Row
                key={r.name}
                style={{
                  gap: 20,
                  padding: [13, 0],
                  alignItems: "center",
                  border: { bottom: { width: 1, style: "solid", color: palette.hairline } },
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 600,
                    fontSize: 18,
                    flex: 1,
                    color: r.countsToCarpet ? palette.ink : palette.stone,
                  }}
                >
                  {r.name}
                  {r.countsToCarpet ? "" : <Span style={{ fontFamily: fonts.mono, fontSize: 9.5, fontWeight: 400 }}> · NOT IN CARPET</Span>}
                </Text>
                <Text style={{ fontFamily: fonts.mono, fontSize: 12, width: 190 }}>
                  {ftIn(r.w)} × {ftIn(r.d)}
                </Text>
                <Column style={{ width: 330 }}>
                  {r.countsToCarpet ? (
                    <ShareBar value={r.shareOfCarpetPct} width={330} height={9} />
                  ) : (
                    <Text style={{ fontFamily: fonts.mono, fontSize: 10.5, color: palette.stone }}>OPEN TO SKY — EXCLUDED PER RERA</Text>
                  )}
                </Column>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 13.5,
                    fontWeight: 600,
                    width: 110,
                    textAlign: "right",
                    color: r.countsToCarpet ? palette.ink : palette.stone,
                  }}
                >
                  {r.areaSqft} SQ FT
                </Text>
              </Row>
            ))}
            <Row style={{ gap: 20, padding: [16, 0, 0], alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 20, flex: 1 }}>Carpet area — as summed from the plan</Text>
              <Text style={{ fontFamily: fonts.mono, fontSize: 15, fontWeight: 600, color: palette.oxblood }}>
                {num(carpetSqft)} SQ FT · {pct(efficiencyPct)} OF THE PLATE
              </Text>
            </Row>
          </Column>

          {/* ——— 03 · The money ——— */}
          <Column style={{ gap: 18, padding: [44, 0, 0] }}>
            <SectionHead index="03" label="The cost sheet" right="Every figure derived — change the price and the sheet redraws" rightWidth={420} />
            <Row style={{ gap: 48 }}>
              <Column style={{ flex: 1.15 }}>
                <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 23, padding: [2, 0, 8] }}>
                  The acquisition, line by line
                </Text>
                <CostRow label="Asking price" sub={`${listing.project} · ${listing.unit}`} value={inr(listing.priceInr)} first strong />
                <CostRow
                  label="Stamp duty"
                  sub={`${listing.charges.state} · ${listing.charges.stampDutyPct}% OF PRICE`}
                  value={inr(stampDutyInr)}
                />
                <CostRow label="Registration" sub={`${listing.charges.state} · ${listing.charges.registrationPct}% OF PRICE`} value={inr(registrationInr)} />
                <CostRow label="Government charges, total" value={inr(totalChargesInr)} />
                <CostRow label="Total acquisition cost" sub="PRICE + CHARGES, NOTHING HIDDEN" value={inr(totalAcquisitionInr)} strong accent />
                <Text style={{ fontFamily: fonts.body, fontSize: 13.5, lineHeight: 1.55, padding: [12, 0, 0], maxWidth: 460 }}>
                  The all-in figure is the one to budget against: {inrShort(totalAcquisitionInr)} —
                  the asking price plus {inrShort(totalChargesInr)} of {listing.charges.state}{" "}
                  charges, each computed from the price at the stated rate.
                </Text>
              </Column>
              <Column
                style={{
                  flex: 1,
                  gap: 6,
                  border: { left: { width: 1.5, style: "solid", color: palette.ink } },
                  padding: [4, 0, 0, 28],
                }}
              >
                <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 23 }}>The loan, if you borrow</Text>
                <Row style={{ gap: 10, alignItems: "end", padding: [6, 0, 2] }}>
                  <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 47, lineHeight: 1, color: palette.oxblood }}>
                    {inr(emiInr)}
                  </Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 14, padding: [0, 0, 6] }}>/ month</Text>
                </Row>
                <CostRow label="Loan" sub={`${Math.round(listing.loan.fractionOfPrice * 100)}% OF THE ASKING PRICE`} value={inr(loanPrincipalInr)} first labelSize={13.5} valueSize={12.5} />
                <CostRow label="Rate · tenure" value={`${listing.loan.annualRatePct.toFixed(2)}% · ${listing.loan.years} YRS`} labelSize={13.5} valueSize={12.5} />
                <CostRow label="Total interest" value={inr(totalInterestInr)} labelSize={13.5} valueSize={12.5} />
                <CostRow label="Total repayment" value={inr(totalRepaymentInr)} labelSize={13.5} valueSize={12.5} />
                <Text style={{ fontFamily: fonts.mono, fontSize: 10.5, color: palette.stone, lineHeight: 1.5, padding: [8, 0, 0] }}>
                  EMI = P · r(1+r)^n / ((1+r)^n − 1), r monthly, n = {listing.loan.years * 12} — the
                  standard amortisation, run on the parameters above.
                </Text>
              </Column>
            </Row>
            <Column style={{ gap: 8, padding: [14, 0, 0] }}>
              <Divider style={{ borderTop: { width: 1, style: "solid", color: palette.hairline } }} />
              <Row style={{ gap: 32, alignItems: "center", padding: [10, 0, 0] }}>
                <Column style={{ gap: 8, flex: 1 }}>
                  <Text style={{ ...monoLabel, fontSize: 10, fontWeight: 600, color: palette.stone }}>
                    Against {listing.locality} — average {inr(listing.localityAvgPerSqft)} / sq ft
                  </Text>
                  <LocalityGauge width={560} height={40} />
                  <Grid columns={3} style={{ width: 560 }}>
                    <Text style={{ fontFamily: fonts.mono, fontSize: 9.5 }}>−15%</Text>
                    <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, textAlign: "center" }}>LOCALITY AVERAGE</Text>
                    <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, textAlign: "right" }}>+15%</Text>
                  </Grid>
                </Column>
                <Column style={{ width: 330, gap: 6 }}>
                  <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 25, color: palette.oxblood, lineHeight: 1.15 }}>
                    {localityVerdictLabel} — {signedPct(localityDiffPct)}.
                  </Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 13.5, lineHeight: 1.55 }}>
                    Priced above the {listing.locality} average, and the sheet says so plainly.
                    What the premium buys is on the plan: the {listing.floor}th floor, the east
                    light, and {balconySqft} sq ft of open deck.
                  </Text>
                </Column>
              </Row>
            </Column>
          </Column>

          {/* ——— 04 · The visit ——— */}
          <Column style={{ gap: 18, padding: [44, 0, 0] }}>
            <SectionHead index="04" label="The visit" right="Open house + private viewings" rightWidth={260} />
            <Row style={{ gap: 48 }}>
              <Column style={{ flex: 1.3, gap: 14 }}>
                <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 31, lineHeight: 1.12 }}>
                  Open house — {listing.openHouse.dayLabel},{" "}
                  <Span style={{ fontStyle: "italic", color: palette.oxblood }}>{listing.openHouse.dateLabel}</Span>,
                  <LineBreak />
                  {listing.openHouse.timeLabel}.
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 1.6, maxWidth: 520 }}>
                  Walk the plan before you walk the flat: the sheet above is the home, to the
                  inch. At the open house, {agent.name.split(" ")[0]} will have the printed
                  brochure — this same drawing, at A4 — and the cost sheet with every figure
                  you've seen here.
                </Text>
                <Row style={{ gap: 12, padding: [6, 0, 0] }}>
                  <Button href={`${demoBaseUrl}brochure.pdf`}>Download the brochure</Button>
                  <Button
                    href={demoBaseUrl}
                    style={{
                      backgroundColor: palette.paper,
                      color: palette.ink,
                      border: { width: 1.5, style: "solid", color: palette.ink },
                      hover: { backgroundColor: palette.parchment },
                    }}
                  >
                    Book a private viewing
                  </Button>
                </Row>
              </Column>
              <Column style={{ flex: 1, backgroundColor: palette.parchment, padding: [22, 26], gap: 10 }}>
                <Text style={{ ...monoLabel, fontSize: 9.5, fontWeight: 600, color: palette.stone }}>Your broker</Text>
                <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 26, lineHeight: 1.05 }}>{agent.name}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 13.5 }}>
                  {agent.role} · {agent.firm}
                </Text>
                <Divider style={{ borderTop: { width: 1, style: "solid", color: palette.ink } }} />
                <Grid columns={2} style={{ gap: 14 }}>
                  <Fact label="Phone" value={agent.phone} valueSize={13.5} display={false} />
                  <Fact label="Email" value={agent.email} valueSize={13.5} display={false} />
                </Grid>
                <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, color: palette.stone, lineHeight: 1.5 }}>{agent.note}</Text>
              </Column>
            </Row>
          </Column>

          {/* ——— Footer ——— */}
          <Column style={{ gap: 12, padding: [space.max, 0, 0] }}>
            <Divider style={{ borderTop: { width: 2.5, style: "solid", color: palette.ink } }} />
            <Row style={{ gap: 16 }}>
              <Text style={{ ...monoLabel, fontSize: 10.5, flex: 1 }}>
                {product.name} — {product.tagline}
              </Text>
              <Text style={{ ...monoLabel, fontSize: 10.5, textAlign: "right" }}>
                End of sheet · {listing.ref}
              </Text>
            </Row>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 1.5, maxWidth: 800 }}>{disclaimer}</Text>
          </Column>
        </Column>
      </Section>
    </Page>
  );
}
