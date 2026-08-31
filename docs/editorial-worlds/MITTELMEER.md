# Editorial World · Mittelmeer

Status: **ACTIVE · Build 047**

World ID: `mediterranean`

Leitidee: **Zypresse & Stein**

## Haltung

Mittelmeer ist warm, ruhig und lichtgetragen. Die World entsteht nicht aus dekorativer Folklore, sondern aus wenigen wiederkehrenden Materialien und Kontrasten: weißes Papier, Zypressen- und Olivgrün, heller Kalkstein, gebrannte Terrakotta und zurückhaltendes Sonnenlicht.

Die A5-Seitenfläche bleibt literal weiß. World Expression entsteht über Typografie, Akzente, gezielte Editorial-Flächen, Companion und kuratierte Bildsprache.

## Farb- und Typografiehierarchie

```text
Zypresse            → führende typografische Farbe
Helles Olive         → ruhige Editorial-/Interest-Flächen
Stein / Kalkstein    → warme neutrale Flächen
Terrakotta #9a5f49  → kleine warme Akzente
Ink                  → Intro und Fließtext
Weiß                 → Seitenfläche
```

Die Serifentypografie unterstützt eine warme, klassische Haltung. Sie darf nicht ornamental oder touristisch wirken.

## Companion

Der World Companion ist der **Iberische Luchs**.

```text
Companion ID: iberian-lynx
World:        mediterranean
```

Die Companion-ID beschreibt das Tier; die World-ID beschreibt die Editorial World. Beide Identitäten bleiben bewusst getrennt.

## Grammar

Mittelmeer verwendet dieselbe semantische und adaptive Layout Grammar wie Fjord und Ostsee.

Insbesondere gelten dieselben Destination-Wirkungen:

- `destination-hero-banner` → Weite
- `destination-hero-left` → Bild links
- `destination-hero-right` → Bild rechts

Neue Mittelmeer-Expression allein rechtfertigt keine neue Page Grammar und keinen Renderer-Sonderpfad.

## Curated Assets

Die verbindlichen Asset-Slots sind in `MITTELMEER-CURATED-ASSET-CONTRACT.md` beschrieben. Solange reale freigegebene Assets fehlen, werden für Mittelmeer keine fremden World-Bilder und keine Dummy-Bilder registriert.

> **World is expression, not a second renderer.**
