# Build 024 – Consistency Gates

Build 024 ergänzt `pnpm consistency` um den **Editorial Extension Zones Consistency Gate**.

Der Gate prüft insbesondere:

- sechs freigegebene semantische Extension-Typen in TypeScript und Rust
- `.nls` 0.10.0 und explizite Migration von 0.9.0
- persistentes `editorialExtensions`-Modell
- Inspector- und Preview-Anbindung
- shared semantic signets
- world-abgeleitete Flächenfarbe
- rahmenlose Extension-Grammatik
- verbindliche Product-DNA-Regeln zu Signet, Zonen und Companion

```bash
pnpm consistency:extensions
```

Der Gate ergänzt, ersetzt aber nicht TypeScript-, Test-, Build- und Rust-Gates.


## Adaptive Layout Grammar Consistency Gate

`node scripts/check-adaptive-layout-grammar-consistency.mjs` prüft die kuratierten Title- und Extension-Zustände, verhindert Zeichenumbrüche in Ortsnamen und stellt sicher, dass der adaptive Grammar-Grundsatz in der Product DNA verankert bleibt.

## Extension Capacity Protection Gate

`node scripts/check-extension-capacity-protection-consistency.mjs` verifies the hard overflow state, Travel Language notice, alternative-layout guidance, Product DNA safe-zone rule, root `LICENSE.md`, and README source-availability notice.
