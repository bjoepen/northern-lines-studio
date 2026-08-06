# ADR-001 – SwiftUI und AppKit

- **Status:** Superseded
- **Ersetzt durch:** ADR-002

## Frühere Entscheidung

SwiftUI war für App-Shell, Navigation und Inspector vorgesehen; AppKit für Canvas und präzise Desktop-Interaktion.

## Ablösung

Die vollständige Xcode-Entwicklungsumgebung erwies sich für den verfügbaren Entwicklungsrechner als unverhältnismäßig groß. Für den klar begrenzten, templatebasierten Travel-Publishing-Workflow bietet eine Tauri-Oberfläche eine leichtere Entwicklungsbasis.

Die Produktgrenzen und die Trennung vom Northern Lines Publisher bleiben unverändert.
