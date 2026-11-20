import React from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ElementsError,
  formatDiagnostics,
  render,
  validate,
  type Diagnostic,
} from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";

import ListingAlertEmail from "./email";
import ListingPage from "./page";
import BrochureDocument from "./document";
import ListingCanvas from "./canvas";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

const fontFile = (name: string) => readFile(join(root, "assets", "fonts", name));

async function loadFonts() {
  return [
    { family: "Cormorant Garamond", src: await fontFile("CormorantGaramond-Medium.ttf"), weight: 500 },
    { family: "Cormorant Garamond", src: await fontFile("CormorantGaramond-MediumItalic.ttf"), weight: 500, style: "italic" as const },
    { family: "Cormorant Garamond", src: await fontFile("CormorantGaramond-SemiBold.ttf"), weight: 600 },
    { family: "Cormorant Garamond", src: await fontFile("CormorantGaramond-SemiBoldItalic.ttf"), weight: 600, style: "italic" as const },
    { family: "Cormorant Garamond", src: await fontFile("CormorantGaramond-Bold.ttf"), weight: 700 },
    { family: "Inter", src: await fontFile("Inter-Regular.ttf"), weight: 400 },
    { family: "Inter", src: await fontFile("Inter-Medium.ttf"), weight: 500 },
    { family: "Inter", src: await fontFile("Inter-SemiBold.ttf"), weight: 600 },
    { family: "Inter", src: await fontFile("Inter-Bold.ttf"), weight: 700 },
    { family: "JetBrains Mono", src: await fontFile("JetBrainsMono-Regular.woff"), weight: 400 },
    { family: "JetBrains Mono", src: await fontFile("JetBrainsMono-SemiBold.woff"), weight: 600 },
  ];
}

const counts = (ds: readonly Diagnostic[]) => ({
  errors: ds.filter((d) => d.severity === "error").length,
  warnings: ds.filter((d) => d.severity === "warning").length,
  notes: ds.filter((d) => d.severity !== "error" && d.severity !== "warning").length,
});

let totalErrors = 0;
const report = (label: string, ds: readonly Diagnostic[]) => {
  const c = counts(ds);
  totalErrors += c.errors;
  console.log(`\n[${label}] errors=${c.errors} warnings=${c.warnings} notes=${c.notes}`);
  const text = formatDiagnostics(ds as Diagnostic[]);
  if (text) console.log(text);
};

async function step<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ElementsError) {
      report(`${label} FAILED`, e.diagnostics);
      return null;
    }
    throw e;
  }
}

async function main() {
  await mkdir(join(outDir, "email-clients"), { recursive: true });
  const fonts = await loadFonts();
  const plugin = await emailClients();

  const email = <ListingAlertEmail />;
  const page = <ListingPage />;
  const doc = <BrochureDocument />;
  const canvas = <ListingCanvas />;

  // ——— Validate everything ———
  report("validate email (with email-clients plugin)", validate(email, { plugins: [plugin] }).diagnostics);
  report("validate page", validate(page).diagnostics);
  report("validate document", validate(doc).diagnostics);
  report("validate canvas", validate(canvas).diagnostics);

  // ——— Email → HTML + text ———
  const emailOut = await step("render email", () => render(email, { plugins: [plugin] }));
  if (emailOut) {
    report("render email", emailOut.diagnostics);
    await writeFile(join(outDir, "listing-alert.html"), emailOut.html);
    await writeFile(join(outDir, "listing-alert.txt"), emailOut.text ?? "");
    console.log("wrote out/listing-alert.html + .txt", `(${emailOut.html.length} bytes html)`);
  }

  // ——— Page → HTML + text ———
  const pageOut = await step("render page", () => render(page));
  if (pageOut) {
    report("render page", pageOut.diagnostics);
    await writeFile(join(outDir, "listing.html"), pageOut.html);
    await writeFile(join(outDir, "listing.txt"), pageOut.text ?? "");
    console.log("wrote out/listing.html + .txt", `(${pageOut.html.length} bytes html)`);
  }

  // ——— Document → print HTML + PDF ———
  const docOut = await step("render document", () => render(doc));
  if (docOut) {
    report("render document (print html)", docOut.diagnostics);
    await writeFile(join(outDir, "brochure.html"), docOut.html);
    console.log("wrote out/brochure.html", `(${docOut.html.length} bytes html)`);
  }
  const pdfOut = await step("renderPdf document", () => renderPdf(doc, { fonts }));
  if (pdfOut) {
    report("renderPdf document", pdfOut.diagnostics);
    await writeFile(join(outDir, "brochure.pdf"), pdfOut.pdf);
    console.log("wrote out/brochure.pdf", `(${pdfOut.pdf.length} bytes)`);
  }

  // ——— Canvas → PNG + SVG (+ HTML for inspection) ———
  const pngOut = await step("renderImage canvas (png)", () => renderImage(canvas, { fonts, format: "png" }));
  if (pngOut) {
    report("renderImage canvas (png)", pngOut.diagnostics);
    await writeFile(join(outDir, "listing-poster.png"), pngOut.image);
    console.log("wrote out/listing-poster.png", `(${pngOut.width}x${pngOut.height}, ${pngOut.image.length} bytes)`);
  }
  const svgOut = await step("renderImage canvas (svg)", () => renderImage(canvas, { fonts, format: "svg" }));
  if (svgOut) {
    report("renderImage canvas (svg)", svgOut.diagnostics);
    await writeFile(join(outDir, "listing-poster.svg"), svgOut.image);
    console.log("wrote out/listing-poster.svg", `(${svgOut.image.length} bytes)`);
  }

  // ——— Email-client previews ———
  const previews = await step("renderInEmailClients", () =>
    renderInEmailClients(email, { plugins: [plugin] }),
  );
  if (previews) {
    report("email-client previews", previews.diagnostics);
    for (const p of previews.previews) {
      await writeFile(join(outDir, "email-clients", p.filename), p.html);
      console.log("wrote out/email-clients/" + p.filename);
    }
    if (previews.skipped.length) {
      console.log("skipped previews:", previews.skipped.map((s) => JSON.stringify(s)).join("; "));
    }
  }

  console.log(`\n=== TOTAL ERROR DIAGNOSTICS: ${totalErrors} ===`);
  if (totalErrors > 0) process.exitCode = 1;
}

await main();
