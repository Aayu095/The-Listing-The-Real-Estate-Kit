import { defineTheme } from "@hyper-elements/react";

// The Listing — "The Drawing Sheet". An architect's sheet, not a
// brochure: ivory drafting paper, charcoal ink, ONE oxblood accent.
// Hairline drafting rules, dimension lines with arrowheads, crosshair
// register marks, a sheet-number stamp. Cormorant Garamond (display,
// with italics) carries the voice; Inter carries the prose; JetBrains
// Mono is allowed only where a draughtsman would letter by hand —
// measurements, dimensions, sheet references.
export const palette = {
  paper: "#F6F1E7", // ivory drafting-paper ground
  parchment: "#EFE7D4", // deeper ivory — panels, title blocks
  ink: "#1D1B18", // charcoal ink
  oxblood: "#7C2128", // the one accent — price, verdicts, the stamp
  stone: "#6E6455", // warm grey-brown — secondary lettering
  hairline: "#C9BCA0", // faint drafting rule
  grid: "#E4DCC8", // graph-paper grid, faintest
};

export const fonts = {
  display: "Cormorant Garamond, 'Times New Roman', Georgia, serif",
  body: "Inter, Arial, Helvetica, sans-serif",
  mono: "JetBrains Mono, 'Courier New', Courier, monospace",
};

// The kit's spacing scale (the same rhythm as the sibling kits): every
// structural gap and padding in every template is one of these steps.
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  max: 48,
} as const;

// Webfont faces for the HTML outputs (Page / Document print HTML),
// served from the Fontsource CDN — the same SIL OFL files kept in
// assets/fonts/.
const face = (family: string, file: string, weight: number, style?: "italic") => ({
  family,
  src: `https://cdn.jsdelivr.net/fontsource/fonts/${file}.woff`,
  format: "woff" as const,
  weight,
  ...(style ? { style } : {}),
});

export const fontFaces = [
  face("Cormorant Garamond", "cormorant-garamond@latest/latin-500-normal", 500),
  face("Cormorant Garamond", "cormorant-garamond@latest/latin-500-italic", 500, "italic"),
  face("Cormorant Garamond", "cormorant-garamond@latest/latin-600-normal", 600),
  face("Cormorant Garamond", "cormorant-garamond@latest/latin-600-italic", 600, "italic"),
  face("Cormorant Garamond", "cormorant-garamond@latest/latin-700-normal", 700),
  face("Inter", "inter@latest/latin-400-normal", 400),
  face("Inter", "inter@latest/latin-500-normal", 500),
  face("Inter", "inter@latest/latin-600-normal", 600),
  face("Inter", "inter@latest/latin-700-normal", 700),
  face("JetBrains Mono", "jetbrains-mono@latest/latin-400-normal", 400),
  face("JetBrains Mono", "jetbrains-mono@latest/latin-600-normal", 600),
];

export const listingTheme = defineTheme({
  colors: {
    background: palette.paper,
    foreground: palette.ink,
    primary: palette.ink,
    primaryForeground: palette.paper,
    muted: palette.stone,
    border: palette.ink,
    paper: palette.paper,
    parchment: palette.parchment,
    ink: palette.ink,
    oxblood: palette.oxblood,
    stone: palette.stone,
    hairline: palette.hairline,
  },
  fonts: {
    body: fonts.body,
    heading: fonts.display,
  },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.5 },
  elements: {
    Heading: {
      fontFamily: fonts.display,
      fontWeight: 600,
      lineHeight: 1.05,
      by: {
        level: {
          1: { fontSize: 44 },
          2: { fontSize: 32 },
          3: { fontSize: 22, fontWeight: 600 },
        },
      },
    },
    Text: { lineHeight: 1.5 },
    Button: {
      backgroundColor: palette.ink,
      color: palette.paper,
      borderRadius: 0,
      padding: [14, 26],
      fontWeight: 600,
      fontSize: 15,
      hover: { backgroundColor: palette.oxblood },
    },
    Divider: { borderTop: { width: 1, style: "solid", color: palette.ink } },
  },
  styles: {
    chip: { borderRadius: 0, padding: [4, 9] },
  },
});
