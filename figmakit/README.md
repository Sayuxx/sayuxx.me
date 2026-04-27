# figmakit

Figma plugin that generates design foundations (color palette, spacing, typography, shadows, icons) from a single brand color.

## Build

```sh
npm install
npm run build
```

Outputs `dist/code.js` and `dist/ui.html`.

## Load in Figma

1. Open Figma desktop app.
2. Menu → Plugins → Development → Import plugin from manifest…
3. Select [manifest.json](manifest.json).
4. Run via Plugins → Development → figmakit.

## What it generates

- **Variables collection `figmakit/colors`** with `light` and `dark` modes:
  - 50–950 scales for `primary`, optional `accent`, `neutral`, and (optional) `success`, `warn`, `error`, `info`.
  - Semantic aliases `bg`, `surface`, `border`, `text`, `text-muted`, `accent` mapped per mode.
- **Variables collection `figmakit/spacing`**: `space/0…24` (× 4 or 8) and `radius/sm|md|lg|xl|full`.
- **Text Styles** `text/xs…5xl` from a 1.2 or 1.333 ratio scale.
- **Effect Styles** `shadow/sm|md|lg|xl`.
- **Style guide frame** showing all of the above wired to the variables.

## Develop

```sh
npm run watch:code   # rebuild code.js on change
npm run watch:ui     # rebuild ui.html on change
npm run check        # svelte-check
npm run test         # vitest (palette/generation only)
```

## Notes

- Palette uses OKLCH for perceptually uniform lightness across hues. See [src/lib/palette/generate.ts](src/lib/palette/generate.ts).
- Re-running "generate foundations" replaces existing `figmakit/*` collections and `text/`, `shadow/` styles. It does not touch other variables/styles.
- Inserting the style guide deletes any existing frame named `figmakit/style-guide` on the current page before creating a new one.
- **Free Figma plan**: variables are generated in a single `light` mode only — multi-mode collections require Pro/Organization. The plugin notifies and degrades gracefully; on Pro, both `light` and `dark` modes are created and the semantic aliases (`bg`, `surface`, `text`, …) flip per mode.
