# Build 037 — Validation

## Scope

Validation covers the production preview for **Inhaltsverzeichnis** and **Notizen** in both Editorial Worlds.

## Automated gate

```bash
pnpm consistency:build-037-utility-pages
```

Expected: `Build 037 Contents & Notes Consistency Gate: PASS` in green.

## Required visual validation

### Fjord

1. Open Inhaltsverzeichnis.
2. Confirm automatic page list, section grouping, page numbers and small Fjord Curated Accent.
3. Confirm the accent is visibly subordinate to navigation and no Companion is present.
4. Open Notizen.
5. Confirm one large free writing zone plus Schnellnotiz, Ideen and Skizze.
6. Confirm the Fjord accent remains small and the Companion/Footer do not overlap writing areas.

### Ostsee

Repeat the same sequence and confirm only the World expression and Curated Accent change.

## Regression checks

- physical page background remains `#FFFFFF`;
- no asset picker appears for Curated Accents;
- Interest/Companion Curated Heroes remain unchanged;
- Footer and page numbering remain stable;
- version metadata remains synchronized.
