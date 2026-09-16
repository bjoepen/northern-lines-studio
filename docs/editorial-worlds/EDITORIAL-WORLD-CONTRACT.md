# Editorial World Contract

Status: Build 049A · verbindlich

Eine Editorial World ist keine Farbpalette. Sie ist eine kuratierte visuelle Sprache aus Typografie, Rhythmus, Bildsprache, Akzenten, Companion und wenigen charakteristischen Assets.

## Verbindliche Schichten

1. Typography
2. Color Language
3. Graphic Language
4. Companion Language
5. Image & Asset Language

## Typography · First-class World Identity

Typografie ist die erste Ausdrucksschicht einer Editorial World und darf nicht auf eine bloße technische Font-Auswahl reduziert werden. Jede freigegebene World besitzt eine kuratierte typografische Sprache aus mindestens **Heading** und **Body** sowie optional einer zurückhaltenden **Accent**-Rolle.

Die Rollen dürfen sich zwischen Worlds in Schriftfamilie, Charakter, Gewicht und Rhythmus unterscheiden. Die typografische Expression bleibt jedoch der gemeinsamen Studio-Geometrie, der semantischen Hierarchie und der Capacity Protection untergeordnet.

> **A World must remain visually distinguishable through typography and graphic expression without relying on Companion or World imagery.**

Typografie darf insbesondere nicht:

- neue Page Grammar erzeugen;
- semantische Rollen verändern;
- Title- und Hero-Hierarchie auflösen;
- Companion- oder Footer-Zonen verkleinern;
- Capacity Protection umgehen;
- World-spezifische Rendererpfade begründen.

Eine optionale Accent Typography ist eine sparsame redaktionelle Stimme für kurze Zitate, Notizen oder vergleichbare Akzente. Sie ist kein alternativer Body Font und darf die Lesbarkeit oder Seitenkapazität nicht dominieren.

Die technische Repräsentation der typografischen Rollen wird world-übergreifend generisch gehalten. World-spezifische CSS-Expression darf die Rollen konkret ausformen; sie ersetzt nicht die gemeinsame semantische Typografie-Hierarchie.

## Shared Graphic Language

Semantik bleibt world-übergreifend stabil. Signets wie Wissen, Fotospot, Tipp, Souvenir, Wichtig und Geschichte behalten ihre Bedeutung. Die World bestimmt Ausdruck, Farbe und Gewichtung.

> Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.

## Layout-Invarianten

- Adaptive Layout Grammar bleibt shared.
- Hero, Title, Content, Extension, Companion und Footer sind geschützte semantische Zonen.
- Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.
- Ortsnamen werden nicht getrennt, um eine Layoutvariante zu retten.
- Extension Capacity Protection bleibt world-unabhängig.
- World-Wechsel ändert keine Reiseinhalte, IDs, Bildrollen oder Seitenwirkungen.
- Typografische World Expression muss innerhalb der bestehenden Golden-Geometry- und Capacity-Grenzen funktionieren.

## World Assets

World Assets sind semantisch oder charakteristisch. Es gibt keine frei wachsende Asset-Bibliothek. Reiseinhalt wie Ortsfotos oder QR-Ziele gehört nicht zur World.

## Destination Interest Pages · Build 026

Every released Editorial World must support the shared `destination_interest` grammar. Interest semantics are World-independent: **Fotografie**, **Wandern & Natur**, **Kultur & Geschichte** and **Kulinarik & Lokal** remain the same when a Travelbook changes World. Typography, Companion, accents and Editorial Treatments may change through World Expression; authored content and interest kind do not.

## Curated Accent

Utility pages such as Inhaltsverzeichnis and Notizen may use one fixed, world-owned **Curated Accent**. It is intentionally smaller and quieter than a Curated Hero, cannot be changed by the user, and yields space before navigation, writing capacity, Companion or Footer are compromised.
