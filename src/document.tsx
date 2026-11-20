import React from "react";
import {
  Column,
  Document,
  Grid,
  Heading,
  List,
  ListItem,
  PageBreak,
  PageFooter,
  PageHeader,
  PageNumber,
  Row,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
} from "@hyper-elements/react";
import { fontFaces, fonts, listingTheme, palette } from "./theme";
import { CostRow, Fact, SheetStamp } from "./components";
import { FloorPlan, PlanTitleBlock, ScaleBar } from "./plan";
import {
  agent,
  balconySqft,
  carpetSqft,
  efficiencyPct,
  emiInr,
  ftIn,
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
} from "./data";

// The brochure as a drawing sheet: page 1 is the plan and the home;
// page 2 is the schedule and the cost sheet, arithmetic in full.
const headCell = {
  fontFamily: fonts.mono,
  fontSize: 8.5,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
  fontWeight: 600,
  color: palette.paper,
};
const monoCell = { fontFamily: fonts.mono, fontSize: 9.5, color: palette.ink };
const tableStyle = {
  border: { width: 1.5, style: "solid", color: palette.ink },
  cellPadding: [3.4, 7] as [number, number],
  rowBorder: { width: 1, style: "solid", color: palette.hairline },
};

function DocSection({ index, title, right }: { index: string; title: string; right?: string }) {
  return (
    <Row style={{ gap: 10, alignItems: "end" }}>
      <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 15, color: palette.oxblood, lineHeight: 1, width: 22 }}>
        {index}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 11.5, letterSpacing: 1.6, textTransform: "uppercase", lineHeight: 1, flex: 1 }}>
        {title}
      </Text>
      {right ? (
        <Text style={{ fontFamily: fonts.mono, fontSize: 8, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>{right}</Text>
      ) : null}
    </Row>
  );
}

