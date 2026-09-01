# Mittelmeer · Curated Asset Contract

Status: **047D READY FOR ASSET DELIVERY**

World ID: `mediterranean`

Dieser Vertrag definiert die endliche Bildmenge der Editorial World Mittelmeer. Er erweitert ausschließlich die World Expression. Er führt keine neuen Seitentypen, keine neue Grammar und keinen eigenen Renderer ein.

## Verbindliche Runtime-Struktur

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

Erst wenn alle acht freigegebenen Dateien vorhanden sind, darf `src/lib/world-assets.ts` ein vollständiges `mediterraneanAssets`-Manifest registrieren.

## Bildsprache

Leitidee: **Zypresse & Stein**.

Die kuratierten Bilder sollen die bereits akzeptierte CSS-Expression ergänzen, nicht überstimmen. Sie dürfen warm, lichtgetragen und mediterran sein, müssen aber Northern-Lines-ruhig bleiben.

Erwünscht:

- klare, reduzierte Kompositionen
- natürliche mediterrane Landschaft, Architektur, Materialität und Licht
- Kalkstein, warme Mauern, Schatten, Zypressen, Oliven, Meer, Vegetation als mögliche Motive
- World-konforme Wärme ohne künstliche Orange-/Gelbdominanz
- ausreichende Ruheflächen für die bestehende Seitengrammatik
- fotografische bzw. illustrative Motive ohne eingebettete Schrift oder UI

Nicht erwünscht:

- Postkartenkitsch oder Reiseprospekt-Ästhetik
- beliebige Palmen-/Cocktail-/Strandklischees
- übergesättigte Sonnenuntergänge
- dekorative Rahmen, Schriftzüge oder World-Namen im Bild
- Fjord-/Ostsee-Recycling als Platzhalter
- neue visuelle Semantik, die eine eigene Page Grammar verlangt

## Slot Intent

### photography.png

Mittelmeer als fotografische Einladung: Licht, Material, Perspektive und ruhige räumliche Tiefe.

### hiking-nature.png

Trockene Wege, Küstenlandschaft, mediterrane Vegetation oder Relief; Natur steht vor touristischer Inszenierung.

### culture-history.png

Stein, Architektur, historische Schichten und gelebter Ort. Keine generische Museumssymbolik.

### culinary-local.png

Lokale Materialität und Esskultur ruhig und glaubwürdig erzählen; keine Werbefotografie.

### photography-workshop.png

Visuelles Beobachten von Licht, Form und Oberfläche. Der Workshop bleibt programmneutral.

### welcome.png

Ein ruhiger Einstieg in die World: Atmosphäre vor Information, Offenheit vor Motivdichte.

### closing.png

Ein zurückhaltender letzter Blick. Erinnerung, Wärme und Nachklang statt dramatischem Finale.

### notes.png

Kleiner kuratierter Akzent für die Notizseite; klar world-konform, aber untergeordnet.

## Runtime-Regel

Die World-Asset-Registry ist endlich und vollständig. Für Mittelmeer gilt deshalb:

```text
0 reale Assets  → kein Mediterranean Manifest
8 reale Assets  → vollständiges Mediterranean Manifest
1–7 Assets      → nicht registrieren / Gate FAIL
```

Damit erzeugt Studio weder Broken Images noch stille Cross-World-Fallbacks.

> **No fake completeness. No borrowed World assets.**
