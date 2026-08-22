# Studio PDF/A-2b Integration Research

## Scope

This integration keeps the accepted Studio PDF architecture frozen.

```text
Studio resolved page
→ native macOS WKWebView PDF
→ exact-A5 PageBox normalization
→ validation
→ canonical document assembly
→ bounded PDF/A-2b post-processing
```

No renderer, browser runtime, Publisher path, `.nls` schema, Windows adapter, prepress workflow or production package is introduced.

## Repository versions inspected

The implementation was based on the checked-in dependency contracts:

```text
Tauri                     2
Svelte                    5
TypeScript                5.7
lopdf                     0.44.0, default features disabled
objc2-web-kit             0.3.2
```

The relevant existing source path was traced through:

```text
src/App.svelte
src/lib/pdf-proof.ts
src-tauri/src/lib.rs
src-tauri/src/pdfa.rs
```

## Architecture used

The frontend now exposes separate Travelbook export actions:

```text
Standard PDF
PDF/A-2b
```

Both actions use the same serial Studio Document PDF orchestration. The PDF/A action changes only the final stage:

```text
existing Document PDF primitive
→ temporary Standard PDF inside document-proof staging
→ export_studio_pdfa2b
→ validated candidate
→ atomic final output
```

## Bounded PDF/A operations

The Rust PDF/A service performs only:

1. add catalog XMP metadata with `pdfaid:part=2` and `pdfaid:conformance=B`;
2. add deterministic trailer `/ID`;
3. add a document-level RGB OutputIntent;
4. normalize image dictionaries from `/Interpolate true` to `/Interpolate false`.

It does not rewrite content streams, decode/re-encode images, resample images, flatten transparency, translate pages, scale pages, rasterize pages, or recompose layout.

## ICC selection strategy

The service locates an embedded RGB profile structurally. It does not assume a fixed object ID.

Current policy:

```text
stream with /N 3
and (/Alternate /DeviceRGB or explicit sRGB profile evidence)
→ use as DestOutputProfile
```

If no suitable profile is found, export aborts with:

```text
PDF_A_OUTPUT_INTENT_UNAVAILABLE
```

## Trailer ID strategy

The trailer `/ID` derives from the exact temporary Standard PDF used as PDF/A source:

```text
SHA-256(source bytes)
→ first 16 bytes
→ hexadecimal PDF strings
```

The same value is used for both entries to keep the result deterministic and auditable for this conversion stage.

## Integrity contract

The service collects integrity before mutation and after writing/reloading the candidate.

Compared invariants:

```text
page count
MediaBox and CropBox
decoded page content stream hashes
image stream byte hashes
font resource evidence and embedded font stream hashes
```

The allowed image-dictionary change is only:

```text
/Interpolate true → /Interpolate false
```

## Validation authority

Internal validation proves the bounded Studio contract only. It checks that the required structural features exist and that Studio geometry/content invariants remain unchanged.

Independent PDF/A-2b conformance remains a veraPDF engineering gate:

```bash
verapdf --format json -f 2b "<Studio-exported-PDFA.pdf>"
```
