# Build 017 – Travel Language Footer Stabilization

## Korrektur

Der provisorische Footer

`NORTHERN LINES · DEINE REISE BEGINNT HIER. | FJORD | Seitenzahl`

wird durch den im Norwegen Travelbook etablierten Northern-Lines-Footer ersetzt:

`TRAVEL · PHOTOGRAPHY · Signet · MEMORIES`

## Architektur

- Der semantische Footer gehört zur **Northern Lines Travel Language**.
- Die **Editorial World** bestimmt seine visuelle Expression, insbesondere die Farbe.
- Für Fjord wird der Footer daher in der Fjord-Akzentfarbe dargestellt.
- Die Seitenzahl bleibt bewusst ein separates Navigationselement.
- Der Landingpage-Slogan `Deine Reise beginnt hier.` wird nicht zum Fieldbook-Footer.

## Zusätzlich stabilisiert

Der Workspace-Test erwartet nun auch die in Build 017 eingeführten Felder
`layoutSystemId` und `layoutSystemName`.
