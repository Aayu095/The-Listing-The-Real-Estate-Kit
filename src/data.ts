// The Listing — one fictional property file drives every output.
// Nothing about the money or the plan is typed into the templates:
// areas come from the room geometry, the carpet total is the sum of
// the rooms, the EMI is the amortisation formula, the government
// charges are the stated Karnataka rates applied to the price, and
// the locality verdict is a function of the computed difference.
// Change a price, a rate or a wall below and every output re-derives.

// ——— The firm & the sheet ———
export const product = {
  name: "Keystone Estates",
  kit: "The Listing",
  tagline: "Drawn to measure.",
};

export const agent = {
  name: "Arjun Mehta",
  firm: "Keystone Estates",
  role: "Principal broker",
  phone: "+91 98110 00000",
  email: "arjun.mehta@keystoneestates.example",
  note: "RERA Reg. No. KA-2026-0147 · fictional registration, like everything else here",
};

export const demoBaseUrl = "https://the-listing-real-estate-kit.vercel.app/";
export const listingUrl = `${demoBaseUrl}listing.html`;

// ——— The listing (the only hand-written facts) ———
export const listing = {
  ref: "KE–2026–0147",
  sheet: "A-101",
  project: "Skyline Residency",
  tower: "Tower B",
  unit: "Unit 1102",
  floor: 11,
  floorsTotal: 14,
  locality: "Whitefield",
  city: "Bengaluru",
  addressLine: "ITPL Main Road, Whitefield, Bengaluru 560066",
  config: "3 BHK",
  facing: "East-facing",
  furnishing: "Semi-furnished",
  tenure: "Freehold",
  status: "Ready to move",
  priceInr: 18_500_000,
  /** The drawing plate, in feet — its area IS the super built-up area. */
  plate: { wFt: 50, dFt: 37 },
  /** Whitefield's average asking rate, ₹ per sq ft of carpet area. */
  localityAvgPerSqft: 11_900,
  /** Loan assumptions — parameters, so a buyer can re-run them. */
  loan: { fractionOfPrice: 0.8, annualRatePct: 8.5, years: 20 },
  /** Karnataka charges, as parameters of the state, not constants of the flat. */
  charges: { state: "Karnataka", stampDutyPct: 5.65, registrationPct: 1.0 },
  listedLabel: "20 Nov 2026",
  openHouse: { dayLabel: "Saturday", dateLabel: "28 Nov 2026", timeLabel: "10 AM – 1 PM" },
};

// ——— The plan: rooms on a feet grid (origin at the plate's NW inner
//     corner, x east, y south). Areas are width × depth, computed.
//     The rooms tile the 48 × 35 ft inner plate exactly. ———
export type WallSide = "N" | "S" | "E" | "W";
export interface DoorSpec {
  wall: WallSide;
  /** Feet along the wall from the room's NW corner (from west on N/S
   *  walls, from north on E/W walls) to the hinge. */
  at: number;
  widthFt?: number;
  main?: boolean;
}
export interface WindowSpec {
  wall: WallSide;
  at: number;
  widthFt: number;
  slider?: boolean;
}
export interface Room {
  name: string;
  x: number;
  y: number;
  w: number;
  d: number;
  /** Balconies are drawn and scheduled but, per RERA, are not carpet. */
  countsToCarpet: boolean;
  fixtures?: "bath" | "kitchen" | "balcony";
  doors?: DoorSpec[];
  windows?: WindowSpec[];
}

export const innerPlate = { wFt: 48, dFt: 35 };

export const rooms: Room[] = [
  // North band (bedrooms), depth 12
  { name: "Master Bedroom", x: 0, y: 0, w: 16, d: 12, countsToCarpet: true, doors: [{ wall: "S", at: 13 }], windows: [{ wall: "N", at: 4, widthFt: 6 }, { wall: "W", at: 3, widthFt: 5 }] },
  { name: "Master Bath", x: 16, y: 0, w: 8, d: 7, countsToCarpet: true, fixtures: "bath", doors: [{ wall: "W", at: 3 }] },
  { name: "Dress", x: 16, y: 7, w: 8, d: 5, countsToCarpet: true, doors: [{ wall: "W", at: 2 }] },
  { name: "Bedroom 2", x: 24, y: 0, w: 14, d: 12, countsToCarpet: true, doors: [{ wall: "S", at: 3 }], windows: [{ wall: "N", at: 4, widthFt: 6 }] },
  { name: "Bedroom 3", x: 38, y: 0, w: 10, d: 12, countsToCarpet: true, doors: [{ wall: "S", at: 4 }], windows: [{ wall: "N", at: 2.5, widthFt: 5 }, { wall: "E", at: 3, widthFt: 5 }] },
  // Middle band (living), depth 13
  { name: "Living Room", x: 0, y: 12, w: 22, d: 13, countsToCarpet: true, doors: [{ wall: "S", at: 18 }], windows: [{ wall: "W", at: 4, widthFt: 6 }, { wall: "S", at: 6, widthFt: 9, slider: true }] },
  { name: "Dining", x: 22, y: 12, w: 14, d: 13, countsToCarpet: true, doors: [{ wall: "W", at: 6 }] },
  { name: "Kitchen", x: 36, y: 12, w: 12, d: 13, countsToCarpet: true, fixtures: "kitchen", doors: [{ wall: "W", at: 9 }], windows: [{ wall: "E", at: 4, widthFt: 4 }] },
  // South band, depth 10
  { name: "Balcony", x: 0, y: 25, w: 23, d: 10, countsToCarpet: false, fixtures: "balcony" },
  { name: "Puja", x: 23, y: 25, w: 5, d: 10, countsToCarpet: true, doors: [{ wall: "N", at: 2 }] },
  { name: "Store", x: 28, y: 25, w: 5, d: 10, countsToCarpet: true, doors: [{ wall: "N", at: 2 }] },
  { name: "Bath", x: 33, y: 25, w: 7, d: 10, countsToCarpet: true, fixtures: "bath", doors: [{ wall: "E", at: 4 }] },
  { name: "Foyer", x: 40, y: 25, w: 8, d: 10, countsToCarpet: true, doors: [{ wall: "N", at: 4 }, { wall: "S", at: 4, main: true }], windows: [{ wall: "E", at: 3, widthFt: 3 }] },
];