export default function BrochureDocument() {
  return (
    <Document
      theme={listingTheme}
      size="A4"
      margin={46}
      title={`The Listing — ${listing.project}, ${listing.locality} — Brochure & Cost Sheet ${listing.ref}`}
      fonts={fontFaces}
      style={{ backgroundColor: palette.paper, gap: 0 }}
    >
      <PageHeader
        style={{ padding: [6, 2, 8], border: { bottom: { width: 2.5, style: "solid", color: palette.oxblood } } }}
      >
        <Row style={{ gap: 10, alignItems: "center" }}>
          <Column style={{ width: 11, height: 9, backgroundColor: palette.ink, flex: "none" }} />
          <Text style={{ fontFamily: fonts.display, fontSize: 14.5, fontWeight: 700, letterSpacing: 2.5, flex: 1 }}>
            KEYSTONE ESTATES
          </Text>
          <Text style={{ fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 600 }}>
            The Listing · {listing.ref} · Sheet {listing.sheet}
          </Text>
        </Row>
      </PageHeader>

      <PageFooter style={{ padding: [8, 0, 0], border: { top: { width: 1, style: "solid", color: palette.ink } } }}>
        <Row style={{ gap: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 8.5, flex: 1 }}>
            Sample data — the property, firm, prices and rates are fictional; the arithmetic is real and computed from the listing file. {product.name} · {listing.ref}.
          </Text>
          <Text style={{ fontSize: 9, fontWeight: 600 }}>
            Page <PageNumber /> of <PageNumber total />
          </Text>
        </Row>
      </PageFooter>

      {/* ——— Page 1 ——— */}
      <Column style={{ gap: 12 }}>
        <Column style={{ gap: 5 }}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: palette.oxblood }}>
            Brochure &amp; cost sheet · For sale · {listing.status}
          </Text>
          <Heading level={1} style={{ fontSize: 29, letterSpacing: 0.2 }}>
            {listing.project} — <Span style={{ fontStyle: "italic", color: palette.oxblood }}>{listing.locality}</Span>
          </Heading>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, lineHeight: 1.5 }}>
            A {listing.facing.toLowerCase()} {listing.config} ({listing.unit}, {listing.tower}, floor{" "}
            {listing.floor} of {listing.floorsTotal}) at {listing.addressLine} —{" "}
            {listing.furnishing.toLowerCase()}, {listing.tenure.toLowerCase()}. Below is the plan
            exactly as drawn from the listing file: check any room against the schedule on page
            two, and any figure against the cost sheet that follows it.
          </Text>
        </Column>

        <Column style={{ gap: 6 }}>
          <FloorPlan width={503} detail="compact" />
          <Row style={{ width: 503 }}>
            <Column style={{ width: 40, flex: "none" }} />
            <ScaleBar pxPerFt={463 / 48} />
          </Row>
        </Column>
        <PlanTitleBlock
          cells={[
            { label: "Project", value: `${listing.project} · ${listing.tower}` },
            { label: "Unit", value: `${listing.unit} · ${listing.floor} of ${listing.floorsTotal}` },
            { label: "Dimensions", value: "Feet & inches" },
            { label: "Sheet", value: listing.sheet },
          ]}
        />

        <Grid columns={4} style={{ gap: 14 }}>
          <Fact label="Asking price" value={inrShort(listing.priceInr)} valueSize={15} accent />
          <Fact label="Per sq ft — carpet" value={inr(pricePerSqftCarpet)} valueSize={15} />
          <Fact label="Carpet area" value={`${num(carpetSqft)} sq ft`} valueSize={15} />
          <Fact label="Carpet efficiency" value={pct(efficiencyPct)} valueSize={15} />
        </Grid>

        <Column style={{ backgroundColor: palette.parchment, padding: [11, 14], gap: 3 }}>
          <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 15.5, color: palette.oxblood }}>
            {localityVerdictLabel} — {signedPct(localityDiffPct)} against {listing.locality}.
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 10.5, lineHeight: 1.5 }}>
            This sheet asks {inr(pricePerSqftCarpet)} per sq ft of carpet against a{" "}
            {listing.locality} average of {inr(listing.localityAvgPerSqft)} — a premium of{" "}
            {signedPct(localityDiffPct)}, stated rather than hidden. The plate is{" "}
            {num(superBuiltupSqft)} sq ft ({inr(pricePerSqftSuper)} per sq ft of super built-up);
            the {balconySqft} sq ft balcony is drawn above but, per RERA, is not counted in the{" "}
            {num(carpetSqft)} sq ft carpet.
          </Text>
        </Column>
      </Column>

      <PageBreak />

      {/* ——— Page 2 ——— */}
      <Column style={{ gap: 12 }}>
        <Column style={{ gap: 5 }}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: palette.oxblood }}>
            Page two · The schedule &amp; the arithmetic
          </Text>
          <Heading level={2} style={{ fontSize: 23, letterSpacing: 0.2 }}>
            Measured, then <Span style={{ fontStyle: "italic", color: palette.oxblood }}>priced.</Span>
          </Heading>
        </Column>

        <Column style={{ gap: 8 }}>
          <DocSection index="01" title="Room schedule — from the plan" right="Areas = width × depth" />
          <Table style={tableStyle}>
            <TableRow header style={{ backgroundColor: palette.ink }}>
              <TableCell style={headCell}>Room</TableCell>
              <TableCell style={{ ...headCell, width: 118 }}>Dimensions</TableCell>
              <TableCell style={{ ...headCell, width: 74, textAlign: "right" }}>Area</TableCell>
              <TableCell style={{ ...headCell, width: 74, textAlign: "right" }}>Share</TableCell>
            </TableRow>
            {roomFacts.map((r) => (
              <TableRow key={r.name}>
                <TableCell style={{ fontSize: 9.8, fontWeight: 600, color: r.countsToCarpet ? palette.ink : palette.stone }}>
                  {r.name}
                  {r.countsToCarpet ? "" : " — not in carpet"}
                </TableCell>
                <TableCell style={monoCell}>
                  {ftIn(r.w)} × {ftIn(r.d)}
                </TableCell>
                <TableCell style={{ ...monoCell, fontWeight: 600, textAlign: "right" }}>{r.areaSqft} sq ft</TableCell>
                <TableCell style={{ ...monoCell, textAlign: "right" }}>
                  {r.countsToCarpet ? `${r.shareOfCarpetPct.toFixed(1)}%` : "—"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow style={{ backgroundColor: palette.ink }}>
              <TableCell style={{ fontFamily: fonts.display, fontSize: 10.5, fontWeight: 700, color: palette.paper }}>
                Carpet area — summed from the plan
              </TableCell>
              <TableCell style={{ ...monoCell, color: palette.paper }}>
                plate {listing.plate.wFt}' × {listing.plate.dFt}'
              </TableCell>
              <TableCell style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, textAlign: "right", color: palette.paper }}>
                {num(carpetSqft)} sq ft
              </TableCell>
              <TableCell style={{ ...monoCell, textAlign: "right", color: palette.paper }}>{pct(efficiencyPct, 1)}</TableCell>
            </TableRow>
          </Table>
        </Column>

        <Column style={{ gap: 4 }}>
          <DocSection index="02" title="The acquisition — price + Karnataka charges" />
          <CostRow label="Asking price" value={inr(listing.priceInr)} first labelSize={12} valueSize={11.5} />
          <CostRow label="Stamp duty" sub={`${listing.charges.stampDutyPct}% × ${inr(listing.priceInr)}`} value={inr(stampDutyInr)} labelSize={12} valueSize={11.5} />
          <CostRow label="Registration" sub={`${listing.charges.registrationPct}% × ${inr(listing.priceInr)}`} value={inr(registrationInr)} labelSize={12} valueSize={11.5} />
          <CostRow label="Total acquisition cost" sub="THE ALL-IN FIGURE" value={inr(totalAcquisitionInr)} strong accent labelSize={12.5} valueSize={12} />
        </Column>

        <Column style={{ gap: 4 }}>
          <DocSection index="03" title="The loan — amortised, not estimated" right={`${listing.loan.annualRatePct}% · ${listing.loan.years} years`} />
          <CostRow label="Loan principal" sub={`${Math.round(listing.loan.fractionOfPrice * 100)}% OF THE ASKING PRICE`} value={inr(loanPrincipalInr)} first labelSize={12} valueSize={11.5} />
          <CostRow label="EMI" sub="P · r(1+r)^n / ((1+r)^n − 1), MONTHLY" value={`${inr(emiInr)} / mo`} strong accent labelSize={12} valueSize={12} />
          <CostRow label="Total interest over the tenure" value={inr(totalInterestInr)} labelSize={12} valueSize={11.5} />
          <CostRow label="Total repayment" value={inr(totalRepaymentInr)} labelSize={12} valueSize={11.5} />
        </Column>

        <Column style={{ gap: 6 }}>
          <DocSection index="04" title="Notes" />
          <List style={{ fontFamily: fonts.body, fontSize: 10.5, lineHeight: 1.45 }}>
            <ListItem>Charges are {listing.charges.state}’s stated rates (stamp duty {listing.charges.stampDutyPct}%, registration {listing.charges.registrationPct}%) applied to the asking price — change the price or the state’s rates in the listing file and this sheet recomputes.</ListItem>
            <ListItem>Open house: {listing.openHouse.dayLabel}, {listing.openHouse.dateLabel}, {listing.openHouse.timeLabel}. Private viewings through {agent.name}, {agent.phone}.</ListItem>
            <ListItem>Every area on page one is width × depth from the room file; the carpet total is their sum, and the balcony is excluded per RERA.</ListItem>
          </List>
        </Column>

        <Row style={{ gap: 20, alignItems: "center", padding: [6, 0, 0] }}>
          <Column style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 14.5, fontWeight: 700 }}>
              Issued by {agent.name} · {agent.firm}
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: 8.5 }}>
              {agent.phone} · {agent.email} · Generated from the listing file — no figure placed by hand.
            </Text>
          </Column>
          <SheetStamp sheet={listing.sheet} line2="Brochure · 2 sheets" small />
        </Row>
      </Column>
    </Document>
  );
}
