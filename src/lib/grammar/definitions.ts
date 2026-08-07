import type { EditorialComponentRule, PageGrammarDefinition } from './types';

const required = (id: EditorialComponentRule['id'], label: string): EditorialComponentRule => ({ id, label, required: true });
const optional = (id: EditorialComponentRule['id'], label: string): EditorialComponentRule => ({ id, label, required: false });
const frame = ['header', 'footer', 'page_number', 'companion'] as const;

export const grammarDefinitions: readonly PageGrammarDefinition[] = [
  { id: 'cover', name: 'Cover', purpose: 'Eröffnet die Editorial World und setzt die emotionale Erwartung der Reise.', story: [required('hero', 'Hero'), required('title', 'Titel'), optional('subtitle', 'Unterzeile')], editorialFrame: [] },
  { id: 'welcome', name: 'Welcome', purpose: 'Begrüßt den Leser und öffnet den erzählerischen Raum des Travelbooks.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('introduction', 'Willkommenstext'), optional('quote', 'Zitat')], editorialFrame: frame },
  { id: 'contents', name: 'Contents', purpose: 'Gibt Orientierung, ohne den ruhigen Editorial Rhythm zu verlassen.', story: [required('title', 'Titel'), required('contents', 'Inhaltsübersicht')], editorialFrame: frame },
  {
    id: 'destination', name: 'Destination', purpose: 'Verbindet Atmosphäre, Ortswissen, Fotografie und praktische Reisebegleitung.',
    story: [required('hero', 'Hero'), required('title', 'Titel'), required('introduction', 'Einleitung'), required('history', 'Geschichte & Hintergründe'), required('photography', 'Fotografie & Erleben'), required('knowledge', 'Northern Lines Wissen'), optional('souvenirs', 'Mitbringsel & Souvenirs'), optional('qr', 'QR-Verweis')], editorialFrame: frame
  },
  { id: 'light', name: 'Light', purpose: 'Übersetzt Licht in Stimmung, fotografische Orientierung und Vorfreude.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('light_phases', 'Lichtphasen'), required('photography', 'Fotografie'), optional('quote', 'Zitat')], editorialFrame: frame },
  { id: 'weather', name: 'Weather', purpose: 'Macht Wetter zu einem Teil des Erlebnisses statt zu einer technischen Randnotiz.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('weather_guidance', 'Wettersituationen'), required('photography', 'Fotografie')], editorialFrame: frame },
  { id: 'workflow', name: 'Workflow', purpose: 'Bewahrt wiederverwendbare fotografische Praxis als ruhigen Referenzinhalt.', story: [required('title', 'Titel'), required('workflow_steps', 'Workflow-Schritte'), optional('workflow_tip', 'Praxis-Tipp')], editorialFrame: frame },
  { id: 'notes', name: 'Notes', purpose: 'Lässt bewusst Raum für eigene Beobachtungen, Motive und Erinnerungen.', story: [required('title', 'Titel'), required('notes_area', 'Notizbereich')], editorialFrame: frame },
  { id: 'closing', name: 'Closing Memory', purpose: 'Schließt die Reise emotional und gibt der Erinnerung Raum, weiterzuwirken.', story: [required('hero', 'Hero'), required('title', 'Titel'), required('quote', 'Zitat'), required('closing_text', 'Abschlusstext')], editorialFrame: frame }
];