// ——— Areas, derived from the geometry ———
export interface RoomFact extends Room {
  areaSqft: number;
  shareOfCarpetPct: number;
}

const rawAreas = rooms.map((r) => ({ ...r, areaSqft: r.w * r.d }));
export const carpetSqft = rawAreas.filter((r) => r.countsToCarpet).reduce((s, r) => s + r.areaSqft, 0);
export const superBuiltupSqft = listing.plate.wFt * listing.plate.dFt;
export const roomFacts: RoomFact[] = rawAreas.map((r) => ({
  ...r,
  shareOfCarpetPct: r.countsToCarpet ? (r.areaSqft / carpetSqft) * 100 : 0,
}));
export const balconySqft = rawAreas.filter((r) => !r.countsToCarpet).reduce((s, r) => s + r.areaSqft, 0);

/** Rows of the plan, north → south, for the drawing's row bands. */
export const planRows: RoomFact[][] = [0, 12, 25].map((y) =>
  roomFacts.filter((r) => r.y === y).sort((a, b) => a.x - b.x),
);
/** Column segments of the north band (for the top dimension string). */
export const northSegments = [16, 8, 14, 10];
/** Column segments of the south band (for the bottom dimension string). */
export const southSegments = [23, 5, 5, 7, 8];
/** Row segments of the plate (for the left dimension string). */
export const sideSegments = [12, 13, 10];

// ——— The money, derived from the price ———
export const efficiencyPct = (carpetSqft / superBuiltupSqft) * 100;
export const pricePerSqftCarpet = listing.priceInr / carpetSqft;
export const pricePerSqftSuper = listing.priceInr / superBuiltupSqft;

/** Locality comparison — the verdict word is a function of the gap. */
export const localityDiffPct = ((pricePerSqftCarpet - listing.localityAvgPerSqft) / listing.localityAvgPerSqft) * 100;
export type LocalityVerdict = "premium" | "inline" | "below";
export const localityVerdict: LocalityVerdict =
  localityDiffPct > 5 ? "premium" : localityDiffPct < -5 ? "below" : "inline";
export const localityVerdictLabel =
  localityVerdict === "premium"
    ? "At a premium"
    : localityVerdict === "below"
      ? "Below the locality"
      : "In line with the locality";

/** Government charges — the state's rates applied to the price. */
export const stampDutyInr = (listing.priceInr * listing.charges.stampDutyPct) / 100;
export const registrationInr = (listing.priceInr * listing.charges.registrationPct) / 100;
export const totalChargesInr = stampDutyInr + registrationInr;
export const totalAcquisitionInr = listing.priceInr + totalChargesInr;

/** The loan — EMI from the standard amortisation formula. */
export const loanPrincipalInr = listing.priceInr * listing.loan.fractionOfPrice;
const monthlyRate = listing.loan.annualRatePct / 100 / 12;
const loanMonths = listing.loan.years * 12;
const emiFactor = (1 + monthlyRate) ** loanMonths;
export const emiInr = (loanPrincipalInr * monthlyRate * emiFactor) / (emiFactor - 1);
export const totalRepaymentInr = emiInr * loanMonths;
export const totalInterestInr = totalRepaymentInr - loanPrincipalInr;

// ——— Formatting (Indian numbering throughout) ———
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const inrShort = (n: number) => {
  if (n >= 1e7) {
    const cr = n / 1e7;
    return `₹${cr.toFixed(cr >= 10 ? 1 : 2).replace(/\.?0+$/, "")} crore`;
  }
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2).replace(/\.?0+$/, "")} lakh`;
  return inr(n);
};
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");
/** Feet → draughtsman's feet-and-inches: 16 → 16'-0", 2.5 → 2'-6". */
export const ftIn = (ft: number) => {
  const whole = Math.floor(ft);
  const inches = Math.round((ft - whole) * 12);
  return inches === 12 ? `${whole + 1}'-0"` : `${whole}'-${inches}"`;
};
export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;
export const signedPct = (n: number, digits = 1) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}%`;

export const disclaimer =
  "Sample data — not a real property listing. Skyline Residency, Keystone Estates, the agent, the prices and the rates in this template are fictional; the arithmetic is real, and every figure is computed from the listing file in src/data.ts.";
