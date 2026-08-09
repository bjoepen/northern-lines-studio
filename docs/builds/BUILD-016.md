# Build 016 – Journey Opening Foundation

**Studio:** 0.16.0  
**`.nls`:** 0.5.0

## Leitgedanke

> Der Reisende öffnet kein Projekt. Er öffnet seine Reise.

## Neu

- `.nls` wird als Northern-Lines-Reisedokument registriert.
- Auf macOS ist `.nls` als Package-Typ deklariert.
- Finder-Open-Events werden von Tauri empfangen.
- Open-Requests werden gepuffert, damit auch ein Kaltstart zuverlässig funktioniert.
- Bei laufendem Studio wird eine zweite Reise über denselben Ladeweg geöffnet.
- Ungesicherte Story-Inhalte bleiben durch den bestehenden Dirty-State-Dialog geschützt.
- Build 016 führt erstmals eine verpflichtende Installed-App-Validation unter `/Applications` ein.

## Definition of Done

Build 016 ist **nur dann abgeschlossen**, wenn beide Bedingungen erfüllt sind:

1. Studio läuft bereits → Doppelklick auf eine `.nls`-Reise öffnet diese Reise.
2. Studio ist beendet → Doppelklick auf eine `.nls`-Reise startet `/Applications/Northern Lines Studio.app` und öffnet diese Reise.
