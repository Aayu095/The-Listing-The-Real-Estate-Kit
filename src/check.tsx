import React from "react";
import { formatDiagnostics, validate, type Diagnostic } from "@hyper-elements/react";
import { emailClients } from "@hyper-elements/email-clients";

import ListingAlertEmail from "./email";
import ListingPage from "./page";
import BrochureDocument from "./document";
import ListingCanvas from "./canvas";

// Validate only — the `npm run check` gate. Exits non-zero on any error.
const plugin = await emailClients();

const targets: Array<[string, React.ReactElement, boolean]> = [
  ["email", <ListingAlertEmail />, true],
  ["page", <ListingPage />, false],
  ["document", <BrochureDocument />, false],
  ["canvas", <ListingCanvas />, false],
];

let errors = 0;
let warnings = 0;
for (const [name, el, withPlugin] of targets) {
  const result = validate(el, withPlugin ? { plugins: [plugin] } : undefined);
  const ds = result.diagnostics as Diagnostic[];
  const e = ds.filter((d) => d.severity === "error").length;
  const w = ds.filter((d) => d.severity === "warning").length;
  errors += e;
  warnings += w;
  console.log(`[${name}] valid=${result.valid} errors=${e} warnings=${w} notes=${ds.length - e - w}`);
  const text = formatDiagnostics(ds);
  if (text) console.log(text);
}
console.log(`\nTOTAL errors=${errors} warnings=${warnings}`);
if (errors > 0) process.exitCode = 1;
