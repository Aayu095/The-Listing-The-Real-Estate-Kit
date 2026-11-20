import React from "react";
import {
  Button,
  Column,
  Email,
  Grid,
  Heading,
  Row,
  Section,
  Span,
  Text,
} from "@hyper-elements/react";
import { fonts, listingTheme, palette } from "./theme";
import { CostRow, EmailWordmark, Fact, monoLabel } from "./components";
import {
  agent,
  carpetSqft,
  demoBaseUrl,
  efficiencyPct,
  emiInr,
  inr,
  inrShort,
  listing,
  listingUrl,
  localityDiffPct,
  num,
  pct,
  pricePerSqftCarpet,
  product,
  roomFacts,
  signedPct,
  totalAcquisitionInr,
} from "./data";

// The new-listing alert as a drawing sheet, in email-safe tables:
// masthead, Cormorant headline, the parchment price block, the plan
// in words (no Svg in email), the computed money rows, the open
// house band, and two square buttons.
const metaText = {
  fontFamily: fonts.mono,
  fontSize: 9.5,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
  fontWeight: 600,
};

/** A hard ink rule, built as a strip section (email-safe). */
function RuleStrip({ height = 2.5 }: { height?: number }) {
  return (
    <Section style={{ backgroundColor: palette.ink, padding: [0, 40] }}>
      <Text style={{ fontSize: height, lineHeight: 1, color: palette.ink }}>·</Text>
    </Section>
  );
}

const headlineRooms = ["Living Room", "Master Bedroom", "Dining", "Kitchen", "Bedroom 2", "Bedroom 3", "Balcony"]
  .map((n) => roomFacts.find((r) => r.name === n)!)
  .filter(Boolean);

