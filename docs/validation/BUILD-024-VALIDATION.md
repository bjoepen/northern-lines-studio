# Build 024 Validation

## Automatische Gates
```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World-Test
1. Bestehendes Build-023-Travelbook öffnen und Migration auf 0.10.0 bestätigen.
2. Bergen ohne Extension prüfen: Seite muss visuell unverändert bleiben.
3. `Wissen` ergänzen, Titel `Hanse in Bergen`, kurzen Text eintragen und sichern.
4. Preview prüfen: ein Signet, world-konforme Fläche, Inhalt; kein Rahmen und kein zusätzlicher Divider.
5. `Tipp` ergänzen und unterschiedliche Flächengewichtung prüfen.
6. Seite wechseln: Dirty-State muss bei ungesicherten Extension-Änderungen `Verwerfen · Abbrechen · Speichern` anbieten.
7. Projekt neu öffnen: Extensions müssen erhalten bleiben.
8. Weite, Bild links und Bild rechts prüfen: Companion und Footer bleiben invariant.

## Stop/Go
**GO**, wenn Semantik persistiert, Preview ruhig bleibt und die Companion-Zone frei bleibt.
**STOP**, wenn Extension-Flächen zu Cards werden, den Companion verdrängen oder Signet-/World-Semantik vermischen.


## Adaptive Grammar Polish – Real-World-Checks

Zusätzlich prüfen:

1. **Bergen** in Weite: ausgeglichene Title-Komposition.
2. **Stavanger** und **Geiranger**: Name bleibt vollständig in einer Zeile/zulässigen Wortgrenze; kein `Stavange / r`.
3. **Geirangerfjord** bzw. längerer Name: Title erhält mehr Breite oder Intro wechselt unter den Titel.
4. Zwei kurze Extensions: ruhige Zweierkomposition.
5. Lange Wissen-Extension + kurzer Fotospot: asymmetrische Verteilung.
6. Zwei dichte Extensions: gestapelte Grammar prüfen.
7. In allen Fällen bleibt die Companion-/Footer-Zone frei.

8. **Portraitvarianten mit langem Ortsnamen:** Bild links/rechts dürfen dem Story-Bereich innerhalb ihrer Grammar mehr Breite geben; das Bild bleibt in seiner Bildzone.
