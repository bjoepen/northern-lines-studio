import type { EditorialComponentId, EditorialFrameComponentId } from '../grammar/types';
import type { EditorialFrameComponentView, StoryComponentDefinition } from './types';

export const storyComponentDefinitions: Readonly<Record<EditorialComponentId, StoryComponentDefinition>> = {
  hero: { type: 'hero', role: 'atmosphere', description: 'Setzt Stimmung und visuelle Richtung der Seite.' },
  title: { type: 'title', role: 'narrative', description: 'Benennt die Geschichte oder den Ort.' },
  subtitle: { type: 'subtitle', role: 'narrative', description: 'Gibt der Seite eine persönliche oder emotionale zweite Stimme.' },
  introduction: { type: 'introduction', role: 'narrative', description: 'Öffnet die Geschichte und ordnet den Inhalt ein.' },
  contents: { type: 'contents', role: 'orientation', description: 'Gibt Orientierung innerhalb des Travelbooks.' },
  history: { type: 'history', role: 'place_knowledge', description: 'Bewahrt Geschichte und Hintergründe eines Ortes.' },
  photography: { type: 'photography', role: 'photography', description: 'Übersetzt den Ort in fotografische Möglichkeiten.' },
  knowledge: { type: 'knowledge', role: 'knowledge', description: 'Bringt kuratiertes Northern-Lines-Wissen in die Seite.' },
  souvenirs: { type: 'souvenirs', role: 'practical', description: 'Ergänzt regionale Mitbringsel und persönliche Reiseideen.' },
  qr: { type: 'qr', role: 'orientation', description: 'Verbindet die gedruckte Seite mit einem konkreten digitalen Ziel.' },
  light_phases: { type: 'light_phases', role: 'photography', description: 'Ordnet Lichtphasen als fotografische und emotionale Orientierung.' },
  weather_guidance: { type: 'weather_guidance', role: 'practical', description: 'Macht Wetterbedingungen als Teil der Reise verständlich.' },
  workflow_steps: { type: 'workflow_steps', role: 'workflow', description: 'Bewahrt einen wiederverwendbaren fotografischen Arbeitsablauf.' },
  workflow_tip: { type: 'workflow_tip', role: 'workflow', description: 'Ergänzt einen kurzen praxiserprobten Hinweis zum Workflow.' },
  notes_area: { type: 'notes_area', role: 'memory', description: 'Gibt eigenen Beobachtungen und Erinnerungen bewusst Raum.' },
  quote: { type: 'quote', role: 'memory', description: 'Verdichtet die emotionale Aussage einer Seite.' },
  closing_text: { type: 'closing_text', role: 'memory', description: 'Schließt eine Reise oder Etappe redaktionell ab.' },
  photo_spots: { type: 'photo_spots', role: 'photography', description: 'Sammelt konkrete Fotospots als ortsbezogene fotografische Stationen.' },
  photo_light: { type: 'photo_light', role: 'photography', description: 'Ordnet Licht und Tageszeit als praktische Orientierung für diesen Ort ein.' },
  photo_motifs: { type: 'photo_motifs', role: 'photography', description: 'Benennt Motive und Bildideen, die den Charakter des Ortes sichtbar machen.' },
  photo_guidance: { type: 'photo_guidance', role: 'photography', description: 'Gibt kurze fotografische Hinweise, ohne die Reise in Technik zu verwandeln.' },
  photo_focal_lengths: { type: 'photo_focal_lengths', role: 'photography', description: 'Hält Brennweiten- und Praxisempfehlungen als freiwillige Orientierung fest.' },
  photo_place_reference: { type: 'photo_place_reference', role: 'orientation', description: 'Verknüpft die Fotografie mit einem konkreten Karten-, Orts- oder Routenbezug.' }
};

const frameDefinitions: Readonly<Record<EditorialFrameComponentId, EditorialFrameComponentView>> = {
  header: { id: 'header', label: 'Header', purpose: 'Verbindet die Seite mit der Editorial World und dem Travelbook.' },
  footer: { id: 'footer', label: 'Footer', purpose: 'Trägt die ruhige Publikationssignatur durch das Buch.' },
  page_number: { id: 'page_number', label: 'Seitenzahl', purpose: 'Orientiert dynamisch im Travelbook.' },
  companion: { id: 'companion', label: 'Companion', purpose: 'Begleitet den Leser und verbindet Orte und Seiten emotional.' }
};

export function storyDefinitionFor(id: EditorialComponentId): StoryComponentDefinition {
  return storyComponentDefinitions[id];
}

export function editorialFrameDefinitionFor(id: EditorialFrameComponentId): EditorialFrameComponentView {
  return frameDefinitions[id];
}