export default function ListingAlertEmail() {
  return (
    <Email
      theme={listingTheme}
      width={600}
      title={`The Listing — ${listing.project}, ${listing.locality} — new on the register`}
      previewText={`New listing: ${listing.config} at ${listing.project}, ${listing.locality} — ${inrShort(listing.priceInr)} (${inr(pricePerSqftCarpet)} per sq ft of carpet). Open house ${listing.openHouse.dateLabel}.`}
      style={{ backgroundColor: palette.paper, gap: 0 }}
    >
      {/* Masthead */}
      <Section style={{ backgroundColor: palette.paper, padding: [30, 40, 18] }}>
        <Grid columns={2} style={{ gap: 12, alignItems: "center" }}>
          <EmailWordmark fontSize={20} />
          <Text style={{ ...metaText, textAlign: "right" }}>
            Listing — {listing.ref}
          </Text>
        </Grid>
      </Section>
      <RuleStrip />
      <Section style={{ backgroundColor: palette.paper, padding: [12, 40, 4] }}>
        <Grid columns={2} style={{ gap: 10 }}>
          <Text style={metaText}>New on the register — {listing.listedLabel}</Text>
          <Text style={{ ...metaText, textAlign: "right" }}>
            Status — <Span style={{ color: palette.oxblood }}>Open for offers</Span>
          </Text>
        </Grid>
      </Section>

      {/* Headline + intro */}
      <Section style={{ backgroundColor: palette.paper, padding: [22, 40, 6] }}>
        <Column style={{ gap: 14 }}>
          <Heading level={1} style={{ fontSize: 38, lineHeight: 1.08 }}>
            A {listing.locality} home,{" "}
            <Span style={{ fontStyle: "italic", color: palette.oxblood }}>drawn to measure.</Span>
          </Heading>
          <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 1.55 }}>
            Just listed with {product.name}: an {listing.facing.toLowerCase()} {listing.config} at{" "}
            {listing.project} ({listing.unit}, floor {listing.floor} of {listing.floorsTotal}) —{" "}
            {listing.status.toLowerCase()}, {listing.furnishing.toLowerCase()}. As always on our
            sheets, the figures below are computed from the plan, not written around it.
          </Text>
        </Column>
      </Section>

      {/* Price block */}
      <Section style={{ backgroundColor: palette.parchment, padding: [20, 40, 22] }}>
        <Grid columns={2} style={{ gap: 16, alignItems: "center" }}>
          <Column style={{ gap: 2 }}>
            <Text style={{ ...metaText, color: palette.stone }}>Asking price</Text>
            <Text style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 36, lineHeight: 1.05, color: palette.oxblood }}>
              {inrShort(listing.priceInr)}
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.stone }}>{inr(listing.priceInr)}</Text>
          </Column>
          <Column style={{ gap: 5 }}>
            <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 16.5 }}>
              {inr(pricePerSqftCarpet)} / sq ft of carpet
            </Text>
            <Text style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 16.5 }}>
              {num(carpetSqft)} sq ft carpet · {pct(efficiencyPct)} efficiency
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.stone, letterSpacing: 0.8 }}>
              {signedPct(localityDiffPct)} VS THE {listing.locality.toUpperCase()} AVERAGE
            </Text>
          </Column>
        </Grid>
      </Section>

      {/* Facts */}
      <Section style={{ backgroundColor: palette.paper, padding: [24, 40, 4] }}>
        <Grid columns={2} style={{ gap: 16, rowGap: 16 }}>
          <Fact label="Configuration" value={`${listing.config} · ${listing.unit}`} valueSize={14.5} />
          <Fact label="Floor" value={`${listing.floor} of ${listing.floorsTotal} · ${listing.tower}`} valueSize={14.5} />
          <Fact label="Facing" value={listing.facing} valueSize={14.5} />
          <Fact label="Furnishing · tenure" value={`${listing.furnishing} · ${listing.tenure}`} valueSize={14.5} />
        </Grid>
      </Section>

      {/* The plan in words */}
      <Section style={{ backgroundColor: palette.paper, padding: [22, 40, 4] }}>
        <Column style={{ gap: 6 }}>
          <Text style={{ ...metaText, fontSize: 10.5, letterSpacing: 2 }}>The plan, in words — areas from the drawing</Text>
          <Column>
            {headlineRooms.map((r, i) => (
              <CostRow
                key={r.name}
                label={r.name}
                value={`${r.areaSqft} SQ FT`}
                first={i === 0}
                labelSize={13.5}
                valueSize={12}
              />
            ))}
            <CostRow label="Carpet area, total" sub="BALCONY EXCLUDED PER RERA" value={`${num(carpetSqft)} SQ FT`} strong accent labelSize={13.5} valueSize={12} />
          </Column>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5 }}>
            The full drawing — walls, doors, windows, dimensions — is on the listing page, drawn
            in code from the same file as this email.
          </Text>
        </Column>
      </Section>

      {/* The money */}
      <Section style={{ backgroundColor: palette.paper, padding: [20, 40, 4] }}>
        <Column style={{ gap: 6 }}>
          <Text style={{ ...metaText, fontSize: 10.5, letterSpacing: 2 }}>The money, computed</Text>
          <CostRow label="EMI, on an 80% loan" sub={`${listing.loan.annualRatePct}% · ${listing.loan.years} YEARS`} value={`${inr(emiInr)} / MO`} first labelSize={13.5} valueSize={12} />
          <CostRow label="All-in, with Karnataka charges" sub="PRICE + STAMP DUTY + REGISTRATION" value={inr(totalAcquisitionInr)} labelSize={13.5} valueSize={12} />
        </Column>
      </Section>

      {/* Open house band */}
      <Section style={{ backgroundColor: palette.oxblood, padding: [18, 40, 20] }}>
        <Column style={{ gap: 5 }}>
          <Text style={{ color: palette.paper, fontFamily: fonts.display, fontWeight: 700, fontSize: 19, letterSpacing: 0.3, lineHeight: 1.2 }}>
            OPEN HOUSE — {listing.openHouse.dayLabel.toUpperCase()}, {listing.openHouse.dateLabel.toUpperCase()} · {listing.openHouse.timeLabel}
          </Text>
          <Text style={{ color: palette.paper, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.5 }}>
            {listing.addressLine}. Printed brochures of this sheet at the door.
          </Text>
        </Column>
      </Section>

      {/* Buttons */}
      <Section style={{ backgroundColor: palette.paper, padding: [26, 40, 6] }}>
        <Column style={{ gap: 16 }}>
          <Row style={{ gap: 12, justifyContent: "center" }}>
            <Button href={listingUrl}>View the full listing</Button>
            <Button
              href={demoBaseUrl}
              style={{
                backgroundColor: palette.paper,
                color: palette.ink,
                border: { width: 1.5, style: "solid", color: palette.ink },
                hover: { backgroundColor: palette.parchment },
              }}
            >
              Book a viewing
            </Button>
          </Row>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, textAlign: "center" }}>
            Or reply to this email — {agent.name}, {agent.phone}.
          </Text>
        </Column>
      </Section>

      {/* Footer */}
      <RuleStrip />
      <Section style={{ backgroundColor: palette.paper, padding: [20, 40, 34] }}>
        <Column style={{ gap: 8, alignItems: "center" }}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 600, textAlign: "center" }}>
            {listing.ref} · {agent.name} · {agent.email}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 1.5, textAlign: "center" }}>
            {product.name} — {product.tagline} This is a sample template — the property, prices
            and rates are fictional; the arithmetic is real.
          </Text>
        </Column>
      </Section>
    </Email>
  );
}
