# Northern Lines Studio – Product DNA · Golden Build 040 Addendum

**Stand:** Golden Build 040 · Studio 0.40.0-alpha.1  
**Status:** Verbindlicher additiver Bestandteil der Produkt-DNA  
**Baseline:** `docs/PRODUCT-DNA.md`  
**Referenz-Restore:** letzter vollständig erfolgreicher Stand nach PDF/A-2b Runtime-Validierung: `ce8b894`

---

## 1. Authority und Erhaltungsregel

`docs/PRODUCT-DNA.md` bleibt die vollständige normative Baseline. Dieses Addendum ergänzt ausschließlich später bewiesene Regeln und dokumentiert ausdrücklich supersedete Architekturentscheidungen.

> **Normative Contracts und Produkt-DNA werden nicht redaktionell verkürzt, paraphrasiert oder stillschweigend entfernt.**

Künftige Konsolidierungen sind ausschließlich verlustfrei und additiv. Eine bestehende aktive Invariante darf nur entfallen, wenn eine ausdrückliche, auditierbare Supersession-Entscheidung vorliegt. Die ursprüngliche Regel bleibt als historische Evidenz nachvollziehbar.

Consistency Gates, die konkrete DNA-Sätze schützen, werden nicht abgeschwächt, um eine Dokumentänderung passend zu machen. Im Konfliktfall wird der geschützte Contract restauriert oder ausdrücklich superseded.

---

## 2. Golden Build 040 · exact A5

DIN A5 ist eine physische Produkteigenschaft und keine abstrakte Canvas-Metapher.

```text
Studio width            420 u
physical height         595.9459459459 u
Golden composition      420 × 594 u
physical medium         148 × 210 mm
```

Die etablierte Golden Composition bleibt innerhalb dieser physischen Seite maßgeblich. Die Korrektur auf exact A5 ist keine Einladung, Footer, Companion, Title, Hero oder Content neu zu komponieren.

> **Studio entscheidet, was die Seite ist.**

---

## 3. Supersession · Studio und Publisher

Die historischen Baseline-Abschnitte, nach denen Northern Lines Publisher die finale Geometrie bzw. die Publishing-Wahrheit für bereits in Studio aufgelöste Seiten besitzt, sind für den heutigen Studio-originated Travelbook-Pfad **ausdrücklich superseded**.

Aktuell verbindlich ist:

> **Studio ist die visuelle und geometrische Quelle der Wahrheit für Studio-originierte Seiten.**

```text
Studio resolved page
      ↓
proof/export
      ↓
optional downstream production infrastructure
```

Northern Lines Publisher bleibt ein eigenständiges Produkt und kann Production-, Prepress-, CLI-, Asset-Staging-, Hashing-, Preflight- und ähnliche Aufgaben übernehmen. Für bereits aufgelöste Studio-Seiten gilt jedoch:

> **Publisher darf Studio-originierte Seiten nicht re-komponieren.**

Eine zweite Layout Engine darf Studio-Typografie, Content Fit oder Geometrie nicht neu interpretieren.

---

## 4. Proof und Export reproduzieren Studio

Der akzeptierte macOS-PDF-Pfad ist visuelle QA und Produktionsausgabe der bereits aufgelösten Studio-Seite, keine zweite Layout Engine.

Verboten sind insbesondere:

- fit-to-page;
- scale-to-fit;
- shrink-to-fit;
- nicht-uniforme Skalierung;
- renderer-spezifische Ersatztypografie;
- Reflow;
- nachträgliche Re-Komposition.

> **Der Exporter reproduziert Studio; er interpretiert Studio nicht neu.**

Whole-document Proof und Standard PDF folgen der kanonischen Publication Order und unterstützen variable Seitenzahlen.

---

## 5. PDF/A-2b

PDF/A-2b ist begrenzte strukturelle Nachverarbeitung des akzeptierten Standard PDF und kein Layoutmodus.

Nicht erlaubt sind Re-Rendering, Rasterisierung, Reflow, Skalierung, Translation oder eine zweite Composition Engine.

Geschützt bleiben insbesondere:

- Page Count;
- Page Order;
- exact-A5 PageBoxes;
- Content Streams;
- Image Streams;
- Font Resources;
- Layout Geometry.

Externe veraPDF-Validierung bleibt Engineering-/Release-Authority für ISO-Conformance.

---

## 6. Editorial Worlds

Eine Editorial World ist eine kuratierte visuelle Sprache, kein Theme. Die physische Seite bleibt weiß bzw. neutral-weiß.

World Expression entsteht gezielt über Typografie, Akzente, Signets, kuratierte Flächen, Curated Accents, Companion und Fotografie.

Destination Interest Pages und neue kuratierte Seitenfamilien erben die vollständige aktive World Expression. Fjord und Ostsee besitzen jeweils ihre eigene Expression; Semantik und Authoring-Modell bleiben world-unabhängig.

---

## 7. Content Fit und geschützte Geometrie bleiben unangetastet

Alle in der Baseline festgelegten Regeln zu Content Fit, Capacity Protection, Safe Zones, Companion, Footer, Binding, Title/Hero-Zonen, Interest-Page-Density, Structured Entries, Curated Heroes und Travel Companion Pages bleiben aktiv, soweit sie nicht in diesem Addendum ausdrücklich superseded werden.

Insbesondere bleiben die geschützten Leitsätze und mechanisch geprüften Contracts wortgleich Bestandteil der Produkt-DNA.

> **Eine Safe Zone ist eine Grenze, keine Empfehlung.**

> **Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.**

> **Die Seitenwirkung bleibt stabil. Die innere Komposition passt sich dem Inhalt an.**

> **Content Fit entscheidet über die Komposition.**

> **Capacity Protection bleibt autoritativ.**

> **Overflow nur aus geometrischem Content Fit.**

---

## 8. Dokumentations- und Engineering-Regel nach dem Restore Audit

Der Audit gegen `ce8b894` hat gezeigt, dass der Commit `241415a` die normative `PRODUCT-DNA.md` mit 1.702 Löschungen und 512 Ergänzungen zu aggressiv verdichtet hat. Die nachfolgenden Consistency-Gates haben mehrere dabei verlorene aktive Invarianten korrekt erkannt.

Daraus folgt verbindlich:

1. Normative Dokumente werden niemals durch eine verkürzte Neufassung ersetzt.
2. Aktive Contracts bleiben wortgleich erhalten.
3. Supersession wird explizit, begründet und auditierbar dokumentiert.
4. Repository-Hygiene darf historische Artefakte entfernen, aber keine aktive Authority.
5. Vor Dokumentations-Cleanup wird geprüft, welche Dateien von Consistency Gates oder aktuellen Authority-Dokumenten referenziert werden.
6. Ein Cleanup gilt erst nach vollständigem `pnpm consistency` als akzeptiert.

---

## 9. Entwicklungsphase nach Golden Build 040

> **Build 001–040: Studio lernt, ein Northern-Lines-Travelbook zu sein.**

Die folgende Phase dient der kontrollierten Reifung zum fertigen Produkt. Neue Seitenfamilien und Funktionen erweitern die bewiesene Grammar; sie eröffnen geschützte Contracts nicht ohne neue Evidenz und ausdrückliche Entscheidung erneut.
