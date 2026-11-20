# Fonts

Cormorant Garamond, Inter and JetBrains Mono, all licensed under the
SIL Open Font License 1.1.

## Cormorant Garamond & Inter — full-coverage TTF builds

The Fontsource latin-subset WOFFs for these families do **not** contain
the rupee sign (₹, U+20B9), which this kit's prices need — and the PDF
and image renderers do no glyph fallback, so subset fonts would print
tofu. These files are therefore static instances of the full variable
fonts from the google/fonts repository, instanced with fontTools
(`varLib.instancer`) and verified by cmap inspection to contain ₹ and №:

- Cormorant Garamond — © The Cormorant Project Authors (Christian
  Thalmann) — https://github.com/CatharsisFonts/Cormorant
  - CormorantGaramond-Medium.ttf (500), CormorantGaramond-SemiBold.ttf
    (600), CormorantGaramond-Bold.ttf (700),
    CormorantGaramond-MediumItalic.ttf (500 italic),
    CormorantGaramond-SemiBoldItalic.ttf (600 italic)
    (variable font `CormorantGaramond[wght].ttf` /
    `CormorantGaramond-Italic[wght].ttf`, wght pinned per file)
- Inter — © The Inter Project Authors (Rasmus Andersson) —
  https://github.com/rsms/inter
  - Inter-Regular.ttf (400), Inter-Medium.ttf (500),
    Inter-SemiBold.ttf (600), Inter-Bold.ttf (700)
    (variable font `Inter[opsz,wght].ttf`, opsz pinned to 14)

## JetBrains Mono — Fontsource WOFF

- JetBrains Mono — © The JetBrains Mono Project Authors —
  https://github.com/JetBrains/JetBrainsMono
  - JetBrainsMono-Regular.woff (400), JetBrainsMono-SemiBold.woff (600)

JetBrains Mono is used only for dimension and measurement labels. The
typeface has no ₹ glyph, so rupee signs inside mono values are set in
Inter by the `MonoValue` component (see `src/components.tsx`).

For HTML output, the same families are loaded as webfonts via the
theme's font faces (Google Fonts CDN); the local files above are what
`renderPdf()` and `renderImage()` receive as bytes.
