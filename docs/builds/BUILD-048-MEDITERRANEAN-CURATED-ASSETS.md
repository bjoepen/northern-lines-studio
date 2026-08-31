# Build 048 · Mediterranean Curated Assets

Status: **IMPLEMENTED · LOCAL / VISUAL VALIDATION PENDING**

## Ziel

Build 048 überführt die in Build 047 vorbereitete und freigegebene Mittelmeer-Bildsprache in das bestehende generische World-Asset-System von Northern Lines Studio.

Build 047 bleibt der Architektur- und World-Extensibility-Meilenstein. Build 048 besitzt ausschließlich die kuratierte Bildwelt.

## Art Direction

Verbindliche Bildsprache:

> **Northern Lines Core Illustration Style · Mittelmeer „Zypresse & Stein“**

Die Motive sind bewusst nicht fotorealistisch. Sie verwenden die Northern-Lines-Illustrationssprache mit Aquarell-/Papierwirkung, ruhiger Vereinfachung und mediterraner World Expression.

Die Motivwelt umfasst:

- Küste, Meer, Inseln und felsige Landschaft
- Zypressen, Oliven und mediterrane Vegetation
- Steinwege und warme Architektur
- historische Orte und Dörfer
- lokale Küche mit zurückhaltender Stillleben-Wirkung
- Fotografie als Reisebeobachtung statt technische Produktdarstellung
- warmes Abendlicht für Welcome / Closing, ohne Postkarten- oder Tourismuskatalogwirkung

## Curated Asset Set

Das Set ist endlich und vollständig. Es besteht aus genau acht World-owned Assets:

```text
public/design-library/worlds/mediterranean/
├── curated-heroes/
│   ├── photography.png
│   ├── hiking-nature.png
│   ├── culture-history.png
│   ├── culinary-local.png
│   ├── photography-workshop.png
│   ├── welcome.png
│   └── closing.png
└── curated-accents/
    └── notes.png
```

## Runtime Wiring

`src/lib/world-assets.ts` enthält nun ein vollständiges `mediterraneanAssets`-Manifest und registriert es über dieselbe World Asset Registry wie Fjord und Ostsee.

Der bestehende Aufrufpfad bleibt unverändert:

```text
World Asset Registry
        ↓
worldAssetManifestFor(worldId)
        ↓
curatedHeroFor / curatedWelcomeHeroFor
curatedClosingHeroFor / curatedAccentFor
        ↓
shared Studio renderer
```

Es gibt keinen Mediterranean-spezifischen Renderer und keinen neuen Page Type.

## Architekturgrenzen

Build 048 führt ausdrücklich nicht ein:

- keine neue Page Grammar
- keinen zweiten Renderer
- keine World-spezifische `App.svelte`-Verzweigung
- keine `.nls`-Asset-Persistenz für Curated World Assets
- keinen Asset Picker
- keine Projektkopie der World Assets
- keinen Fallback auf Fjord- oder Ostsee-Motive

World-owned imagery bleibt Teil der installierten Studio-/Design-Library-Ressourcen.

## Gates

Build 047D bleibt als Readiness-Contract erhalten und wechselt mit vorhandenem 8/8-Set auf den Zustand `ASSETS COMPLETE / MANIFEST REGISTERED`.

Build 048 ergänzt:

```bash
pnpm consistency:build-048
```

Das Gate prüft:

- alle acht vorgesehenen Assets existieren;
- alle acht Dateien tragen eine gültige PNG-Signatur;
- das vollständige Mediterranean Manifest ist registriert;
- jeder Runtime-Pfad bleibt im eigenen World Namespace;
- `App.svelte` enthält keinen Mediterranean-spezifischen Renderpfad.

## Erwarteter visueller Nachweis

Nach lokaler Installation / `pnpm tauri dev` müssen unter Mittelmeer sichtbar sein:

- eigener Fotografie-Hero
- eigener Wandern-&-Natur-Hero
- eigener Kultur-&-Geschichte-Hero
- eigener Kulinarik-&-Lokal-Hero
- eigener Fotografie-Workshop-Hero
- eigener Welcome-Hero
- eigener Closing-Hero
- eigener Notes-Akzent

Die Bilder müssen sich in die bereits akzeptierte Farbwelt **Zypresse · Olive · Stein · gebrannte Terrakotta · Weiß** einfügen und dürfen Companion/Footer/Capacity Protection nicht verändern.

## Acceptance

Build 048 wird erst nach lokalem Gate-PASS und visuellem Studio-Test auf **ACCEPTED** gesetzt.
