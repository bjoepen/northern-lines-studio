use serde::{Deserialize, Serialize};
use std::{collections::{BTreeMap, HashSet}, fs, path::Path, sync::Mutex};

const EXPECTED_FORMAT: &str = "northern-lines-studio-project";
const CURRENT_FORMAT_VERSION: &str = "0.10.0";
const BUILD_023_FORMAT_VERSION: &str = "0.9.0";
const BUILD_021_FORMAT_VERSION: &str = "0.8.0";
const BUILD_019_FORMAT_VERSION: &str = "0.7.0";
const BUILD_018_FORMAT_VERSION: &str = "0.6.0";
const BUILD_017_FORMAT_VERSION: &str = "0.5.0";
const BUILD_009_FORMAT_VERSION: &str = "0.4.0";
const BUILD_004_FORMAT_VERSION: &str = "0.3.0";
const BUILD_003_FORMAT_VERSION: &str = "0.2.0";
const LEGACY_FORMAT_VERSION: &str = "0.1.0";
const REFERENCE_WORLD_ID: &str = "fjord";
const BALTIC_WORLD_ID: &str = "baltic";

fn is_supported_editorial_world(id: &str) -> bool {
    id == REFERENCE_WORLD_ID || id == BALTIC_WORLD_ID
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DocumentSettings {
    page_format: String,
    orientation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EditorialCompanion {
    id: String,
    name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EditorialWorld {
    id: String,
    name: String,
    #[serde(default)]
    reference: bool,
    companion: EditorialCompanion,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JourneyStage {
    id: String,
    kind: String,
    title: String,
    #[serde(default)]
    country: Option<String>,
    #[serde(default)]
    destination_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Journey {
    id: String,
    title: String,
    #[serde(rename = "type")]
    journey_type: String,
    #[serde(default)]
    start_date: Option<String>,
    #[serde(default)]
    end_date: Option<String>,
    #[serde(default)]
    departure_place: Option<String>,
    #[serde(default)]
    return_place: Option<String>,
    #[serde(default)]
    transport: Option<String>,
    #[serde(default)]
    route_summary: Option<String>,
    #[serde(default)]
    travel_focus: Vec<String>,
    #[serde(default)]
    stages: Vec<JourneyStage>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DestinationJourneyContext {
    #[serde(default)]
    arrival: Option<String>,
    #[serde(default)]
    departure: Option<String>,
    #[serde(default)]
    timezone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DestinationHighlight {
    id: String,
    name: String,
    #[serde(default)]
    description: String,
    #[serde(default = "default_highlight_category")]
    category: String,
}

fn default_highlight_category() -> String { "other".into() }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DestinationPracticalInfo {
    id: String,
    title: String,
    #[serde(default)]
    text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DestinationEditorialExtension {
    id: String,
    kind: String,
    #[serde(default)]
    title: String,
    #[serde(default)]
    text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct DestinationImages {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    wide: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    portrait: Option<String>,
    // Compatibility with the pre-final Build 022 imagery schema. These values
    // are read so existing test projects do not lose an imported image, but
    // new writes use only `wide` and `portrait`.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    left: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    right: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DestinationEditorial {
    #[serde(default = "default_destination_layout")]
    layout_variant: String,
}

fn default_destination_layout() -> String { "destination-hero-banner".into() }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Destination {
    id: String,
    name: String,
    #[serde(default)]
    subtitle: Option<String>,
    #[serde(default)]
    introduction: Option<String>,
    #[serde(default)]
    journey_context: Option<DestinationJourneyContext>,
    #[serde(default)]
    reasons: Vec<String>,
    #[serde(default)]
    highlights: Vec<DestinationHighlight>,
    #[serde(default)]
    practical_info: Vec<DestinationPracticalInfo>,
    #[serde(default)]
    editorial_extensions: Vec<DestinationEditorialExtension>,
    #[serde(default)]
    images: DestinationImages,
    #[serde(default = "default_destination_editorial")]
    editorial: DestinationEditorial,
}

fn default_destination_editorial() -> DestinationEditorial {
    DestinationEditorial { layout_variant: default_destination_layout() }
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AuthoringEntry {
    component_id: String,
    content: String,
    status: String,
    #[serde(default)]
    updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioPage {
    id: String,
    order: u32,
    #[serde(rename = "type")]
    page_type: String,
    #[serde(default)]
    role: Option<String>,
    title: String,
    content: String,
    layout: String,
    #[serde(default)]
    journey_stage: Option<String>,
    #[serde(default)]
    knowledge_type: Option<String>,
    #[serde(default)]
    components: Vec<String>,
    #[serde(default)]
    authoring: BTreeMap<String, AuthoringEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioProject {
    format: String,
    format_version: String,
    project_id: String,
    title: String,
    edition: Option<String>,
    language: String,
    #[serde(default)]
    editorial_world_id: Option<String>,
    #[serde(default, rename = "editorialWorld", skip_serializing)]
    legacy_editorial_world: Option<EditorialWorld>,
    #[serde(default)]
    journey: Option<Journey>,
    #[serde(default)]
    destinations: Vec<Destination>,
    document: DocumentSettings,
    page_manifest: Vec<StudioPage>,
    #[serde(default, skip_serializing)]
    project_path: String,
    #[serde(default, skip_serializing)]
    migrated_from_version: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ProjectSession {
    #[serde(flatten)]
    project: StudioProject,
    project_path: String,
}

fn project_session(project: StudioProject, path: &Path) -> ProjectSession {
    ProjectSession {
        project,
        project_path: path.to_string_lossy().into_owned(),
    }
}


#[derive(Default)]
struct OpenRequestState {
    path: Mutex<Option<String>>,
}

fn is_nls_path(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| extension.eq_ignore_ascii_case("nls"))
}

fn remember_open_request(state: &OpenRequestState, path: String) {
    if let Ok(mut pending) = state.path.lock() {
        *pending = Some(path);
    }
}

#[tauri::command]
fn take_pending_open_path(state: tauri::State<'_, OpenRequestState>) -> Option<String> {
    state.path.lock().ok()?.take()
}

fn infer_role(page_type: &str) -> &'static str {
    match page_type {
        "cover" | "welcome" | "contents" => "front_matter",
        "planning" => "journey_planning",
        "destination" => "destination",
        "knowledge" => "journey_knowledge",
        "workflow" => "workflow",
        "closing" => "closing_memory",
        "notes" => "notes",
        _ => "notes",
    }
}

fn infer_components(page: &StudioPage) -> Vec<String> {
    let ids: &[&str] = match page.page_type.as_str() {
        "cover" => &["hero", "title", "subtitle"],
        "welcome" => &["hero", "title", "introduction", "quote"],
        "contents" => &["title", "contents"],
        "planning" => &["title", "introduction"],
        "destination" => &["hero", "title", "introduction", "history", "photography", "knowledge", "souvenirs", "qr"],
        "knowledge" if page.knowledge_type.as_deref() == Some("photography_light") => &["hero", "title", "light_phases", "photography", "quote"],
        "knowledge" if page.knowledge_type.as_deref() == Some("travel_weather") => &["hero", "title", "weather_guidance", "photography"],
        "workflow" => &["title", "workflow_steps", "workflow_tip"],
        "notes" => &["title", "notes_area"],
        "closing" => &["hero", "title", "quote", "closing_text"],
        _ => &["title"],
    };
    ids.iter().map(|id| (*id).to_string()).collect()
}

fn ensure_components(project: &mut StudioProject) {
    for page in &mut project.page_manifest {
        if page.components.is_empty() {
            let inferred = infer_components(page);
            page.components = inferred;
        }
    }
}


fn ensure_journey_planning_page(project: &mut StudioProject) {
    if project.page_manifest.iter().any(|page| page.page_type == "planning") {
        return;
    }

    let mut planning = StudioPage {
        id: "page-planning".into(),
        order: 4,
        page_type: "planning".into(),
        role: Some("journey_planning".into()),
        title: "Reiseplanung".into(),
        content: "content/pages/004-planning.md".into(),
        layout: "planning".into(),
        journey_stage: None,
        knowledge_type: None,
        components: Vec::new(),
        authoring: BTreeMap::new(),
    };
    planning.components = infer_components(&planning);
    project.page_manifest.push(planning);

    for page in &mut project.page_manifest {
        if page.page_type == "destination" && page.order >= 4 {
            page.order += 1;
        }
    }
}

fn infer_legacy_journey(project: &StudioProject) -> Journey {
    let mut stages = Vec::new();
    for page in &project.page_manifest {
        if page.page_type == "destination" {
            stages.push(JourneyStage {
                id: page.id.trim_start_matches("page-").to_string(),
                kind: "destination".into(),
                title: page.title.clone(),
                country: None,
                destination_id: None,
            });
        }
    }

    Journey {
        id: format!("{}-journey", project.project_id),
        title: project.title.clone(),
        journey_type: "journey".into(),
        start_date: None,
        end_date: None,
        departure_place: None,
        return_place: None,
        transport: None,
        route_summary: None,
        travel_focus: Vec::new(),
        stages,
    }
}

fn ensure_destination_profiles(project: &mut StudioProject) {
    let page_by_stage: BTreeMap<String, (String, String, String)> = project
        .page_manifest
        .iter()
        .filter_map(|page| {
            if page.page_type != "destination" { return None; }
            let stage_id = page.journey_stage.clone()?;
            let intro = page.authoring.get("introduction").map(|entry| entry.content.clone()).unwrap_or_default();
            Some((stage_id, (page.title.clone(), intro, page.layout.clone())))
        })
        .collect();

    let Some(journey) = project.journey.as_mut() else { return; };
    for stage in journey.stages.iter_mut().filter(|stage| stage.kind == "destination") {
        let destination_id = stage
            .destination_id
            .clone()
            .unwrap_or_else(|| format!("destination-{}", stage.id));
        stage.destination_id = Some(destination_id.clone());

        if project.destinations.iter().any(|destination| destination.id == destination_id) {
            continue;
        }

        let (page_title, introduction, page_layout) = page_by_stage
            .get(&stage.id)
            .cloned()
            .unwrap_or_else(|| (stage.title.clone(), String::new(), String::new()));
        let layout_variant = match page_layout.as_str() {
            "destination-hero-left" | "destination-hero-right" | "destination-hero-banner" => page_layout,
            _ => default_destination_layout(),
        };
        project.destinations.push(Destination {
            id: destination_id,
            name: if page_title.trim().is_empty() { stage.title.clone() } else { page_title },
            subtitle: None,
            introduction: (!introduction.trim().is_empty()).then_some(introduction),
            journey_context: None,
            reasons: Vec::new(),
            highlights: Vec::new(),
            practical_info: Vec::new(),
            editorial_extensions: Vec::new(),
            images: DestinationImages::default(),
            editorial: DestinationEditorial { layout_variant },
        });
    }

    for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "destination") {
        if !matches!(page.layout.as_str(), "destination-hero-banner" | "destination-hero-left" | "destination-hero-right") {
            page.layout = default_destination_layout();
        }
    }
}

fn migrate_project(mut project: StudioProject) -> Result<StudioProject, String> {
    match project.format_version.as_str() {
        CURRENT_FORMAT_VERSION => {}
        BUILD_023_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_023_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
            ensure_destination_profiles(&mut project);
        }
        BUILD_021_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_021_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
        }
        BUILD_019_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_019_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
        }
        BUILD_018_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_018_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
        }
        BUILD_017_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_017_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
        }
        BUILD_009_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_009_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
        }
        BUILD_004_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_004_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
        }
        BUILD_003_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_003_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            if project.editorial_world_id.is_none() {
                project.editorial_world_id = project
                    .legacy_editorial_world
                    .as_ref()
                    .map(|world| world.id.clone());
            }
            ensure_components(&mut project);
        }
        LEGACY_FORMAT_VERSION => {
            project.migrated_from_version = Some(LEGACY_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();

            if project.editorial_world_id.is_none() {
                project.editorial_world_id = project
                    .legacy_editorial_world
                    .as_ref()
                    .map(|world| world.id.clone())
                    .or_else(|| Some(REFERENCE_WORLD_ID.into()));
            }

            if project.journey.is_none() {
                project.journey = Some(infer_legacy_journey(&project));
            }

            let stage_ids: Vec<String> = project
                .journey
                .as_ref()
                .map(|journey| journey.stages.iter().map(|stage| stage.id.clone()).collect())
                .unwrap_or_default();

            for page in &mut project.page_manifest {
                if page.role.is_none() {
                    page.role = Some(infer_role(&page.page_type).into());
                }
                if page.page_type == "destination" && page.journey_stage.is_none() {
                    let candidate = page.id.trim_start_matches("page-");
                    if stage_ids.iter().any(|id| id == candidate) {
                        page.journey_stage = Some(candidate.into());
                    }
                }
            }
            ensure_components(&mut project);
        }
        version => {
            return Err(format!("Nicht unterstützte Projektformat-Version: {version}"));
        }
    }
    ensure_journey_planning_page(&mut project);
    ensure_destination_profiles(&mut project);
    project.legacy_editorial_world = None;
    Ok(project)
}

fn read_project(path: &Path) -> Result<StudioProject, String> {
    if path.extension().and_then(|value| value.to_str()) != Some("nls") {
        return Err("Das ausgewählte Verzeichnis besitzt nicht die Endung .nls.".into());
    }

    let manifest_path = path.join("project.json");
    let source = fs::read_to_string(&manifest_path)
        .map_err(|_| "project.json konnte im .nls-Projekt nicht gelesen werden.".to_string())?;

    let project: StudioProject = serde_json::from_str(&source)
        .map_err(|error| format!("project.json ist ungültig: {error}"))?;

    let mut project = migrate_project(project)?;

    if project.page_manifest.iter().any(|page| page.page_type == "planning") {
        let planning_path = path.join("content/pages/004-planning.md");
        if !planning_path.exists() {
            fs::create_dir_all(path.join("content/pages"))
                .map_err(|error| format!("Reiseplanung konnte nicht vorbereitet werden: {error}"))?;
            fs::write(&planning_path, "# Reiseplanung\n")
                .map_err(|error| format!("Reiseplanung konnte nicht angelegt werden: {error}"))?;
        }
    }

    validate_project(&project)?;
    project.page_manifest.sort_by_key(|page| page.order);

    if project.migrated_from_version.is_some() {
        write_project(path, &project)?;
    }

    project.project_path = path.to_string_lossy().into_owned();
    Ok(project)
}

fn validate_project(project: &StudioProject) -> Result<(), String> {
    if project.format != EXPECTED_FORMAT {
        return Err(format!("Unbekanntes Projektformat: {}", project.format));
    }
    if project.format_version != CURRENT_FORMAT_VERSION {
        return Err(format!(
            "Projekt wurde nicht auf die aktuelle Format-Version {} normalisiert.",
            CURRENT_FORMAT_VERSION
        ));
    }
    if project.document.page_format != "A5" || project.document.orientation != "portrait" {
        return Err("Northern Lines Studio unterstützt aktuell ausschließlich A5 im Hochformat.".into());
    }
    if project.page_manifest.is_empty() {
        return Err("Das Projekt enthält keine Seiten.".into());
    }

    let world_id = project
        .editorial_world_id
        .as_deref()
        .ok_or_else(|| "Das Projekt referenziert keine Editorial World.".to_string())?;
    if world_id.trim().is_empty() {
        return Err("Das Projekt besitzt eine leere Editorial-World-ID.".into());
    }
    if !is_supported_editorial_world(world_id) {
        return Err(format!("Unbekannte Editorial World: {world_id}"));
    }

    let journey = project
        .journey
        .as_ref()
        .ok_or_else(|| "Das Projekt besitzt kein Journey-Modell.".to_string())?;
    if let (Some(start), Some(end)) = (&journey.start_date, &journey.end_date) {
        if !start.trim().is_empty() && !end.trim().is_empty() && start > end {
            return Err("Das Ende deiner Reise liegt vor ihrem Beginn.".into());
        }
    }
    if journey.id.trim().is_empty() || journey.title.trim().is_empty() || journey.journey_type.trim().is_empty() {
        return Err("Journey besitzt keine gültige ID, keinen Titel oder keinen Typ.".into());
    }

    let mut stage_ids = HashSet::new();
    let destination_ids: HashSet<String> = project.destinations.iter().map(|destination| destination.id.clone()).collect();
    for stage in &journey.stages {
        if stage.id.trim().is_empty() || stage.title.trim().is_empty() || stage.kind.trim().is_empty() {
            return Err("Journey Stage besitzt ungültige Pflichtfelder.".into());
        }
        if !stage_ids.insert(stage.id.clone()) {
            return Err(format!("Doppelte Journey-Stage-ID: {}", stage.id));
        }
        if stage.kind == "destination" {
            let destination_id = stage.destination_id.as_deref().ok_or_else(|| format!("Reiseziel '{}' besitzt keine stabile Destination-Referenz.", stage.title))?;
            if !destination_ids.contains(destination_id) {
                return Err(format!("Reiseziel '{}' verweist auf unbekanntes Destination Profile '{}'.", stage.title, destination_id));
            }
        }
    }

    if destination_ids.len() != project.destinations.len() {
        return Err("Destination Profile IDs müssen eindeutig sein.".into());
    }
    for destination in &project.destinations {
        if destination.id.trim().is_empty() || destination.name.trim().is_empty() {
            return Err("Destination Profile besitzt keine gültige ID oder keinen Namen.".into());
        }
        if !matches!(destination.editorial.layout_variant.as_str(), "destination-hero-banner" | "destination-hero-left" | "destination-hero-right") {
            return Err(format!("Destination '{}' besitzt eine unbekannte Layout-Variante.", destination.name));
        }
        for image in [&destination.images.wide, &destination.images.portrait, &destination.images.left, &destination.images.right].into_iter().flatten() {
            if !image.starts_with("assets/destinations/") {
                return Err(format!("Destination '{}' besitzt einen ungültigen Bildpfad.", destination.name));
            }
            normalized_image_extension(Path::new(image))?;
        }
        let mut highlight_ids = HashSet::new();
        for highlight in &destination.highlights {
            if highlight.id.trim().is_empty() || highlight.name.trim().is_empty() {
                return Err(format!("Destination '{}' besitzt ein ungültiges Highlight.", destination.name));
            }
            if !highlight_ids.insert(highlight.id.clone()) {
                return Err(format!("Destination '{}' besitzt doppelte Highlight-IDs.", destination.name));
            }
        }
        let mut extension_ids = HashSet::new();
        for extension in &destination.editorial_extensions {
            if extension.id.trim().is_empty() || (extension.title.trim().is_empty() && extension.text.trim().is_empty()) {
                return Err(format!("Destination '{}' besitzt eine leere Editorial Extension.", destination.name));
            }
            if !matches!(extension.kind.as_str(), "knowledge" | "photo_spot" | "tip" | "souvenir" | "important" | "history") {
                return Err(format!("Destination '{}' besitzt eine unbekannte Editorial Extension '{}'.", destination.name, extension.kind));
            }
            if !extension_ids.insert(extension.id.clone()) {
                return Err(format!("Destination '{}' besitzt doppelte Editorial-Extension-IDs.", destination.name));
            }
        }
    }

    let mut page_ids = HashSet::new();
    for (index, page) in project.page_manifest.iter().enumerate() {
        if page.id.trim().is_empty() || page.title.trim().is_empty() {
            return Err(format!("Seite {} besitzt keine gültige ID oder keinen Titel.", index + 1));
        }
        if !page_ids.insert(page.id.clone()) {
            return Err(format!("Doppelte Seiten-ID: {}", page.id));
        }
        let role = page
            .role
            .as_deref()
            .ok_or_else(|| format!("Seite '{}' besitzt keine redaktionelle Rolle.", page.title))?;
        if role.trim().is_empty() {
            return Err(format!("Seite '{}' besitzt eine leere redaktionelle Rolle.", page.title));
        }
        if page.components.is_empty() {
            return Err(format!("Seite '{}' besitzt keine Editorial Components.", page.title));
        }
        for (component_id, entry) in &page.authoring {
            if component_id != &entry.component_id {
                return Err(format!("Authoring-Eintrag '{}' auf Seite '{}' besitzt eine abweichende componentId.", component_id, page.title));
            }
            if !page.components.contains(component_id) {
                return Err(format!("Authoring-Eintrag '{}' auf Seite '{}' gehört nicht zu den Story Components.", component_id, page.title));
            }
            if !matches!(entry.status.as_str(), "empty" | "draft" | "revised" | "approved" | "final") {
                return Err(format!("Authoring-Eintrag '{}' auf Seite '{}' besitzt einen ungültigen Status.", component_id, page.title));
            }
        }
        if let Some(stage) = &page.journey_stage {
            if !stage_ids.contains(stage) {
                return Err(format!(
                    "Seite '{}' verweist auf unbekannte Journey Stage '{}'.",
                    page.title, stage
                ));
            }
        }
    }
    Ok(())
}

fn write_project(path: &Path, project: &StudioProject) -> Result<(), String> {
    let manifest_path = path.join("project.json");
    let payload = serde_json::to_string_pretty(project)
        .map_err(|error| format!("project.json konnte nicht serialisiert werden: {error}"))?;
    fs::write(&manifest_path, format!("{payload}\n"))
        .map_err(|error| format!("project.json konnte nicht gespeichert werden: {error}"))
}

fn slugify(value: &str) -> String {
    let mut slug = String::new();
    let mut last_dash = false;
    for ch in value.chars() {
        if ch.is_ascii_alphanumeric() {
            slug.push(ch.to_ascii_lowercase());
            last_dash = false;
        } else if !last_dash && !slug.is_empty() {
            slug.push('-');
            last_dash = true;
        }
    }
    while slug.ends_with('-') { slug.pop(); }
    if slug.is_empty() { "reise".into() } else { slug }
}

fn starter_page(id: &str, order: u32, page_type: &str, role: &str, title: &str, content: &str, layout: &str, knowledge_type: Option<&str>) -> StudioPage {
    let mut page = StudioPage {
        id: id.into(), order, page_type: page_type.into(), role: Some(role.into()), title: title.into(),
        content: content.into(), layout: layout.into(), journey_stage: None,
        knowledge_type: knowledge_type.map(str::to_string), components: Vec::new(), authoring: BTreeMap::new(),
    };
    page.components = infer_components(&page);
    page
}

#[tauri::command]
fn create_nls_project(parent_path: String, title: String, editorial_world_id: String, language: String) -> Result<ProjectSession, String> {
    let title = title.trim();
    if title.is_empty() { return Err("Die Reise braucht einen Namen.".into()); }
    if !is_supported_editorial_world(&editorial_world_id) {
        return Err(format!("Editorial World '{editorial_world_id}' ist für neue Reisen noch nicht freigegeben."));
    }
    let folder = Path::new(&parent_path).join(format!("{}.nls", slugify(title)));
    if folder.exists() { return Err(format!("Eine Reise mit diesem Namen existiert dort bereits: {}", folder.display())); }
    fs::create_dir_all(folder.join("content/pages")).map_err(|e| format!("Die Reise konnte nicht angelegt werden: {e}"))?;

    let pages = vec![
        starter_page("page-cover", 1, "cover", "front_matter", title, "content/pages/001-cover.md", "cover", None),
        starter_page("page-welcome", 2, "welcome", "front_matter", "Willkommen", "content/pages/002-welcome.md", "welcome", None),
        starter_page("page-contents", 3, "contents", "front_matter", "Inhaltsverzeichnis", "content/pages/003-contents.md", "contents", None),
        starter_page("page-planning", 4, "planning", "journey_planning", "Reiseplanung", "content/pages/004-planning.md", "planning", None),
        starter_page("page-light", 10, "knowledge", "journey_knowledge", "Licht", "content/pages/010-light.md", "light", Some("photography_light")),
        starter_page("page-weather", 11, "knowledge", "journey_knowledge", "Wetter", "content/pages/011-weather.md", "weather", Some("travel_weather")),
        starter_page("page-workflow", 20, "workflow", "workflow", "Fotografie-Workflow", "content/pages/020-workflow.md", "workflow", None),
        starter_page("page-notes", 30, "notes", "notes", "Notizen", "content/pages/030-notes.md", "notes", None),
        starter_page("page-closing", 40, "closing", "closing_memory", "Die Reise bleibt", "content/pages/040-closing.md", "closing", None),
    ];
    for page in &pages {
        let target = folder.join(&page.content);
        fs::write(target, format!("# {}
", page.title)).map_err(|e| format!("Startseite konnte nicht angelegt werden: {e}"))?;
    }

    let project = StudioProject {
        format: EXPECTED_FORMAT.into(), format_version: CURRENT_FORMAT_VERSION.into(),
        project_id: slugify(title), title: title.into(), edition: Some("1.0".into()), language,
        editorial_world_id: Some(editorial_world_id), legacy_editorial_world: None,
        journey: Some(Journey {
        id: format!("{}-journey", slugify(title)),
        title: title.into(),
        journey_type: "travel".into(),
        start_date: None,
        end_date: None,
        departure_place: None,
        return_place: None,
        transport: None,
        route_summary: None,
        travel_focus: Vec::new(),
        stages: Vec::new()
    }),
        destinations: Vec::new(),
        document: DocumentSettings { page_format: "A5".into(), orientation: "portrait".into() },
        page_manifest: pages, project_path: folder.to_string_lossy().into_owned(), migrated_from_version: None,
    };
    validate_project(&project)?;
    write_project(&folder, &project)?;
    let project = read_project(&folder)?;
    Ok(project_session(project, &folder))
}

#[tauri::command]
fn update_editorial_world(path: String, editorial_world_id: String) -> Result<ProjectSession, String> {
    if !is_supported_editorial_world(&editorial_world_id) {
        return Err(format!("Editorial World '{editorial_world_id}' ist nicht verfügbar."));
    }
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    project.editorial_world_id = Some(editorial_world_id);
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn load_nls_project(path: String) -> Result<ProjectSession, String> {
    let project_path = Path::new(&path);
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn save_authoring_component(
    path: String,
    page_id: String,
    component_id: String,
    content: String,
    status: String,
) -> Result<ProjectSession, String> {
    if !matches!(status.as_str(), "empty" | "draft" | "revised" | "approved" | "final") {
        return Err("Ungültiger Authoring-Status.".into());
    }
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let destination_sync = {
        let page = project.page_manifest.iter_mut().find(|page| page.id == page_id)
            .ok_or_else(|| format!("Unbekannte Seite: {page_id}"))?;
        if !page.components.contains(&component_id) {
            return Err(format!("Die Komponente '{component_id}' gehört nicht zur Seite '{}'.", page.title));
        }
        if component_id == "title" && !content.trim().is_empty() {
            page.title = content.trim().to_string();
        }
        page.authoring.insert(component_id.clone(), AuthoringEntry {
            component_id, content, status, updated_at: None
        });
        if page.page_type == "destination" {
            page.journey_stage.clone().map(|stage_id| {
                let title = page.authoring.get("title").map(|entry| entry.content.trim().to_string()).filter(|value| !value.is_empty());
                let introduction = page.authoring.get("introduction").map(|entry| entry.content.trim().to_string());
                (stage_id, title, introduction)
            })
        } else { None }
    };
    if let Some((stage_id, title, introduction)) = destination_sync {
        if let Some(destination_id) = project
            .journey
            .as_ref()
            .and_then(|journey| journey.stages.iter().find(|stage| stage.id == stage_id))
            .and_then(|stage| stage.destination_id.clone())
        {
            if let Some(destination) = project.destinations.iter_mut().find(|destination| destination.id == destination_id) {
                if let Some(title) = title { destination.name = title; }
                if let Some(introduction) = introduction {
                    destination.introduction = (!introduction.is_empty()).then_some(introduction);
                }
            }
        }
    }
    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}


#[tauri::command]
fn add_journey_place(path: String, title: String, country: String) -> Result<ProjectSession, String> {
    let title = title.trim();
    if title.is_empty() { return Err("Gib dem Ort zuerst einen Namen.".into()); }
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let base = slugify(title);
    if base.is_empty() { return Err("Für diesen Ortsnamen konnte keine gültige Kennung erzeugt werden.".into()); }
    let journey = project.journey.as_mut().ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;
    if journey.stages.iter().any(|stage| stage.id == base || stage.title.eq_ignore_ascii_case(title)) {
        return Err(format!("{title} gehört bereits zu deiner Reise."));
    }
    let destination_id = format!("destination-{base}");
    journey.stages.push(JourneyStage {
        id: base.clone(),
        kind: "destination".into(),
        title: title.into(),
        country: (!country.trim().is_empty()).then(|| country.trim().to_string()),
        destination_id: Some(destination_id.clone()),
    });
    project.destinations.push(Destination {
        id: destination_id,
        name: title.into(),
        subtitle: None,
        introduction: None,
        journey_context: None,
        reasons: Vec::new(),
        highlights: Vec::new(),
        practical_info: Vec::new(),
        editorial_extensions: Vec::new(),
        images: DestinationImages::default(),
        editorial: default_destination_editorial(),
    });
    let destination_count = project.page_manifest.iter().filter(|page| page.page_type == "destination").count() as u32;
    let order = 5 + destination_count;
    let content = format!("content/pages/{:03}-{}.md", order, base);
    let mut page = StudioPage {
        id: format!("page-{base}"), order, page_type: "destination".into(), role: Some("destination".into()),
        title: title.into(), content: content.clone(), layout: default_destination_layout(), journey_stage: Some(base),
        knowledge_type: None, components: Vec::new(), authoring: BTreeMap::new(),
    };
    page.components = infer_components(&page);
    fs::write(project_path.join(&content), format!("# {title}\n")).map_err(|e| format!("Der Ort konnte nicht angelegt werden: {e}"))?;
    project.page_manifest.push(page);
    project.page_manifest.sort_by_key(|page| page.order);
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}


fn optional_text(value: String) -> Option<String> {
    let value = value.trim().to_string();
    (!value.is_empty()).then_some(value)
}

#[tauri::command]
fn update_journey_planning(
    path: String,
    start_date: String,
    end_date: String,
    departure_place: String,
    return_place: String,
    transport: String,
    route_summary: String,
    travel_focus: Vec<String>,
) -> Result<ProjectSession, String> {
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;

    if !start_date.trim().is_empty() && !end_date.trim().is_empty() && start_date > end_date {
        return Err("Das Ende deiner Reise liegt vor ihrem Beginn.".into());
    }

    let journey = project
        .journey
        .as_mut()
        .ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;

    journey.start_date = optional_text(start_date);
    journey.end_date = optional_text(end_date);
    journey.departure_place = optional_text(departure_place);
    journey.return_place = optional_text(return_place);
    journey.transport = optional_text(transport);
    journey.route_summary = optional_text(route_summary);
    journey.travel_focus = travel_focus
        .into_iter()
        .map(|entry| entry.trim().to_string())
        .filter(|entry| !entry.is_empty())
        .collect();

    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn move_journey_place(path: String, stage_id: String, direction: String) -> Result<ProjectSession, String> {
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let journey = project
        .journey
        .as_mut()
        .ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;

    let index = journey
        .stages
        .iter()
        .position(|stage| stage.id == stage_id)
        .ok_or_else(|| format!("Der Ort '{stage_id}' gehört nicht zu deiner Route."))?;

    let target = match direction.as_str() {
        "earlier" if index > 0 => Some(index - 1),
        "later" if index + 1 < journey.stages.len() => Some(index + 1),
        "earlier" | "later" => None,
        _ => return Err("Unbekannte Routenrichtung.".into()),
    };

    if let Some(target) = target {
        journey.stages.swap(index, target);
    }

    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn update_journey_place(
    path: String,
    stage_id: String,
    title: String,
    country: String,
) -> Result<ProjectSession, String> {
    let title = title.trim();
    if title.is_empty() {
        return Err("Gib dem Ort zuerst einen Namen.".into());
    }

    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;

    {
        let journey = project
            .journey
            .as_mut()
            .ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;

        if journey
            .stages
            .iter()
            .any(|stage| stage.id != stage_id && stage.title.eq_ignore_ascii_case(title))
        {
            return Err(format!("{title} gehört bereits zu deiner Reise."));
        }

        let stage = journey
            .stages
            .iter_mut()
            .find(|stage| stage.id == stage_id)
            .ok_or_else(|| format!("Der Ort '{stage_id}' gehört nicht zu deiner Route."))?;

        stage.title = title.to_string();
        stage.country = (!country.trim().is_empty()).then(|| country.trim().to_string());
    }

    let page = project
        .page_manifest
        .iter_mut()
        .find(|page| page.journey_stage.as_deref() == Some(stage_id.as_str()))
        .ok_or_else(|| format!("Für den Ort '{stage_id}' wurde keine Seite gefunden."))?;

    page.title = title.to_string();
    if let Some(entry) = page.authoring.get_mut("title") {
        entry.content = title.to_string();
    }
    if let Some(destination) = project.destinations.iter_mut().find(|destination| destination.id == format!("destination-{stage_id}")) {
        destination.name = title.to_string();
    }

    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn update_destination_profile(
    path: String,
    stage_id: String,
    name: String,
    subtitle: String,
    introduction: String,
    arrival: String,
    departure: String,
    timezone: String,
    reasons: Vec<String>,
    highlights: Vec<DestinationHighlight>,
    practical_info: Vec<DestinationPracticalInfo>,
    editorial_extensions: Vec<DestinationEditorialExtension>,
    layout_variant: String,
) -> Result<ProjectSession, String> {
    let name = name.trim();
    if name.is_empty() { return Err("Gib dem Ort zuerst einen Namen.".into()); }
    if !matches!(layout_variant.as_str(), "destination-hero-banner" | "destination-hero-left" | "destination-hero-right") {
        return Err("Unbekannte Destination-Layout-Variante.".into());
    }

    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;

    let destination_id = {
        let journey = project.journey.as_mut().ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;
        let stage = journey.stages.iter_mut().find(|stage| stage.id == stage_id)
            .ok_or_else(|| format!("Der Ort '{stage_id}' gehört nicht zu deiner Route."))?;
        stage.title = name.to_string();
        stage.destination_id.clone().ok_or_else(|| "Der Ort besitzt noch keine Destination-Referenz.".to_string())?
    };

    let destination = project.destinations.iter_mut().find(|destination| destination.id == destination_id)
        .ok_or_else(|| format!("Destination Profile '{destination_id}' wurde nicht gefunden."))?;
    destination.name = name.to_string();
    destination.subtitle = optional_text(subtitle);
    destination.introduction = optional_text(introduction.clone());
    let arrival = optional_text(arrival);
    let departure = optional_text(departure);
    let timezone = optional_text(timezone);
    destination.journey_context = if arrival.is_some() || departure.is_some() || timezone.is_some() {
        Some(DestinationJourneyContext { arrival, departure, timezone })
    } else { None };
    destination.reasons = reasons.into_iter().map(|value| value.trim().to_string()).filter(|value| !value.is_empty()).collect();
    destination.highlights = highlights.into_iter().filter_map(|mut highlight| {
        highlight.name = highlight.name.trim().to_string();
        highlight.description = highlight.description.trim().to_string();
        if highlight.name.is_empty() { None } else { Some(highlight) }
    }).collect();
    destination.practical_info = practical_info.into_iter().filter_map(|mut info| {
        info.title = info.title.trim().to_string();
        info.text = info.text.trim().to_string();
        if info.title.is_empty() && info.text.is_empty() { None } else { Some(info) }
    }).collect();
    destination.editorial_extensions = editorial_extensions.into_iter().filter_map(|mut extension| {
        extension.title = extension.title.trim().to_string();
        extension.text = extension.text.trim().to_string();
        if extension.title.is_empty() && extension.text.is_empty() { None } else { Some(extension) }
    }).collect();
    destination.editorial.layout_variant = layout_variant.clone();

    let page = project.page_manifest.iter_mut().find(|page| page.journey_stage.as_deref() == Some(stage_id.as_str()))
        .ok_or_else(|| format!("Für den Ort '{stage_id}' wurde keine Seite gefunden."))?;
    page.title = name.to_string();
    page.layout = layout_variant;
    if let Some(entry) = page.authoring.get_mut("title") { entry.content = name.to_string(); }
    if !introduction.trim().is_empty() {
        page.authoring.insert("introduction".into(), AuthoringEntry {
            component_id: "introduction".into(), content: introduction.trim().to_string(), status: "draft".into(), updated_at: None
        });
    }

    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}


fn validate_destination_image_role(role: &str) -> Result<(), String> {
    if matches!(role, "wide" | "portrait") {
        Ok(())
    } else {
        Err("Unbekannte Bildrolle für das Reiseziel.".into())
    }
}

fn normalized_image_extension(path: &Path) -> Result<&'static str, String> {
    match path.extension().and_then(|value| value.to_str()).map(|value| value.to_ascii_lowercase()) {
        Some(extension) if extension == "jpg" || extension == "jpeg" => Ok("jpg"),
        Some(extension) if extension == "png" => Ok("png"),
        _ => Err("Für Ortsbilder werden in Build 022 JPEG oder PNG unterstützt.".into()),
    }
}

fn destination_image_for_role(images: &DestinationImages, role: &str) -> Option<String> {
    match role {
        "wide" => images.wide.clone(),
        "portrait" => images.portrait.clone().or_else(|| images.left.clone()).or_else(|| images.right.clone()),
        _ => None,
    }
}

fn set_destination_image_for_role(images: &mut DestinationImages, role: &str, value: Option<String>) {
    match role {
        "wide" => images.wide = value,
        "portrait" => {
            images.portrait = value;
            images.left = None;
            images.right = None;
        },
        _ => {}
    }
}

#[tauri::command]
fn set_destination_image(path: String, stage_id: String, role: String, source_path: String) -> Result<ProjectSession, String> {
    validate_destination_image_role(&role)?;
    let project_path = Path::new(&path);
    let source = Path::new(&source_path);
    if !source.is_file() {
        return Err("Das ausgewählte Bild konnte nicht gelesen werden.".into());
    }
    let extension = normalized_image_extension(source)?;
    let mut project = read_project(project_path)?;
    let destination_id = project
        .journey
        .as_ref()
        .and_then(|journey| journey.stages.iter().find(|stage| stage.id == stage_id))
        .and_then(|stage| stage.destination_id.clone())
        .ok_or_else(|| "Der Ort besitzt noch keine Destination-Referenz.".to_string())?;

    let destination = project.destinations.iter_mut().find(|entry| entry.id == destination_id)
        .ok_or_else(|| format!("Ortsprofil '{destination_id}' wurde nicht gefunden."))?;

    let folder = project_path.join("assets/destinations").join(&destination_id);
    fs::create_dir_all(&folder).map_err(|error| format!("Der Bildordner konnte nicht angelegt werden: {error}"))?;
    let relative = format!("assets/destinations/{destination_id}/{role}.{extension}");
    let target = project_path.join(&relative);

    if let Some(previous) = destination_image_for_role(&destination.images, &role) {
        if previous != relative && previous.starts_with("assets/destinations/") {
            let previous_path = project_path.join(previous);
            if previous_path.exists() {
                let _ = fs::remove_file(previous_path);
            }
        }
    }

    fs::copy(source, &target).map_err(|error| format!("Das Bild konnte nicht in die Reise übernommen werden: {error}"))?;
    set_destination_image_for_role(&mut destination.images, &role, Some(relative));
    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn remove_destination_image(path: String, stage_id: String, role: String) -> Result<ProjectSession, String> {
    validate_destination_image_role(&role)?;
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let destination_id = project
        .journey
        .as_ref()
        .and_then(|journey| journey.stages.iter().find(|stage| stage.id == stage_id))
        .and_then(|stage| stage.destination_id.clone())
        .ok_or_else(|| "Der Ort besitzt noch keine Destination-Referenz.".to_string())?;
    let destination = project.destinations.iter_mut().find(|entry| entry.id == destination_id)
        .ok_or_else(|| format!("Ortsprofil '{destination_id}' wurde nicht gefunden."))?;

    if let Some(relative) = destination_image_for_role(&destination.images, &role) {
        if relative.starts_with("assets/destinations/") {
            let target = project_path.join(relative);
            if target.exists() {
                fs::remove_file(target).map_err(|error| format!("Das Bild konnte nicht entfernt werden: {error}"))?;
            }
        }
    }
    set_destination_image_for_role(&mut destination.images, &role, None);
    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn read_image_preview(path: String) -> Result<Vec<u8>, String> {
    let image_path = Path::new(&path);
    normalized_image_extension(image_path)?;
    let metadata = fs::metadata(image_path).map_err(|_| "Das Bild konnte für die Vorschau nicht gelesen werden.".to_string())?;
    if metadata.len() > 40 * 1024 * 1024 {
        return Err("Das ausgewählte Bild ist für die Studio-Vorschau zu groß.".into());
    }
    fs::read(image_path).map_err(|error| format!("Das Bild konnte für die Vorschau nicht gelesen werden: {error}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .manage(OpenRequestState::default())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            load_nls_project,
            create_nls_project,
            update_editorial_world,
            save_authoring_component,
            add_journey_place,
            update_journey_planning,
            move_journey_place,
            update_journey_place,
            update_destination_profile,
            set_destination_image,
            remove_destination_image,
            read_image_preview,
            take_pending_open_path
        ])
        .build(tauri::generate_context!())
        .expect("error while building Northern Lines Studio");

    app.run(|app_handle, event| {
        #[cfg(target_os = "macos")]
        {
            use tauri::{Emitter, Manager};

            if let tauri::RunEvent::Opened { urls } = event {
                if let Some(path) = urls
                    .iter()
                    .filter_map(|url| url.to_file_path().ok())
                    .find(|path| is_nls_path(path))
                {
                    let path = path.to_string_lossy().into_owned();
                    let state = app_handle.state::<OpenRequestState>();
                    remember_open_request(&state, path.clone());
                    let _ = app_handle.emit("open-nls", path);
                }
            }
        }

        #[cfg(not(target_os = "macos"))]
        {
            let _ = (app_handle, event);
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_project(version: &str) -> StudioProject {
        StudioProject {
            format: EXPECTED_FORMAT.into(),
            format_version: version.into(),
            project_id: "sample".into(),
            title: "Sample".into(),
            edition: Some("1.0".into()),
            language: "de".into(),
            editorial_world_id: if version == CURRENT_FORMAT_VERSION
                || version == BUILD_023_FORMAT_VERSION
                || version == BUILD_021_FORMAT_VERSION
                || version == BUILD_019_FORMAT_VERSION
                || version == BUILD_018_FORMAT_VERSION
                || version == BUILD_017_FORMAT_VERSION
                || version == BUILD_009_FORMAT_VERSION
                || version == BUILD_004_FORMAT_VERSION
            {
                Some(REFERENCE_WORLD_ID.into())
            } else {
                None
            },
            legacy_editorial_world: if version == CURRENT_FORMAT_VERSION
                || version == BUILD_023_FORMAT_VERSION
                || version == BUILD_021_FORMAT_VERSION
                || version == BUILD_019_FORMAT_VERSION
                || version == BUILD_018_FORMAT_VERSION
                || version == BUILD_017_FORMAT_VERSION
                || version == BUILD_009_FORMAT_VERSION
                || version == BUILD_004_FORMAT_VERSION
            {
                None
            } else {
                Some(EditorialWorld {
                    id: REFERENCE_WORLD_ID.into(),
                    name: "Fjord".into(),
                    reference: true,
                    companion: EditorialCompanion {
                        id: "puffin".into(),
                        name: "Papageientaucher".into(),
                    },
                })
            },
            journey: if version != LEGACY_FORMAT_VERSION {
                Some(Journey {
                    id: "sample-journey".into(),
                    title: "Sample Journey".into(),
                    journey_type: "cruise".into(),
                    start_date: None,
                    end_date: None,
                    departure_place: None,
                    return_place: None,
                    transport: None,
                    route_summary: None,
                    travel_focus: Vec::new(),
                    stages: vec![JourneyStage {
                        id: "bergen".into(),
                        kind: "destination".into(),
                        title: "Bergen".into(),
                        country: Some("Norway".into()),
                        destination_id: (version == CURRENT_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION).then(|| "destination-bergen".into()),
                    }],
                })
            } else {
                None
            },
            destinations: if version == CURRENT_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION {
                vec![Destination {
                    id: "destination-bergen".into(),
                    name: "Bergen".into(),
                    subtitle: None,
                    introduction: None,
                    journey_context: None,
                    reasons: Vec::new(),
                    highlights: Vec::new(),
                    practical_info: Vec::new(),
                    editorial_extensions: Vec::new(),
                    images: DestinationImages::default(),
                    editorial: default_destination_editorial(),
                }]
            } else { Vec::new() },
            document: DocumentSettings {
                page_format: "A5".into(),
                orientation: "portrait".into(),
            },
            page_manifest: vec![StudioPage {
                id: "page-bergen".into(),
                order: 10,
                page_type: "destination".into(),
                role: if version != LEGACY_FORMAT_VERSION { Some("destination".into()) } else { None },
                title: "Bergen".into(),
                content: "content/pages/010-bergen.md".into(),
                layout: if version == CURRENT_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION { "destination-hero-banner".into() } else { "destination-standard".into() },
                journey_stage: if version != LEGACY_FORMAT_VERSION { Some("bergen".into()) } else { None },
                knowledge_type: None,
                components: if version == CURRENT_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION { vec!["hero".into(), "title".into(), "introduction".into(), "history".into(), "photography".into(), "knowledge".into(), "souvenirs".into(), "qr".into()] } else { vec![] },
                authoring: BTreeMap::new(),
            }],
            project_path: String::new(),
            migrated_from_version: None,
        }
    }

    #[test]
    fn recognizes_nls_journey_packages() {
        assert!(is_nls_path(Path::new("/tmp/Norwegen.nls")));
        assert!(is_nls_path(Path::new("/tmp/Island.NLS")));
        assert!(!is_nls_path(Path::new("/tmp/project.json")));
    }

    #[test]
    fn accepts_valid_build_005_project() {
        assert!(validate_project(&sample_project(CURRENT_FORMAT_VERSION)).is_ok());
    }

    #[test]
    fn migrates_build_002_project_to_current_format() {
        let migrated = migrate_project(sample_project(LEGACY_FORMAT_VERSION)).unwrap();
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(LEGACY_FORMAT_VERSION));
        assert_eq!(migrated.page_manifest[0].role.as_deref(), Some("destination"));
        assert_eq!(migrated.page_manifest[0].journey_stage.as_deref(), Some("bergen"));
        assert!(migrated.journey.is_some());
        assert!(validate_project(&migrated).is_ok());
    }

    #[test]
    fn migrates_build_003_project_to_current_format() {
        let migrated = migrate_project(sample_project(BUILD_003_FORMAT_VERSION)).unwrap();
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_003_FORMAT_VERSION));
        assert_eq!(migrated.editorial_world_id.as_deref(), Some(REFERENCE_WORLD_ID));
        assert!(migrated.legacy_editorial_world.is_none());
        assert!(validate_project(&migrated).is_ok());
    }

    #[test]
    fn migrates_build_004_project_and_infers_editorial_components() {
        let migrated = migrate_project(sample_project(BUILD_004_FORMAT_VERSION)).unwrap();
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_004_FORMAT_VERSION));
        assert_eq!(migrated.editorial_world_id.as_deref(), Some(REFERENCE_WORLD_ID));
        assert!(migrated.page_manifest[0].components.contains(&"knowledge".to_string()));
        assert!(validate_project(&migrated).is_ok());
    }


    #[test]
    fn supports_baltic_world_and_persists_world_switch() {
        let root = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            root.path().to_string_lossy().into_owned(),
            "Ostsee Test".into(),
            BALTIC_WORLD_ID.into(),
            "de".into(),
        ).expect("create baltic");
        assert_eq!(created.project.editorial_world_id.as_deref(), Some(BALTIC_WORLD_ID));
        let switched = update_editorial_world(
            created.project.project_path.clone(),
            REFERENCE_WORLD_ID.into(),
        ).expect("switch world");
        assert_eq!(switched.project.editorial_world_id.as_deref(), Some(REFERENCE_WORLD_ID));
    }

    #[test]
    fn creates_a_new_fjord_journey() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Island im Winter".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        ).expect("new journey");
        assert_eq!(created.project.title, "Island im Winter");
        assert_eq!(created.project.editorial_world_id.as_deref(), Some(REFERENCE_WORLD_ID));
        assert_eq!(created.project.page_manifest.len(), 9);
        assert!(Path::new(&created.project_path).join("project.json").exists());
        assert!(validate_project(&created.project).is_ok());
    }

    #[test]
    fn stores_structured_journey_planning() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Planung Test".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        ).expect("new journey");

        let updated = update_journey_planning(
            created.project_path.clone(),
            "2026-07-26".into(),
            "2026-08-02".into(),
            "Kiel".into(),
            "Kiel".into(),
            "Schiff".into(),
            "Kiel → Bergen → Geiranger → Ålesund → Haugesund → Kiel".into(),
            vec!["Fotografie".into(), "Entdecken".into(), "Erinnerungen".into()],
        ).expect("planning");

        let journey = updated.project.journey.expect("journey");
        assert_eq!(journey.start_date.as_deref(), Some("2026-07-26"));
        assert_eq!(journey.end_date.as_deref(), Some("2026-08-02"));
        assert_eq!(journey.departure_place.as_deref(), Some("Kiel"));
        assert_eq!(journey.transport.as_deref(), Some("Schiff"));
        assert_eq!(journey.travel_focus.len(), 3);
    }

    #[test]
    fn reorders_and_updates_journey_places() {
        let temp = tempfile::tempdir().expect("tempdir");

        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Route Test".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        )
        .expect("new journey");

        let path = created.project_path.clone();

        add_journey_place(
            path.clone(),
            "Bergen".into(),
            "Norwegen".into(),
        )
        .expect("bergen");

        let with_alesund = add_journey_place(
            path.clone(),
            "Ålesund".into(),
            "Norwegen".into(),
        )
        .expect("alesund");

        let alesund_id = with_alesund
            .project
            .journey
            .as_ref()
            .expect("journey")
            .stages
            .iter()
            .find(|stage| stage.title == "Ålesund")
            .expect("Ålesund stage")
            .id
            .clone();

        let moved = move_journey_place(
            path.clone(),
            alesund_id.clone(),
            "earlier".into(),
        )
        .expect("move");

        let stages = &moved
            .project
            .journey
            .as_ref()
            .expect("journey")
            .stages;

        assert_eq!(stages[0].title, "Ålesund");
        assert_eq!(stages[1].title, "Bergen");

        let updated = update_journey_place(
            path,
            alesund_id.clone(),
            "Ålesund Stadt".into(),
            "Norwegen".into(),
        )
        .expect("update");

        let stages = &updated
            .project
            .journey
            .as_ref()
            .expect("journey")
            .stages;

        assert_eq!(stages[0].title, "Ålesund Stadt");
        assert_eq!(stages[0].country.as_deref(), Some("Norwegen"));

        assert_eq!(
            updated
                .project
                .page_manifest
                .iter()
                .find(|page| page.journey_stage.as_deref() == Some(alesund_id.as_str()))
                .expect("destination page")
                .title,
            "Ålesund Stadt"
        );

        assert!(validate_project(&updated.project).is_ok());
    }

    #[test]
    fn migrates_build_018_journey_to_planning_schema() {
        let migrated = migrate_project(sample_project(BUILD_018_FORMAT_VERSION)).expect("migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_018_FORMAT_VERSION));
        let journey = migrated.journey.expect("journey");
        assert!(journey.departure_place.is_none());
        assert!(journey.return_place.is_none());
        assert!(journey.travel_focus.is_empty());
    }

    #[test]
    fn migrates_build_023_to_editorial_extension_schema() {
        let migrated = migrate_project(sample_project(BUILD_023_FORMAT_VERSION)).expect("Build-023 migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_023_FORMAT_VERSION));
        let destination = migrated.destinations.iter().find(|destination| destination.id == "destination-bergen").expect("destination profile");
        assert!(destination.editorial_extensions.is_empty());
        validate_project(&migrated).expect("migrated Build-023 destination must validate");
    }

    #[test]
    fn migrates_build_021_to_destination_imagery_schema() {
        let migrated = migrate_project(sample_project(BUILD_021_FORMAT_VERSION)).expect("Build-021 migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_021_FORMAT_VERSION));
        let destination = migrated.destinations.iter().find(|destination| destination.id == "destination-bergen").expect("destination profile");
        assert!(destination.images.wide.is_none());
        assert!(destination.images.portrait.is_none());
        validate_project(&migrated).expect("migrated Build-021 destination must validate");
    }

    #[test]
    fn migrates_build_019_destinations_to_structured_profiles() {
        let mut build_019 = sample_project(BUILD_019_FORMAT_VERSION);
        build_019.page_manifest[0].authoring.insert("introduction".into(), AuthoringEntry {
            component_id: "introduction".into(),
            content: "Zwischen sieben Bergen und dem offenen Meer.".into(),
            status: "revised".into(),
            updated_at: None,
        });
        let migrated = migrate_project(build_019).expect("Build-019 migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_019_FORMAT_VERSION));
        let stage = &migrated.journey.as_ref().expect("journey").stages[0];
        assert_eq!(stage.destination_id.as_deref(), Some("destination-bergen"));
        let destination = migrated.destinations.iter().find(|destination| destination.id == "destination-bergen").expect("destination profile");
        assert_eq!(destination.name, "Bergen");
        assert_eq!(destination.introduction.as_deref(), Some("Zwischen sieben Bergen und dem offenen Meer."));
        assert!(destination.subtitle.is_none());
        assert!(destination.reasons.is_empty());
        assert_eq!(destination.editorial.layout_variant, "destination-hero-banner");
        validate_project(&migrated).expect("migrated destination must validate");
    }

    #[test]
    fn stores_destination_profile_without_changing_route_identity() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Destination Test".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        ).expect("new journey");
        let with_bergen = add_journey_place(created.project_path.clone(), "Bergen".into(), "Norwegen".into()).expect("bergen");
        let stage = with_bergen.project.journey.as_ref().expect("journey").stages[0].clone();
        let updated = update_destination_profile(
            created.project_path,
            stage.id.clone(),
            "Bergen".into(),
            "Tor zu den Fjorden".into(),
            "Eine Stadt zwischen Bergen und Meer.".into(),
            "08:00 Uhr".into(),
            "17:00 Uhr".into(),
            "MEZ / MESZ".into(),
            vec!["Bryggen im Morgenlicht".into(), "Blick vom Fløyen".into()],
            vec![DestinationHighlight { id: "highlight-bryggen".into(), name: "Bryggen".into(), description: "Historische Hansehäuser".into(), category: "architecture".into() }],
            vec![DestinationPracticalInfo { id: "practical-walk".into(), title: "Zu Fuß".into(), text: "Viele Highlights liegen dicht beieinander.".into() }],
            vec![DestinationEditorialExtension { id: "knowledge-hanse".into(), kind: "knowledge".into(), title: "Hanse".into(), text: "Bryggen erzählt von Bergens Hansegeschichte.".into() }],
            "destination-hero-right".into(),
        ).expect("destination update");
        let updated_stage = &updated.project.journey.as_ref().expect("journey").stages[0];
        assert_eq!(updated_stage.id, stage.id);
        assert_eq!(updated_stage.destination_id, stage.destination_id);
        let destination = updated.project.destinations.iter().find(|destination| destination.id == stage.destination_id.as_deref().unwrap()).expect("destination");
        assert_eq!(destination.subtitle.as_deref(), Some("Tor zu den Fjorden"));
        assert_eq!(destination.highlights.len(), 1);
        assert_eq!(destination.editorial_extensions.len(), 1);
        assert_eq!(destination.editorial_extensions[0].kind, "knowledge");
        assert_eq!(destination.editorial.layout_variant, "destination-hero-right");
        let page = updated.project.page_manifest.iter().find(|page| page.journey_stage.as_deref() == Some(stage.id.as_str())).expect("page");
        assert_eq!(page.layout, "destination-hero-right");
        validate_project(&updated.project).expect("updated destination must validate");
    }

    #[test]
    fn stores_destination_images_inside_the_nls_project_by_role() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Imagery Test".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        ).expect("new journey");
        let with_bergen = add_journey_place(created.project_path.clone(), "Bergen".into(), "Norwegen".into()).expect("bergen");
        let stage = with_bergen.project.journey.as_ref().expect("journey").stages[0].clone();
        let source = temp.path().join("bergen-wide.jpg");
        fs::write(&source, b"test-image-bytes").expect("image fixture");

        let updated = set_destination_image(
            created.project_path.clone(),
            stage.id.clone(),
            "wide".into(),
            source.to_string_lossy().into_owned(),
        ).expect("store image");
        let destination = updated.project.destinations.iter().find(|destination| destination.id == stage.destination_id.as_deref().unwrap()).expect("destination");
        let destination_id = destination.id.clone();
        let relative = destination.images.wide.as_deref().expect("wide image");
        assert_eq!(relative, format!("assets/destinations/{}/wide.jpg", destination.id));
        assert!(Path::new(&created.project_path).join(relative).exists());

        let removed = remove_destination_image(created.project_path.clone(), stage.id.clone(), "wide".into()).expect("remove image");
        let destination = removed.project.destinations.iter().find(|destination| destination.id == destination_id).expect("destination");
        assert!(destination.images.wide.is_none());

        let portrait_source = temp.path().join("bergen-portrait.png");
        fs::write(&portrait_source, b"portrait-image-bytes").expect("portrait fixture");
        let portrait_updated = set_destination_image(
            created.project_path.clone(),
            stage.id.clone(),
            "portrait".into(),
            portrait_source.to_string_lossy().into_owned(),
        ).expect("store portrait image");
        let destination = portrait_updated.project.destinations.iter().find(|destination| destination.id == destination_id).expect("destination");
        let relative = destination.images.portrait.as_deref().expect("portrait image");
        assert_eq!(relative, format!("assets/destinations/{}/portrait.png", destination.id));
        assert!(Path::new(&created.project_path).join(relative).exists());
        assert!(validate_destination_image_role("portrait").is_ok());
        assert!(validate_destination_image_role("left").is_err());
        assert!(validate_destination_image_role("right").is_err());
    }

    #[test]
    fn migrates_build_017_project_and_adds_journey_planning() {
        let mut legacy = sample_project(BUILD_017_FORMAT_VERSION);
        legacy.page_manifest.retain(|page| page.page_type != "planning");
        let migrated = migrate_project(legacy).expect("migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        let planning = migrated.page_manifest.iter()
            .find(|page| page.page_type == "planning")
            .expect("planning page");
        assert_eq!(planning.role.as_deref(), Some("journey_planning"));
        assert_eq!(planning.order, 4);
        assert_eq!(planning.components, vec!["title".to_string(), "introduction".to_string()]);
    }

    #[test]
    fn migrates_build_009_project_to_current_format() {
        let migrated = migrate_project(sample_project(BUILD_009_FORMAT_VERSION)).unwrap();
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_009_FORMAT_VERSION));
        validate_project(&migrated).expect("Build-009 migration must validate after normalization");
    }

    #[test]
    fn rejects_unsupported_format_version() {
        assert!(migrate_project(sample_project("9.0.0")).is_err());
    }

    #[test]
    fn rejects_duplicate_page_ids() {
        let mut project = sample_project(CURRENT_FORMAT_VERSION);
        project.page_manifest.push(project.page_manifest[0].clone());
        assert!(validate_project(&project).is_err());
    }

    #[test]
    fn rejects_unknown_journey_stage_reference() {
        let mut project = sample_project(CURRENT_FORMAT_VERSION);
        project.page_manifest[0].journey_stage = Some("unknown".into());
        assert!(validate_project(&project).is_err());
    }
}
