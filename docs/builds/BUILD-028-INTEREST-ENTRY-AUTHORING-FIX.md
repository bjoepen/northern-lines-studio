# Build 028 · Interest Entry Authoring Fix

## Ziel

Die line-by-line Sammelfeld-Logik der Interest Pages wird durch wiederholbare semantische Einträge ersetzt. Der Reisende fügt einen konkreten Fotospot, eine Route oder später einen anderen Interest-Eintrag hinzu und erhält anschließend die passende Maske.

## Verbindliche Änderungen

- Shared `DestinationInterestEntry` model for all four Interest archetypes.
- Photography: `+ Fotospot hinzufügen` with spot-owned focal length, light, motifs, guidance and place reference.
- Hiking & Nature: `+ Route hinzufügen` with route-owned start point, duration, difficulty, nature targets, guidance and place reference.
- Foundation schemas already exist for Culture & History and Culinary & Local.
- Studio chooses the page composition automatically: one shared editorial box or two boxes for two concise entries.
- `comfortable` is the default density; `tight` is allowed only for Interest Pages and only when capacity requires it.
- No fixed-height clipping. If `tight` is insufficient, Capacity Protection reports overflow instead of hiding text.
- Footer and Companion remain hard page anchors.

## Persistence

`.nls` advances from 0.13.0 to 0.14.0. Legacy Photography/Hiking line authoring is migrated into `interestEntries` without deleting the legacy content.
