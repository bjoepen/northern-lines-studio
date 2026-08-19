import type { EditorialComponentRule, PageGrammarDefinition } from './types';

const required = (id: EditorialComponentRule['id'], label: string): EditorialComponentRule => ({ id, label, required: true });
const optional = (id: EditorialComponentRule['id'], label: string): EditorialComponentRule => ({ id, label, required: false });
const frame = ['header', 'footer', 'page_number', 'companion'] as const;

export const grammarDefinitions: readonly PageGrammarDefinition[] = [
  { id: 'cover', name: 'Cover', purpose: 'Eröffnet die Editorial World und setzt die emotionale Erwartung der Reise.', story: [required('hero', 'Hero'), required('title', 'Titel'), optional('subtitle', 'Unterzeile')], editorialFrame: [] },
  { id: 'welcome', name: 'Welcome', purpose: 'Begrüßt den Leser und öffnet den erzählerischen Raum des Travelbooks.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('introduction', 'Willkommenstext'), optional('quote', 'Zitat')], editorialFrame: frame },
  { id: 'contents', name: 'Contents', purpose: 'Gibt Orientierung, ohne den ruhigen Editorial Rhythm zu verlassen.', story: [required('title', 'Titel'), required('contents', 'Inhaltsübersicht')], editorialFrame: frame },
  { id: 'planning', name: 'Journey Planning', purpose: 'Gibt der Reise ihren zeitlichen und praktischen Rahmen, bevor die Route beginnt.', story: [required('title', 'Titel'), optional('introduction', 'Einleitung')], editorialFrame: frame },
  {
    id: 'destination', name: 'Destination', purpose: 'Verbindet Atmosphäre, Ortswissen, Fotografie und praktische Reisebegleitung.',
    story: [required('hero', 'Hero'), required('title', 'Titel'), required('introduction', 'Einleitung'), required('history', 'Geschichte & Hintergründe'), required('photography', 'Fotografie & Erleben'), required('knowledge', 'Northern Lines Wissen'), required('souvenirs', 'Mitbringsel & Souvenirs'), optional('qr', 'QR-Verweis')], editorialFrame: frame
  },
  { id: 'destination_interest', name: 'Destination Interest', purpose: 'Vertieft genau das, was dem Reisenden an diesem Ort wichtig ist, ohne die Haupt-Ortsseite zu überladen.', story: [required('title', 'Titel'), required('introduction', 'Einleitung')], editorialFrame: frame },
  { id: 'light', name: 'Travel Companion · Licht', purpose: 'Bewahrt kuratiertes, wiederverwendbares Wissen über natürliches Licht und ergänzt es nur dort um einen persönlichen Reisehinweis, wo die konkrete Reise etwas Eigenes beisteuert.', story: [required('title', 'Titel'), required('light_phases', 'Lichtphasen'), required('photography', 'Fotografische Orientierung'), optional('introduction', 'Für diese Reise')], editorialFrame: frame },
  { id: 'weather', name: 'Travel Companion · Wetter', purpose: 'Bewahrt kuratiertes, wiederverwendbares Wetterwissen und ergänzt es nur dort um einen persönlichen Reisehinweis, wo die konkrete Reise etwas Eigenes beisteuert.', story: [required('title', 'Titel'), required('weather_guidance', 'Wettersituationen'), required('photography', 'Reiseorientierung'), optional('introduction', 'Für diese Reise')], editorialFrame: frame },
  { id: 'workflow', name: 'Travel Companion · Fotografie-Workshop', purpose: 'Bewahrt vollständig kuratierte, programmneutrale fotografische Praxis als ruhige Entscheidungsbegleitung. Der Workshop ist nicht reisespezifisch authorierbar.', story: [required('title', 'Titel'), required('workflow_steps', 'Vier Themenwelten')], editorialFrame: frame },
  { id: 'notes', name: 'Notes', purpose: 'Lässt bewusst Raum für eigene Beobachtungen, Motive und Erinnerungen.', story: [required('title', 'Titel'), required('notes_area', 'Notizbereich')], editorialFrame: frame },
  { id: 'closing', name: 'Closing Memory', purpose: 'Schließt die Reise emotional und gibt der Erinnerung Raum, weiterzuwirken.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('quote', 'Zitat'), required('closing_text', 'Abschlusstext')], editorialFrame: frame }
];
