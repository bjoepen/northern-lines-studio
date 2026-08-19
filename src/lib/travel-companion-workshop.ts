export interface CuratedWorkshopWorld {
  id: 'see' | 'compose' | 'expose' | 'travel';
  label: string;
  question: string;
  orientation: string;
  description: string;
  practice: string;
}

export interface CuratedWorkshopSource {
  title: string;
  publisher: string;
  url: string;
  supports: string[];
}

/**
 * Curated, program-neutral Northern Lines photography knowledge.
 * The workshop deliberately avoids fixed camera recipes and software-specific
 * post-processing instructions. It teaches decisions that remain valid across
 * camera systems and editing applications.
 */
export const CURATED_WORKSHOP_WORLDS: readonly CuratedWorkshopWorld[] = [
  {
    id: 'see',
    label: 'Sehen',
    question: 'Was sehe ich?',
    orientation: 'Motiv · Linien · Vordergrund · Tiefe',
    description: 'Ein Bild ordnet eine dreidimensionale Szene auf einer Fläche. Linien, Vordergrund, Schärfe und Ebenen können Blickführung und räumliche Wirkung unterstützen.',
    practice: 'Bevor du auslöst: einen Schritt zur Seite, tiefer oder höher gehen. Prüfe, was ins Bild gehört – und was nicht.'
  },
  {
    id: 'compose',
    label: 'Gestalten',
    question: 'Wie möchte ich es erzählen?',
    orientation: 'Standpunkt · Ausschnitt · Brennweite · Schärfentiefe',
    description: 'Der Standpunkt verändert die räumliche Beziehung der Bildelemente. Die Brennweite bestimmt Bildwinkel und Vergrößerung; die Blende beeinflusst unter anderem die Schärfentiefe.',
    practice: 'Wähle zuerst die gewünschte Wirkung und den Standpunkt. Nutze danach Ausschnitt, Brennweite und Schärfentiefe als Gestaltungsmittel.'
  },
  {
    id: 'expose',
    label: 'Belichten',
    question: 'Was muss die Kamera dafür tun?',
    orientation: 'Licht · Bewegung · Blende · Zeit · ISO',
    description: 'Blende, Verschlusszeit und ISO wirken gemeinsam auf die Belichtung. Die Verschlusszeit beeinflusst zusätzlich die Darstellung von Bewegung; die Blende beeinflusst die Schärfentiefe.',
    practice: 'Lies zuerst Licht und Bewegung. Entscheide dann, was scharf, bewegt oder ruhig wirken soll – und leite daraus die Einstellungen ab.'
  },
  {
    id: 'travel',
    label: 'Unterwegs',
    question: 'Was brauche ich wirklich?',
    orientation: 'Beobachten · vereinfachen · prüfen · weitergehen',
    description: 'Unterwegs ändern sich Licht, Wetter, Abstand und Motiv oft schneller als der Plan. Ein klarer Ablauf hilft: beobachten, Bildidee wählen, fotografieren und kurz kontrollieren.',
    practice: 'Weniger Entscheidungen gleichzeitig machen. Varianten ausprobieren, Ergebnis prüfen und weitergehen – statt jede Situation mit einem festen Rezept lösen zu wollen.'
  }
] as const;

export const CURATED_WORKSHOP_BRIDGE = 'Licht und Wetter sind Teil der fotografischen Situation. Der Workshop ergänzt die beiden Travel-Companion-Seiten, ohne ihre Inhalte zu wiederholen.';

export const CURATED_WORKSHOP_SOURCES: readonly CuratedWorkshopSource[] = [
  {
    title: '5 Easy Composition Guidelines',
    publisher: 'Nikon USA',
    url: 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/5-easy-composition-guidelines',
    supports: ['Blickführung', 'Linien', 'Komposition']
  },
  {
    title: 'The basics of photography composition',
    publisher: 'Adobe',
    url: 'https://www.adobe.com/creativecloud/photography/technique/composition.html',
    supports: ['Tiefe', 'Schärfentiefe', 'Standpunkt', 'Komposition']
  },
  {
    title: 'Understanding Focal Length',
    publisher: 'Nikon USA',
    url: 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/understanding-focal-length',
    supports: ['Brennweite', 'Bildwinkel', 'Vergrößerung']
  },
  {
    title: 'What is Aperture?',
    publisher: 'Nikon USA',
    url: 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/what-is-aperture',
    supports: ['Blende', 'Belichtung', 'Schärfentiefe']
  },
  {
    title: 'Understanding Auto ISO',
    publisher: 'Nikon USA',
    url: 'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/understanding-auto-iso',
    supports: ['Blende', 'Verschlusszeit', 'ISO', 'Belichtung']
  },
  {
    title: 'Photography Glossary – Exposure Compensation',
    publisher: 'Nikon USA',
    url: 'https://www.nikonusa.com/learn-and-explore/photography-glossary/g/1/focal-length-multiplier.html',
    supports: ['Belichtungskorrektur', 'Belichtungsmessung']
  }
] as const;
