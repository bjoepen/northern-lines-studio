use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{collections::{BTreeMap, HashSet}, fs, path::{Path, PathBuf}, sync::{mpsc, Mutex}, time::{Duration, SystemTime, UNIX_EPOCH}};
use tauri::Emitter;

mod pdfa;

const EXPECTED_FORMAT: &str = "northern-lines-studio-project";
const CURRENT_FORMAT_VERSION: &str = "0.16.0";
const BUILD_031_FORMAT_VERSION: &str = "0.15.0";
const BUILD_030_FORMAT_VERSION: &str = "0.14.0";
const BUILD_028_FORMAT_VERSION: &str = "0.13.0";
const BUILD_027_FORMAT_VERSION: &str = "0.12.0";
const BUILD_026_FORMAT_VERSION: &str = "0.11.0";
const BUILD_025_FORMAT_VERSION: &str = "0.10.0";
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
const A5_WIDTH_PT: f64 = 148.0 / 25.4 * 72.0;
const A5_HEIGHT_PT: f64 = 210.0 / 25.4 * 72.0;
const PDF_BOX_TOLERANCE_PT: f64 = 0.01;

fn is_supported_editorial_world(id: &str) -> bool {
    id == REFERENCE_WORLD_ID || id == BALTIC_WORLD_ID
}

fn unix_timestamp_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis() as u64)
        .unwrap_or(0)
}

fn emit_background_proof_poc_001_native_trace(
    window: &tauri::WebviewWindow,
    step: &str,
    operation: &str,
    detail: impl Into<String>,
) {
    let payload = BackgroundProofPoc001NativeTrace {
        job_id: String::new(),
        step: step.into(),
        source: "rust".into(),
        component: "create_studio_pdf_proof".into(),
        operation: operation.into(),
        detail: detail.into(),
        timestamp_ms: unix_timestamp_ms(),
    };
    let _ = window.emit("background-proof-poc-001-native-trace", payload);
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioPdfProofRequest {
    page_id: String,
    physical_medium: String,
    output_path: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioPdfProofResult {
    output_path: String,
    width_pt: f64,
    height_pt: f64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct BackgroundProofPoc001NativeTrace {
    job_id: String,
    step: String,
    source: String,
    component: String,
    operation: String,
    detail: String,
    timestamp_ms: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct BackgroundProofPoc001OutputEvidence {
    exists: bool,
    byte_length: u64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioDocumentProofStagingRequest {
    page_count: usize,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioDocumentProofStagingResult {
    staging_path: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioDocumentProofPageRequest {
    index: usize,
    page_id: String,
    title: String,
    staged_path: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioDocumentProofRequest {
    output_path: String,
    staging_path: String,
    pages: Vec<StudioDocumentProofPageRequest>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioDocumentProofResult {
    output_path: String,
    page_count: usize,
    width_pt: f64,
    height_pt: f64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StudioPdfA2bExportRequest {
    source_path: String,
    output_path: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioPdfA2bExportResult {
    output_path: String,
    page_count: usize,
    profile: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
struct StudioDocumentProofManifest {
    schema: String,
    page_count: usize,
    pages: Vec<StudioDocumentProofManifestPage>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
struct StudioDocumentProofManifestPage {
    index: usize,
    page_id: String,
    title: String,
    sha256: String,
    width_pt: f64,
    height_pt: f64,
    validation_status: String,
    content_stream_count: usize,
    decoded_content_bytes: usize,
    decoded_content_hashes: Vec<String>,
    resource_count: usize,
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
struct DestinationInterestEntry {
    id: String,
    kind: String,
    title: String,
    #[serde(default)]
    fields: BTreeMap<String, String>,
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
    destination_interest_kind: Option<String>,
    #[serde(default)]
    knowledge_type: Option<String>,
    #[serde(default)]
    components: Vec<String>,
    #[serde(default)]
    authoring: BTreeMap<String, AuthoringEntry>,
    #[serde(default)]
    interest_entries: Vec<DestinationInterestEntry>,
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
        "destination" | "destination_interest" => "destination",
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
        "destination_interest" if page.destination_interest_kind.as_deref() == Some("photography") => &["title", "introduction", "photo_spots", "photo_light", "photo_motifs", "photo_guidance", "photo_focal_lengths", "photo_place_reference"],
        "destination_interest" if page.destination_interest_kind.as_deref() == Some("hiking_nature") => &["title", "introduction", "hike_routes", "hike_start_points", "hike_durations", "hike_difficulties", "hike_highlights", "hike_guidance", "hike_place_reference"],
        "destination_interest" => &["title", "introduction"],
        "knowledge" if page.knowledge_type.as_deref() == Some("photography_light") => &["title", "light_phases", "photography", "introduction"],
        "knowledge" if page.knowledge_type.as_deref() == Some("travel_weather") => &["title", "weather_guidance", "photography", "introduction"],
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
        destination_interest_kind: None,
        knowledge_type: None,
        components: Vec::new(),
        authoring: BTreeMap::new(), interest_entries: Vec::new(),
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


fn authoring_lines(page: &StudioPage, component_id: &str) -> Vec<String> {
    page.authoring
        .get(component_id)
        .map(|entry| entry.content.lines().map(str::trim).filter(|line| !line.is_empty()).map(str::to_string).collect())
        .unwrap_or_default()
}

fn split_interest_title(value: &str) -> (String, String) {
    if let Some((title, detail)) = value.split_once('—') {
        (title.trim().to_string(), detail.trim().to_string())
    } else {
        (value.trim().to_string(), String::new())
    }
}

fn migrate_interest_entries(page: &mut StudioPage) {
    if page.page_type != "destination_interest" || !page.interest_entries.is_empty() { return; }
    match page.destination_interest_kind.as_deref() {
        Some("photography") => {
            let spots = authoring_lines(page, "photo_spots");
            let focal = authoring_lines(page, "photo_focal_lengths");
            let light = authoring_lines(page, "photo_light");
            let motifs = authoring_lines(page, "photo_motifs");
            let guidance = authoring_lines(page, "photo_guidance");
            for (index, spot) in spots.iter().enumerate() {
                let (title, detail) = split_interest_title(spot);
                let mut fields = BTreeMap::new();
                if !detail.is_empty() { fields.insert("description".into(), detail); }
                if let Some(value) = focal.get(index) { fields.insert("focalLength".into(), value.clone()); }
                if light.len() == spots.len() { if let Some(value) = light.get(index) { fields.insert("light".into(), value.clone()); } }
                if motifs.len() == spots.len() { if let Some(value) = motifs.get(index) { fields.insert("motifs".into(), value.clone()); } }
                if guidance.len() == spots.len() { if let Some(value) = guidance.get(index) { fields.insert("guidance".into(), value.clone()); } }
                page.interest_entries.push(DestinationInterestEntry {
                    id: format!("{}-photo-{}", page.id, index + 1), kind: "photo_spot".into(), title, fields
                });
            }
        }
        Some("hiking_nature") => {
            let routes = authoring_lines(page, "hike_routes");
            let starts = authoring_lines(page, "hike_start_points");
            let durations = authoring_lines(page, "hike_durations");
            let difficulties = authoring_lines(page, "hike_difficulties");
            let highlights = authoring_lines(page, "hike_highlights");
            let guidance = authoring_lines(page, "hike_guidance");
            for (index, route) in routes.iter().enumerate() {
                let (title, detail) = split_interest_title(route);
                let mut fields = BTreeMap::new();
                if !detail.is_empty() { fields.insert("description".into(), detail); }
                if let Some(value) = starts.get(index) { fields.insert("startPoint".into(), value.clone()); }
                if let Some(value) = durations.get(index) { fields.insert("duration".into(), value.clone()); }
                if let Some(value) = difficulties.get(index) { fields.insert("difficulty".into(), value.clone()); }
                if let Some(value) = highlights.get(index) { fields.insert("highlights".into(), value.clone()); }
                if let Some(value) = guidance.get(index) { fields.insert("guidance".into(), value.clone()); }
                page.interest_entries.push(DestinationInterestEntry {
                    id: format!("{}-hike-{}", page.id, index + 1), kind: "hiking_route".into(), title, fields
                });
            }
        }
        _ => {}
    }
}

fn ensure_interest_entries(project: &mut StudioProject) {
    for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "destination_interest") {
        migrate_interest_entries(page);
    }
}


fn ensure_light_companion_components(project: &mut StudioProject) {
    for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "knowledge" && page.knowledge_type.as_deref() == Some("photography_light")) {
        page.components = infer_components(page);
    }
}

fn ensure_weather_companion_components(project: &mut StudioProject) {
    for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "knowledge" && page.knowledge_type.as_deref() == Some("travel_weather")) {
        page.components = infer_components(page);
    }
}

fn migrate_project(mut project: StudioProject) -> Result<StudioProject, String> {
    match project.format_version.as_str() {
        CURRENT_FORMAT_VERSION => { ensure_interest_entries(&mut project); }
        BUILD_031_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_031_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_interest_entries(&mut project);
            ensure_light_companion_components(&mut project);
            ensure_weather_companion_components(&mut project);
        }
        BUILD_030_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_030_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_interest_entries(&mut project);
        }
        BUILD_028_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_028_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_interest_entries(&mut project);
        }
        BUILD_027_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_027_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "destination_interest" && page.destination_interest_kind.as_deref() == Some("hiking_nature")) {
                page.components = infer_components(page);
            }
        }
        BUILD_026_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_026_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            for page in project.page_manifest.iter_mut().filter(|page| page.page_type == "destination_interest" && matches!(page.destination_interest_kind.as_deref(), Some("photography") | Some("hiking_nature"))) {
                page.components = infer_components(page);
            }
        }
        BUILD_025_FORMAT_VERSION => {
            project.migrated_from_version = Some(BUILD_025_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();
            ensure_components(&mut project);
            ensure_journey_planning_page(&mut project);
            ensure_destination_profiles(&mut project);
        }
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
    ensure_interest_entries(&mut project);
    ensure_light_companion_components(&mut project);
    ensure_weather_companion_components(&mut project);
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
    let mut interest_keys = HashSet::new();
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
        if page.page_type == "destination_interest" {
            let kind = page.destination_interest_kind.as_deref().ok_or_else(|| format!("Vertiefungsseite '{}' besitzt kein Interesse.", page.title))?;
            if !matches!(kind, "photography" | "hiking_nature" | "culture_history" | "culinary_local") {
                return Err(format!("Vertiefungsseite '{}' besitzt ein unbekanntes Interesse '{}'.", page.title, kind));
            }
            let stage = page.journey_stage.as_deref().ok_or_else(|| format!("Vertiefungsseite '{}' gehört zu keinem Reiseziel.", page.title))?;
            if !interest_keys.insert(format!("{stage}:{kind}")) {
                return Err(format!("{} ist für dieses Reiseziel bereits als Vertiefung vorhanden.", page.title));
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
        destination_interest_kind: None,
        knowledge_type: knowledge_type.map(str::to_string), components: Vec::new(), authoring: BTreeMap::new(), interest_entries: Vec::new(),
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
        starter_page("page-contents", 3, "contents", "front_matter", "Orientierung", "content/pages/003-contents.md", "contents", None),
        starter_page("page-planning", 4, "planning", "journey_planning", "Reiseplanung", "content/pages/004-planning.md", "planning", None),
        starter_page("page-light", 10, "knowledge", "journey_knowledge", "Licht", "content/pages/010-light.md", "light", Some("photography_light")),
        starter_page("page-weather", 11, "knowledge", "journey_knowledge", "Wetter", "content/pages/011-weather.md", "weather", Some("travel_weather")),
        starter_page("page-workflow", 20, "workflow", "workflow", "Fotografie-Workshop", "content/pages/020-workflow.md", "workflow", None),
        starter_page("page-notes", 30, "notes", "notes", "Erinnerungen", "content/pages/030-notes.md", "notes", None),
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
fn save_interest_entries(
    path: String,
    page_id: String,
    entries: Vec<DestinationInterestEntry>,
) -> Result<ProjectSession, String> {
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let page = project.page_manifest.iter_mut().find(|page| page.id == page_id && page.page_type == "destination_interest")
        .ok_or_else(|| "Diese Vertiefungsseite wurde nicht gefunden.".to_string())?;
    let expected_kind = match page.destination_interest_kind.as_deref() {
        Some("photography") => "photo_spot",
        Some("hiking_nature") => "hiking_route",
        Some("culture_history") => "culture_place",
        Some("culinary_local") => "culinary_recommendation",
        _ => return Err("Unbekannter Interest-Page-Archetyp.".into()),
    };
    if entries.iter().any(|entry| entry.kind != expected_kind || entry.title.trim().is_empty()) {
        return Err("Ein Interest-Eintrag braucht einen Titel und muss zum Seitentyp passen.".into());
    }
    page.interest_entries = entries;
    project.migrated_from_version = None;
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
    let order = project.page_manifest.iter().map(|page| page.order).max().unwrap_or(4) + 1;
    let content = format!("content/pages/{:03}-{}.md", order, base);
    let mut page = StudioPage {
        id: format!("page-{base}"), order, page_type: "destination".into(), role: Some("destination".into()),
        title: title.into(), content: content.clone(), layout: default_destination_layout(), journey_stage: Some(base),
        destination_interest_kind: None,
        knowledge_type: None, components: Vec::new(), authoring: BTreeMap::new(), interest_entries: Vec::new(),
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



fn destination_interest_label(kind: &str) -> Option<&'static str> {
    match kind {
        "photography" => Some("Fotografie"),
        "hiking_nature" => Some("Wandern & Natur"),
        "culture_history" => Some("Kultur & Geschichte"),
        "culinary_local" => Some("Kulinarik & Lokal"),
        _ => None,
    }
}

#[tauri::command]
fn add_destination_interest(path: String, stage_id: String, kind: String) -> Result<ProjectSession, String> {
    let label = destination_interest_label(&kind).ok_or_else(|| "Dieses Interesse ist noch nicht Teil von Northern Lines Studio.".to_string())?;
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let journey = project.journey.as_ref().ok_or_else(|| "Diese Reise besitzt noch keine Reisestruktur.".to_string())?;
    let stage_title = journey.stages.iter().find(|stage| stage.id == stage_id && stage.kind == "destination")
        .map(|stage| stage.title.clone())
        .ok_or_else(|| "Dieses Reiseziel wurde nicht gefunden.".to_string())?;
    if project.page_manifest.iter().any(|page| page.page_type == "destination_interest" && page.journey_stage.as_deref() == Some(stage_id.as_str()) && page.destination_interest_kind.as_deref() == Some(kind.as_str())) {
        return Err(format!("{} gehört bereits zu {}.", label, stage_title));
    }

    let interest_slug = kind.replace('_', "-");
    let id = format!("page-{}-{}", stage_id, interest_slug);
    let order = project.page_manifest.iter().map(|page| page.order).max().unwrap_or(0) + 1;
    let content = format!("content/pages/{:03}-{}-{}.md", order, stage_id, interest_slug);
    let mut page = StudioPage {
        id: id.clone(), order, page_type: "destination_interest".into(), role: Some("destination".into()),
        title: label.into(), content: content.clone(), layout: "destination-interest".into(), journey_stage: Some(stage_id.clone()),
        destination_interest_kind: Some(kind), knowledge_type: None, components: Vec::new(), authoring: BTreeMap::new(), interest_entries: Vec::new(),
    };
    page.components = infer_components(&page);
    fs::write(project_path.join(&content), format!("# {} in {}\n", label, stage_title))
        .map_err(|e| format!("Die Vertiefungsseite konnte nicht angelegt werden: {e}"))?;
    project.page_manifest.push(page);
    project.page_manifest.sort_by_key(|page| page.order);
    project.migrated_from_version = None;
    validate_project(&project)?;
    write_project(project_path, &project)?;
    let project = read_project(project_path)?;
    Ok(project_session(project, project_path))
}

#[tauri::command]
fn remove_destination_interest(path: String, page_id: String) -> Result<ProjectSession, String> {
    let project_path = Path::new(&path);
    let mut project = read_project(project_path)?;
    let index = project.page_manifest.iter().position(|page| page.id == page_id && page.page_type == "destination_interest")
        .ok_or_else(|| "Diese Vertiefungsseite wurde nicht gefunden.".to_string())?;
    let page = project.page_manifest.remove(index);
    let content_path = project_path.join(&page.content);
    if content_path.exists() {
        fs::remove_file(&content_path).map_err(|e| format!("Die Vertiefungsseite konnte nicht entfernt werden: {e}"))?;
    }
    project.migrated_from_version = None;
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
        .find(|page| page.page_type == "destination" && page.journey_stage.as_deref() == Some(stage_id.as_str()))
        .ok_or_else(|| format!("Für den Ort '{stage_id}' wurde keine Ortsseite gefunden."))?;

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

    let page = project.page_manifest.iter_mut().find(|page| page.page_type == "destination" && page.journey_stage.as_deref() == Some(stage_id.as_str()))
        .ok_or_else(|| format!("Für den Ort '{stage_id}' wurde keine Ortsseite gefunden."))?;
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

#[tauri::command]
async fn create_studio_pdf_proof(
    window: tauri::WebviewWindow,
    request: StudioPdfProofRequest,
) -> Result<StudioPdfProofResult, String> {
    emit_background_proof_poc_001_native_trace(
        &window,
        "RUST_COMMAND_ENTER",
        "create_studio_pdf_proof",
        format!("pageId={} outputPath={}", request.page_id, request.output_path),
    );
    if request.page_id.trim().is_empty() {
        return Err("PDF_PROOF_NO_PAGE: Es ist keine Studio-Seite ausgewählt.".into());
    }
    if request.physical_medium != "A5" {
        return Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF-Proof unterstützt aktuell nur A5.".into());
    }
    if request.output_path.trim().is_empty() {
        return Err("PDF_PROOF_WRITE_FAILED: Es wurde kein Speicherort gewählt.".into());
    }

    let output_path = Path::new(&request.output_path);
    if output_path.extension().and_then(|extension| extension.to_str()) != Some("pdf") {
        return Err("PDF_PROOF_WRITE_FAILED: Der PDF-Proof muss als .pdf gespeichert werden.".into());
    }
    if let Some(parent) = output_path.parent() {
        if !parent.exists() {
            return Err("PDF_PROOF_WRITE_FAILED: Der Zielordner existiert nicht.".into());
        }
    }

    prepare_pdf_proof_output(output_path)?;
    emit_background_proof_poc_001_native_trace(
        &window,
        "NATIVE_WEBVIEW_RENDER_START",
        "render_active_webview_a5_pdf",
        output_path.to_string_lossy(),
    );
    let render_result = render_active_webview_a5_pdf(&window, output_path).await;
    if render_result.is_ok() {
        emit_background_proof_poc_001_native_trace(
            &window,
            "NATIVE_WEBVIEW_RENDER_COMPLETE",
            "render_active_webview_a5_pdf",
            output_path.to_string_lossy(),
        );
    }
    complete_studio_pdf_proof(
        render_result,
        output_path,
        |path| {
            emit_background_proof_poc_001_native_trace(
                &window,
                "PAGEBOX_NORMALIZE_START",
                "normalize_pdf_a5_page_boxes",
                path.to_string_lossy(),
            );
            normalize_pdf_a5_page_boxes(path)?;
            emit_background_proof_poc_001_native_trace(
                &window,
                "PAGEBOX_NORMALIZE_COMPLETE",
                "normalize_pdf_a5_page_boxes",
                path.to_string_lossy(),
            );
            emit_background_proof_poc_001_native_trace(
                &window,
                "PDF_VALIDATE_START",
                "validate_pdf_a5_page_boxes",
                path.to_string_lossy(),
            );
            let validation = validate_pdf_a5_page_boxes(path);
            if validation.is_ok() {
                emit_background_proof_poc_001_native_trace(
                    &window,
                    "PDF_VALIDATE_COMPLETE",
                    "validate_pdf_a5_page_boxes",
                    path.to_string_lossy(),
                );
            }
            validation
        },
    )?;
    emit_background_proof_poc_001_native_trace(
        &window,
        "RUST_COMMAND_SUCCESS",
        "create_studio_pdf_proof",
        output_path.to_string_lossy(),
    );

    Ok(StudioPdfProofResult {
        output_path: request.output_path,
        width_pt: A5_WIDTH_PT,
        height_pt: A5_HEIGHT_PT,
    })
}

#[tauri::command]
fn background_proof_poc_output_file_evidence(path: String) -> Result<BackgroundProofPoc001OutputEvidence, String> {
    let output_path = Path::new(&path);
    let metadata = match fs::metadata(output_path) {
        Ok(metadata) => metadata,
        Err(_) => {
            return Ok(BackgroundProofPoc001OutputEvidence {
                exists: false,
                byte_length: 0,
            });
        }
    };
    Ok(BackgroundProofPoc001OutputEvidence {
        exists: metadata.is_file(),
        byte_length: metadata.len(),
    })
}

#[tauri::command]
fn prepare_studio_document_pdf_proof(
    request: StudioDocumentProofStagingRequest,
) -> Result<StudioDocumentProofStagingResult, String> {
    if request.page_count == 0 {
        return Err("PDF_DOCUMENT_PROOF_NO_PAGES: Dieses Travelbook hat noch keine Seiten.".into());
    }
    let base = studio_document_proof_cache_dir()?;
    fs::create_dir_all(&base)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher konnte nicht angelegt werden: {error}"))?;
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher konnte nicht benannt werden: {error}"))?
        .as_nanos();
    let staging = base.join(format!("document-proof-{}-{}", std::process::id(), stamp));
    fs::create_dir(&staging)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher konnte nicht angelegt werden: {error}"))?;
    Ok(StudioDocumentProofStagingResult {
        staging_path: staging.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn cleanup_studio_document_pdf_proof(staging_path: String) -> Result<(), String> {
    let staging = Path::new(&staging_path);
    let base = studio_document_proof_cache_dir()?;
    if !staging.starts_with(&base)
        || !staging
            .file_name()
            .and_then(|name| name.to_str())
            .is_some_and(|name| name.starts_with("document-proof-"))
    {
        return Err("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher wird nicht entfernt.".into());
    }
    if staging.exists() {
        fs::remove_dir_all(staging)
            .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher konnte nicht entfernt werden: {error}"))?;
    }
    Ok(())
}

#[tauri::command]
fn assemble_studio_document_pdf_proof(
    request: StudioDocumentProofRequest,
) -> Result<StudioDocumentProofResult, String> {
    if request.pages.is_empty() {
        return Err("PDF_DOCUMENT_PROOF_NO_PAGES: Dieses Travelbook hat noch keine Seiten.".into());
    }
    if request.output_path.trim().is_empty() {
        return Err("PDF_DOCUMENT_PROOF_WRITE_FAILED: Es wurde kein Speicherort gewählt.".into());
    }
    let output_path = Path::new(&request.output_path);
    if output_path.extension().and_then(|extension| extension.to_str()) != Some("pdf") {
        return Err("PDF_DOCUMENT_PROOF_WRITE_FAILED: Der Travelbook-Proof muss als .pdf gespeichert werden.".into());
    }
    if let Some(parent) = output_path.parent() {
        if !parent.exists() {
            return Err("PDF_DOCUMENT_PROOF_WRITE_FAILED: Der Zielordner existiert nicht.".into());
        }
    }
    let staging = Path::new(&request.staging_path);
    if !staging.exists() {
        return Err("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Zwischenspeicher fehlt.".into());
    }
    validate_document_proof_page_requests(staging, &request.pages)?;

    let temp_output = document_proof_temp_output_path(output_path);
    prepare_pdf_proof_output(&temp_output).map_err(|error| {
        error.replace("PDF_PROOF_WRITE_FAILED", "PDF_DOCUMENT_PROOF_WRITE_FAILED")
    })?;

    let manifest_path = staging.join("manifest.json");
    match assemble_validated_document_pdf(&request.pages, &temp_output, &manifest_path) {
        Ok(manifest) => {
            validate_document_pdf_output(&temp_output, &manifest)?;
            fs::rename(&temp_output, output_path)
                .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Travelbook-Proof konnte nicht gespeichert werden: {error}"))?;
            Ok(StudioDocumentProofResult {
                output_path: request.output_path,
                page_count: manifest.page_count,
                width_pt: A5_WIDTH_PT,
                height_pt: A5_HEIGHT_PT,
            })
        }
        Err(error) => {
            let _ = fs::remove_file(&temp_output);
            Err(error)
        }
    }
}

#[tauri::command]
fn export_studio_pdfa2b(
    request: StudioPdfA2bExportRequest,
) -> Result<StudioPdfA2bExportResult, String> {
    if request.source_path.trim().is_empty() {
        return Err("PDF_A_EXPORT_FAILED: Standard-PDF für die Archivfassung fehlt.".into());
    }
    if request.output_path.trim().is_empty() {
        return Err("PDF_A_WRITE_FAILED: Es wurde kein Speicherort gewählt.".into());
    }
    let source_path = Path::new(&request.source_path);
    let output_path = Path::new(&request.output_path);
    if source_path == output_path {
        return Err("PDF_A_WRITE_FAILED: Standard-PDF und PDF/A-Ziel müssen getrennte Dateien sein.".into());
    }
    if let Some(parent) = output_path.parent() {
        if !parent.exists() {
            return Err("PDF_A_WRITE_FAILED: Der Zielordner existiert nicht.".into());
        }
    }

    let temp_output = pdfa_temp_output_path(output_path);
    if temp_output.exists() {
        fs::remove_file(&temp_output)
            .map_err(|error| format!("PDF_A_WRITE_FAILED: Vorherige PDF/A-Zwischendatei konnte nicht ersetzt werden: {error}"))?;
    }

    match pdfa::convert_to_pdfa2b(source_path, &temp_output) {
        Ok(result) => {
            fs::rename(&temp_output, output_path)
                .map_err(|error| format!("PDF_A_WRITE_FAILED: PDF/A-Travelbook konnte nicht gespeichert werden: {error}"))?;
            Ok(StudioPdfA2bExportResult {
                output_path: request.output_path,
                page_count: result.page_count,
                profile: result.profile.into(),
            })
        }
        Err(error) => {
            let _ = fs::remove_file(&temp_output);
            Err(error)
        }
    }
}

async fn render_active_webview_a5_pdf(
    window: &tauri::WebviewWindow,
    output_path: &Path,
) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        return platform_pdf::render_active_webview_a5_pdf(window, output_path).await;
    }

    #[cfg(windows)]
    {
        return platform_pdf::render_active_webview_a5_pdf(window, output_path);
    }

    #[allow(unreachable_code)]
    Err("PDF_PROOF_RENDER_FAILED: Diese Plattform hat noch keinen PDF-Proof-Adapter.".into())
}

fn prepare_pdf_proof_output(path: &Path) -> Result<(), String> {
    if path.exists() {
        fs::remove_file(path).map_err(|error| {
            format!(
                "PDF_PROOF_WRITE_FAILED: Vorhandener PDF-Proof konnte nicht ersetzt werden: {error}"
            )
        })?;
    }
    Ok(())
}

fn complete_studio_pdf_proof<F>(
    render_result: Result<(), String>,
    output_path: &Path,
    validate_written_pdf: F,
) -> Result<(), String>
where
    F: Fn(&Path) -> Result<(), String>,
{
    render_result?;
    validate_written_pdf(output_path)
}

fn resolve_pdf_proof_completion<F>(
    wait_result: Result<Result<(), String>, mpsc::RecvTimeoutError>,
    output_path: &Path,
    validate_written_pdf: F,
) -> Result<(), String>
where
    F: Fn(&Path) -> Result<(), String>,
{
    match wait_result {
        Ok(render_result) => render_result,
        Err(mpsc::RecvTimeoutError::Timeout) => {
            if output_path.exists() {
                validate_written_pdf(output_path)?;
                return Ok(());
            }
            Err("PDF_PROOF_RENDER_FAILED: PDF-Proof-Erzeugung hat zu lange gedauert.".to_string())
        }
        Err(mpsc::RecvTimeoutError::Disconnected) => {
            if output_path.exists() {
                validate_written_pdf(output_path)?;
                return Ok(());
            }
            Err("PDF_PROOF_RENDER_FAILED: WebKit-PDF-Rückmeldung wurde unterbrochen.".to_string())
        }
    }
}

#[derive(Clone, Copy, Debug)]
struct PdfPageBox {
    x_min: f64,
    y_min: f64,
    x_max: f64,
    y_max: f64,
}

impl PdfPageBox {
    fn width(self) -> f64 {
        (self.x_max - self.x_min).abs()
    }

    fn height(self) -> f64 {
        (self.y_max - self.y_min).abs()
    }
}

fn exact_a5_pdf_box_preserving_top_left(source: PdfPageBox) -> lopdf::Object {
    lopdf::Object::Array(vec![
        lopdf::Object::Real(source.x_min as f32),
        lopdf::Object::Real((source.y_max - A5_HEIGHT_PT) as f32),
        lopdf::Object::Real((source.x_min + A5_WIDTH_PT) as f32),
        lopdf::Object::Real(source.y_max as f32),
    ])
}

fn pdf_page_box(object: &lopdf::Object) -> Result<PdfPageBox, String> {
    let values = object
        .as_array()
        .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seitenbox ist nicht lesbar.".to_string())?;
    if values.len() < 4 {
        return Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seitenbox ist unvollständig.".into());
    }
    let number = |value: &lopdf::Object| -> Result<f64, String> {
        match value {
            lopdf::Object::Integer(value) => Ok(*value as f64),
            lopdf::Object::Real(value) => Ok(*value as f64),
            _ => Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seitenbox enthält keinen numerischen Wert.".into()),
        }
    };
    let x0 = number(&values[0])?;
    let y0 = number(&values[1])?;
    let x1 = number(&values[2])?;
    let y1 = number(&values[3])?;
    Ok(PdfPageBox {
        x_min: x0.min(x1),
        y_min: y0.min(y1),
        x_max: x0.max(x1),
        y_max: y0.max(y1),
    })
}

fn assert_a5_pdf_box(object: &lopdf::Object, box_name: &str) -> Result<(), String> {
    let page_box = pdf_page_box(object)?;
    if (page_box.width() - A5_WIDTH_PT).abs() > PDF_BOX_TOLERANCE_PT
        || (page_box.height() - A5_HEIGHT_PT).abs() > PDF_BOX_TOLERANCE_PT
    {
        return Err(format!(
            "PDF_PROOF_PAGE_SIZE_INVALID: PDF-{} ist {:.3} × {:.3} pt statt A5 {:.3} × {:.3} pt.",
            box_name,
            page_box.width(),
            page_box.height(),
            A5_WIDTH_PT,
            A5_HEIGHT_PT
        ));
    }
    Ok(())
}

fn normalize_pdf_a5_page_boxes(path: &Path) -> Result<(), String> {
    let mut document = lopdf::Document::load(path)
        .map_err(|error| format!("PDF_PROOF_PAGE_SIZE_INVALID: PDF konnte nicht gelesen werden: {error}"))?;
    let pages = document.get_pages();
    if pages.is_empty() {
        return Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF enthält keine Seite.".into());
    }
    for page_id in pages.values() {
        let page = document
            .get_object_mut(*page_id)
            .map_err(|error| format!("PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seite konnte nicht gelesen werden: {error}"))?
            .as_dict_mut()
            .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seite ist nicht lesbar.".to_string())?;
        let media_box = page
            .get(b"MediaBox")
            .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF enthält keine MediaBox.".to_string())
            .and_then(pdf_page_box)?;
        let crop_box = page.get(b"CropBox").ok().map(pdf_page_box).transpose()?;
        let trim_box = page.get(b"TrimBox").ok().map(pdf_page_box).transpose()?;
        page.set("MediaBox", exact_a5_pdf_box_preserving_top_left(media_box));
        page.set("CropBox", exact_a5_pdf_box_preserving_top_left(crop_box.unwrap_or(media_box)));
        if page.has(b"TrimBox") {
            if let Some(trim_box) = trim_box {
                page.set("TrimBox", exact_a5_pdf_box_preserving_top_left(trim_box));
            }
        }
    }
    document
        .save(path)
        .map_err(|error| format!("PDF_PROOF_WRITE_FAILED: PDF-Seitenboxen konnten nicht geschrieben werden: {error}"))?;
    Ok(())
}

fn validate_pdf_a5_page_boxes(path: &Path) -> Result<(), String> {
    let document = lopdf::Document::load(path)
        .map_err(|error| format!("PDF_PROOF_WRITE_FAILED: PDF konnte nicht gelesen werden: {error}"))?;
    let pages = document.get_pages();
    if pages.is_empty() {
        return Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF enthält keine Seite.".into());
    }
    for page_id in pages.values() {
        let page = document
            .get_object(*page_id)
            .map_err(|error| format!("PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seite konnte nicht gelesen werden: {error}"))?
            .as_dict()
            .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF-Seite ist nicht lesbar.".to_string())?;
        let media_box = page
            .get(b"MediaBox")
            .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF enthält keine MediaBox.".to_string())?;
        assert_a5_pdf_box(media_box, "MediaBox")?;
        let crop_box = page
            .get(b"CropBox")
            .map_err(|_| "PDF_PROOF_PAGE_SIZE_INVALID: PDF enthält keine CropBox.".to_string())?;
        assert_a5_pdf_box(crop_box, "CropBox")?;
        if let Ok(trim_box) = page.get(b"TrimBox") {
            assert_a5_pdf_box(trim_box, "TrimBox")?;
        }
    }
    Ok(())
}

fn studio_document_proof_cache_dir() -> Result<PathBuf, String> {
    let home = std::env::var_os("HOME")
        .ok_or_else(|| "PDF_DOCUMENT_PROOF_WRITE_FAILED: Benutzer-Cache konnte nicht bestimmt werden.".to_string())?;
    Ok(PathBuf::from(home)
        .join("Library")
        .join("Caches")
        .join("Northern Lines Studio"))
}

fn document_proof_temp_output_path(output_path: &Path) -> PathBuf {
    let mut temp = output_path.as_os_str().to_os_string();
    temp.push(".tmp");
    PathBuf::from(temp)
}

fn pdfa_temp_output_path(output_path: &Path) -> PathBuf {
    let mut temp = output_path.to_path_buf();
    let mut file_name = output_path
        .file_stem()
        .unwrap_or_else(|| output_path.as_os_str())
        .to_os_string();
    file_name.push(".pdfa2b.tmp.pdf");
    temp.set_file_name(file_name);
    temp
}

fn validate_document_proof_page_requests(
    staging: &Path,
    pages: &[StudioDocumentProofPageRequest],
) -> Result<(), String> {
    let mut seen = HashSet::new();
    for (position, page) in pages.iter().enumerate() {
        if page.index != position + 1 {
            return Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Travelbook-Seitenfolge ist nicht fortlaufend.".into());
        }
        if page.page_id.trim().is_empty() {
            return Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Eine Travelbook-Seite hat keine stabile ID.".into());
        }
        if !seen.insert(page.page_id.clone()) {
            return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Travelbook-Seite '{}' ist doppelt enthalten.", page.page_id));
        }
        let staged_path = Path::new(&page.staged_path);
        if !staged_path.starts_with(staging) {
            return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seite '{}' liegt nicht im Proof-Zwischenspeicher.", page.page_id));
        }
        if staged_path.file_name().and_then(|name| name.to_str()) != Some(&format!("{:04}.pdf", page.index)) {
            return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seite '{}' hat keinen deterministischen Proof-Dateinamen.", page.page_id));
        }
    }
    Ok(())
}

fn sha256_hex(bytes: &[u8]) -> String {
    let digest = Sha256::digest(bytes);
    digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn file_sha256_hex(path: &Path) -> Result<String, String> {
    let bytes = fs::read(path)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Seite konnte nicht gelesen werden: {error}"))?;
    Ok(sha256_hex(&bytes))
}

fn collect_page_content_streams(
    document: &lopdf::Document,
    object: &lopdf::Object,
    streams: &mut Vec<Vec<u8>>,
) -> Result<(), String> {
    match object {
        lopdf::Object::Reference(id) => {
            let object = document
                .get_object(*id)
                .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seiteninhalt konnte nicht gelesen werden: {error}"))?;
            collect_page_content_streams(document, object, streams)
        }
        lopdf::Object::Array(items) => {
            for item in items {
                collect_page_content_streams(document, item, streams)?;
            }
            Ok(())
        }
        lopdf::Object::Stream(stream) => {
            let content = stream
                .decompressed_content()
                .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seiteninhalt konnte nicht dekodiert werden: {error}"))?;
            streams.push(content);
            Ok(())
        }
        _ => Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seiteninhalt ist nicht lesbar.".into()),
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct PdfPageContentEvidence {
    stream_count: usize,
    decoded_content_bytes: usize,
    decoded_content_hashes: Vec<String>,
    resource_count: usize,
}

fn page_resource_count(
    document: &lopdf::Document,
    page_id: lopdf::ObjectId,
) -> Result<usize, String> {
    let page = document
        .get_object(page_id)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite konnte nicht gelesen werden: {error}"))?
        .as_dict()
        .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite ist nicht lesbar.".to_string())?;
    match page.get(b"Resources") {
        Ok(lopdf::Object::Dictionary(resources)) => Ok(resources.len()),
        Ok(lopdf::Object::Reference(id)) => document
            .get_object(*id)
            .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seitenressourcen konnten nicht gelesen werden: {error}"))?
            .as_dict()
            .map(|resources| resources.len())
            .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seitenressourcen sind nicht lesbar.".to_string()),
        Ok(_) => Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seitenressourcen sind nicht lesbar.".into()),
        Err(_) => Ok(0),
    }
}

fn page_content_evidence(
    document: &lopdf::Document,
    page_id: lopdf::ObjectId,
) -> Result<PdfPageContentEvidence, String> {
    let page = document
        .get_object(page_id)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite konnte nicht gelesen werden: {error}"))?
        .as_dict()
        .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite ist nicht lesbar.".to_string())?;
    let contents = page
        .get(b"Contents")
        .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite enthält keinen Inhalt.".to_string())?;
    let mut streams = Vec::new();
    collect_page_content_streams(document, contents, &mut streams)?;
    Ok(PdfPageContentEvidence {
        stream_count: streams.len(),
        decoded_content_bytes: streams.iter().map(Vec::len).sum(),
        decoded_content_hashes: streams.iter().map(|stream| sha256_hex(stream)).collect(),
        resource_count: page_resource_count(document, page_id)?,
    })
}

#[cfg(test)]
fn page_content_stream_hashes(
    document: &lopdf::Document,
    page_id: lopdf::ObjectId,
) -> Result<Vec<String>, String> {
    Ok(page_content_evidence(document, page_id)?.decoded_content_hashes)
}

fn validate_page_not_empty_capture(
    document: &lopdf::Document,
    page_id: lopdf::ObjectId,
    page_title: &str,
) -> Result<PdfPageContentEvidence, String> {
    let evidence = page_content_evidence(document, page_id)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_EMPTY_CAPTURE: {page_title} · {error}"))?;
    if evidence.stream_count == 0 || evidence.decoded_content_bytes == 0 {
        return Err(format!(
            "PDF_DOCUMENT_PROOF_EMPTY_CAPTURE: {page_title} · Einzelproof enthält keine dekodierten Seiteninhalte."
        ));
    }
    Ok(evidence)
}

fn first_page_dimensions(document: &lopdf::Document, page_id: lopdf::ObjectId) -> Result<(f64, f64), String> {
    let page = document
        .get_object(page_id)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite konnte nicht gelesen werden: {error}"))?
        .as_dict()
        .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite ist nicht lesbar.".to_string())?;
    let media_box = page
        .get(b"MediaBox")
        .map_err(|_| "PDF_DOCUMENT_PROOF_VALIDATION_FAILED: PDF-Seite enthält keine MediaBox.".to_string())
        .and_then(pdf_page_box)?;
    Ok((media_box.width(), media_box.height()))
}

fn assemble_validated_document_pdf(
    pages: &[StudioDocumentProofPageRequest],
    output_path: &Path,
    manifest_path: &Path,
) -> Result<StudioDocumentProofManifest, String> {
    let mut document = lopdf::Document::with_version("1.7");
    let pages_root_id = document.new_object_id();
    let catalog_id = document.new_object_id();
    let mut kids = Vec::new();
    let mut manifest_pages = Vec::new();

    for page in pages {
        let staged_path = Path::new(&page.staged_path);
        validate_pdf_a5_page_boxes(staged_path)
            .map_err(|error| format!("PDF_DOCUMENT_PROOF_PAGE_FAILED: {} · {error}", page.title))?;
        let source_sha256 = file_sha256_hex(staged_path)?;
        let mut source = lopdf::Document::load(staged_path)
            .map_err(|error| format!("PDF_DOCUMENT_PROOF_PAGE_FAILED: {} · PDF konnte nicht gelesen werden: {error}", page.title))?;
        let source_pages = source.get_pages();
        if source_pages.len() != 1 {
            return Err(format!("PDF_DOCUMENT_PROOF_PAGE_FAILED: {} · Einzelproof enthält {} Seiten.", page.title, source_pages.len()));
        }
        let source_page_id = *source_pages.values().next().expect("single page exists");
        let content_evidence = validate_page_not_empty_capture(&source, source_page_id, &page.title)?;
        let (width_pt, height_pt) = first_page_dimensions(&source, source_page_id)?;

        source.renumber_objects_with(document.max_id + 1);
        let page_id = *source
            .get_pages()
            .values()
            .next()
            .ok_or_else(|| format!("PDF_DOCUMENT_PROOF_PAGE_FAILED: {} · Einzelproof enthält keine Seite.", page.title))?;
        for (object_id, object) in source.objects {
            document.max_id = document.max_id.max(object_id.0);
            document.objects.insert(object_id, object);
        }
        let page_object = document
            .get_object_mut(page_id)
            .map_err(|error| format!("PDF_DOCUMENT_PROOF_ASSEMBLY_FAILED: Seite '{}' konnte nicht übernommen werden: {error}", page.page_id))?
            .as_dict_mut()
            .map_err(|_| format!("PDF_DOCUMENT_PROOF_ASSEMBLY_FAILED: Seite '{}' ist kein PDF-Page-Object.", page.page_id))?;
        page_object.set("Parent", pages_root_id);
        kids.push(lopdf::Object::Reference(page_id));
        manifest_pages.push(StudioDocumentProofManifestPage {
            index: page.index,
            page_id: page.page_id.clone(),
            title: page.title.clone(),
            sha256: source_sha256,
            width_pt,
            height_pt,
            validation_status: "validated".into(),
            content_stream_count: content_evidence.stream_count,
            decoded_content_bytes: content_evidence.decoded_content_bytes,
            decoded_content_hashes: content_evidence.decoded_content_hashes,
            resource_count: content_evidence.resource_count,
        });
    }

    document.objects.insert(
        pages_root_id,
        lopdf::Object::Dictionary(lopdf::dictionary! {
            "Type" => "Pages",
            "Kids" => kids,
            "Count" => pages.len() as i64
        }),
    );
    document.objects.insert(
        catalog_id,
        lopdf::Object::Dictionary(lopdf::dictionary! {
            "Type" => "Catalog",
            "Pages" => pages_root_id
        }),
    );
    document.trailer.set("Root", catalog_id);

    let manifest = StudioDocumentProofManifest {
        schema: "northern-lines.studio.document-proof.v1".into(),
        page_count: pages.len(),
        pages: manifest_pages,
    };
    let manifest_json = serde_json::to_string_pretty(&manifest)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_ASSEMBLY_FAILED: Proof-Manifest konnte nicht erzeugt werden: {error}"))?;
    fs::write(manifest_path, manifest_json)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Proof-Manifest konnte nicht geschrieben werden: {error}"))?;
    document
        .save(output_path)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_WRITE_FAILED: Travelbook-Proof konnte nicht geschrieben werden: {error}"))?;
    Ok(manifest)
}

fn validate_document_pdf_output(
    output_path: &Path,
    manifest: &StudioDocumentProofManifest,
) -> Result<(), String> {
    if !output_path.exists() {
        return Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Travelbook-Proof wurde nicht geschrieben.".into());
    }
    validate_pdf_a5_page_boxes(output_path)
        .map_err(|error| error.replace("PDF_PROOF_PAGE_SIZE_INVALID", "PDF_DOCUMENT_PROOF_VALIDATION_FAILED"))?;
    let document = lopdf::Document::load(output_path)
        .map_err(|error| format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Travelbook-Proof konnte nicht gelesen werden: {error}"))?;
    let pages = document.get_pages();
    if pages.len() != manifest.page_count {
        return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Travelbook-Proof enthält {} statt {} Seiten.", pages.len(), manifest.page_count));
    }
    if manifest.pages.len() != manifest.page_count {
        return Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Proof-Manifest passt nicht zur Seitenzahl.".into());
    }
    let mut seen = HashSet::new();
    for (position, (page_id, manifest_page)) in pages.values().zip(manifest.pages.iter()).enumerate() {
        if manifest_page.index != position + 1 {
            return Err("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Proof-Manifest ist nicht fortlaufend.".into());
        }
        if !seen.insert(manifest_page.page_id.clone()) {
            return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seite '{}' ist doppelt im Proof.", manifest_page.page_id));
        }
        let evidence = page_content_evidence(&document, *page_id)?;
        if evidence.stream_count != manifest_page.content_stream_count
            || evidence.decoded_content_bytes != manifest_page.decoded_content_bytes
            || evidence.decoded_content_hashes != manifest_page.decoded_content_hashes
            || evidence.resource_count != manifest_page.resource_count
        {
            return Err(format!("PDF_DOCUMENT_PROOF_VALIDATION_FAILED: Seiteninhalt '{}' stimmt nach Assembly nicht überein.", manifest_page.page_id));
        }
    }
    Ok(())
}

#[cfg(target_os = "macos")]
mod platform_pdf {
    use super::*;
    use block2::RcBlock;
    use objc2::MainThreadMarker;
    use objc2_core_foundation::{CGRect, CGPoint, CGSize};
    use objc2_foundation::{NSData, NSError, NSString};
    use objc2_web_kit::{WKPDFConfiguration, WKWebView};

    pub async fn render_active_webview_a5_pdf(
        window: &tauri::WebviewWindow,
        output_path: &Path,
    ) -> Result<(), String> {
        let (sender, receiver) = mpsc::channel::<Result<(), String>>();
        let path = output_path.to_string_lossy().into_owned();

        window
            .with_webview(move |webview| {
                let result = unsafe {
                    let Some(mtm) = MainThreadMarker::new() else {
                        let _ = sender.send(Err("PDF_PROOF_RENDER_FAILED: WebKit-PDF muss auf dem Main Thread laufen.".to_string()));
                        return;
                    };
                    let wk_webview = &*(webview.inner() as *mut WKWebView);
                    let configuration = WKPDFConfiguration::new(mtm);
                    configuration.setRect(CGRect::new(
                        CGPoint::ZERO,
                        CGSize::new(A5_WIDTH_PT, A5_HEIGHT_PT),
                    ));
                    configuration.setAllowTransparentBackground(false);
                    let ns_path = NSString::from_str(&path);
                    let sender = sender.clone();
                    let completion = RcBlock::new(move |data: *mut NSData, error: *mut NSError| {
                        let result = if !error.is_null() {
                            Err("PDF_PROOF_RENDER_FAILED: WebKit konnte den PDF-Proof nicht erzeugen.".to_string())
                        } else if data.is_null() {
                            Err("PDF_PROOF_RENDER_FAILED: WebKit lieferte keine PDF-Daten.".to_string())
                        } else if (&*data).writeToFile_atomically(&ns_path, true) {
                            Ok(())
                        } else {
                            Err("PDF_PROOF_WRITE_FAILED: PDF-Proof konnte nicht geschrieben werden.".to_string())
                        };
                        let _ = sender.send(result);
                    });
                    wk_webview.createPDFWithConfiguration_completionHandler(
                        Some(&configuration),
                        &completion,
                    );
                    Ok::<(), String>(())
                };
                if let Err(error) = result {
                    let _ = sender.send(Err(error));
                }
            })
            .map_err(|error| format!("PDF_PROOF_RENDER_FAILED: WebView-Zugriff fehlgeschlagen: {error}"))?;

        let wait_result = tauri::async_runtime::spawn_blocking(move || {
            receiver.recv_timeout(Duration::from_secs(20))
        })
        .await
        .map_err(|error| format!("PDF_PROOF_RENDER_FAILED: PDF-Proof-Watchdog fehlgeschlagen: {error}"))?;

        resolve_pdf_proof_completion(wait_result, output_path, |path| {
            normalize_pdf_a5_page_boxes(path)?;
            validate_pdf_a5_page_boxes(path)
        })
    }
}

#[cfg(windows)]
mod platform_pdf {
    use super::*;

    pub fn render_active_webview_a5_pdf(
        _window: &tauri::WebviewWindow,
        _output_path: &Path,
    ) -> Result<(), String> {
        Err("PDF_PROOF_RENDER_FAILED: Windows-WebView2-Adapter ist im PoC vertraglich vorgesehen, aber auf diesem macOS-Build nicht ausführbar.".into())
    }
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
            save_interest_entries,
            add_journey_place,
            add_destination_interest,
            remove_destination_interest,
            update_journey_planning,
            move_journey_place,
            update_journey_place,
            update_destination_profile,
            set_destination_image,
            remove_destination_image,
            read_image_preview,
            create_studio_pdf_proof,
            background_proof_poc_output_file_evidence,
            prepare_studio_document_pdf_proof,
            assemble_studio_document_pdf_proof,
            export_studio_pdfa2b,
            cleanup_studio_document_pdf_proof,
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
                || version == BUILD_031_FORMAT_VERSION
                || version == BUILD_030_FORMAT_VERSION
                || version == BUILD_026_FORMAT_VERSION
                || version == BUILD_025_FORMAT_VERSION
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
                || version == BUILD_031_FORMAT_VERSION
                || version == BUILD_030_FORMAT_VERSION
                || version == BUILD_026_FORMAT_VERSION
                || version == BUILD_025_FORMAT_VERSION
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
                        destination_id: (version == CURRENT_FORMAT_VERSION || version == BUILD_031_FORMAT_VERSION || version == BUILD_030_FORMAT_VERSION || version == BUILD_026_FORMAT_VERSION || version == BUILD_025_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION).then(|| "destination-bergen".into()),
                    }],
                })
            } else {
                None
            },
            destinations: if version == CURRENT_FORMAT_VERSION || version == BUILD_026_FORMAT_VERSION || version == BUILD_025_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION {
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
                layout: if version == CURRENT_FORMAT_VERSION || version == BUILD_026_FORMAT_VERSION || version == BUILD_025_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION { "destination-hero-banner".into() } else { "destination-standard".into() },
                journey_stage: if version != LEGACY_FORMAT_VERSION { Some("bergen".into()) } else { None },
                destination_interest_kind: None,
                knowledge_type: None,
                components: if version == CURRENT_FORMAT_VERSION || version == BUILD_026_FORMAT_VERSION || version == BUILD_025_FORMAT_VERSION || version == BUILD_023_FORMAT_VERSION || version == BUILD_021_FORMAT_VERSION { vec!["hero".into(), "title".into(), "introduction".into(), "history".into(), "photography".into(), "knowledge".into(), "souvenirs".into(), "qr".into()] } else { vec![] },
                authoring: BTreeMap::new(),
                interest_entries: Vec::new(),
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
    fn migrates_build_025_without_inventing_interest_pages() {
        let migrated = migrate_project(sample_project(BUILD_025_FORMAT_VERSION)).expect("migrate build 025");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_025_FORMAT_VERSION));
        assert!(!migrated.page_manifest.iter().any(|page| page.page_type == "destination_interest"));
        validate_project(&migrated).expect("migrated Build 025 must validate");
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
    fn adds_multiple_destination_interests_and_removes_one() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(
            temp.path().to_string_lossy().into_owned(),
            "Interest Test".into(),
            REFERENCE_WORLD_ID.into(),
            "de".into(),
        ).expect("new journey");
        let with_bergen = add_journey_place(created.project_path.clone(), "Bergen".into(), "Norwegen".into()).expect("bergen");
        let stage_id = with_bergen.project.journey.as_ref().expect("journey").stages[0].id.clone();

        let photography = add_destination_interest(created.project_path.clone(), stage_id.clone(), "photography".into()).expect("photography interest");
        assert!(photography.project.page_manifest.iter().any(|page| page.page_type == "destination_interest" && page.destination_interest_kind.as_deref() == Some("photography")));

        let culture = add_destination_interest(created.project_path.clone(), stage_id.clone(), "culture_history".into()).expect("culture interest");
        let interest_pages: Vec<_> = culture.project.page_manifest.iter().filter(|page| page.page_type == "destination_interest" && page.journey_stage.as_deref() == Some(stage_id.as_str())).collect();
        assert_eq!(interest_pages.len(), 2);

        let photography_page = interest_pages.iter().find(|page| page.destination_interest_kind.as_deref() == Some("photography")).expect("photography page");
        let removed = remove_destination_interest(created.project_path.clone(), photography_page.id.clone()).expect("remove interest");
        assert!(!removed.project.page_manifest.iter().any(|page| page.destination_interest_kind.as_deref() == Some("photography")));
        assert!(removed.project.page_manifest.iter().any(|page| page.destination_interest_kind.as_deref() == Some("culture_history")));
    }

    #[test]
    fn migrates_build_028_line_authoring_to_structured_interest_entries() {
        let mut build_028 = sample_project(BUILD_028_FORMAT_VERSION);
        let mut authoring = BTreeMap::new();
        for (component_id, content) in [
            ("hike_routes", "Fosseråsa – Storsæterfossen\nSkagehola – Skageflå – Homlong"),
            ("hike_start_points", "Geiranger Zentrum\nSkagehola, per Boot"),
            ("hike_durations", "ca. 4 h\nca. 3–4 h"),
            ("hike_difficulties", "Mittel\nAnspruchsvoll"),
            ("hike_highlights", "Storsæterfossen\nSkageflå und Sieben Schwestern"),
            ("hike_guidance", "Bei Nässe vorsichtig.\nSehr steil; Trittsicherheit erforderlich."),
        ] {
            authoring.insert(component_id.into(), AuthoringEntry {
                component_id: component_id.into(), content: content.into(), status: "revised".into(), updated_at: None,
            });
        }
        build_028.page_manifest.push(StudioPage {
            id: "page-bergen-hiking-nature".into(), order: 11, page_type: "destination_interest".into(), role: Some("destination".into()),
            title: "Wandern & Natur".into(), content: "content/pages/011-bergen-hiking-nature.md".into(), layout: "destination-interest".into(),
            journey_stage: Some("bergen".into()), destination_interest_kind: Some("hiking_nature".into()), knowledge_type: None,
            components: vec!["title".into(), "introduction".into(), "hike_routes".into(), "hike_start_points".into(), "hike_durations".into(), "hike_difficulties".into(), "hike_highlights".into(), "hike_guidance".into(), "hike_place_reference".into()],
            authoring, interest_entries: Vec::new(),
        });

        let migrated = migrate_project(build_028).expect("Build-028 structured Interest migration");
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(BUILD_028_FORMAT_VERSION));
        let page = migrated.page_manifest.iter().find(|page| page.destination_interest_kind.as_deref() == Some("hiking_nature")).expect("hiking page");
        assert_eq!(page.interest_entries.len(), 2);
        assert_eq!(page.interest_entries[0].title, "Fosseråsa – Storsæterfossen");
        assert_eq!(page.interest_entries[0].fields.get("startPoint").map(String::as_str), Some("Geiranger Zentrum"));
        assert_eq!(page.interest_entries[1].fields.get("guidance").map(String::as_str), Some("Sehr steil; Trittsicherheit erforderlich."));
        assert!(page.authoring.contains_key("hike_routes"), "legacy content remains for lossless compatibility");
    }

    #[test]
    fn saves_structured_interest_entries_as_semantic_units() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(temp.path().to_string_lossy().into_owned(), "Structured Interest".into(), REFERENCE_WORLD_ID.into(), "de".into()).expect("new journey");
        let with_geiranger = add_journey_place(created.project_path.clone(), "Geiranger".into(), "Norwegen".into()).expect("geiranger");
        let stage_id = with_geiranger.project.journey.as_ref().expect("journey").stages[0].id.clone();
        let with_hiking = add_destination_interest(created.project_path.clone(), stage_id, "hiking_nature".into()).expect("hiking interest");
        let page_id = with_hiking.project.page_manifest.iter().find(|page| page.destination_interest_kind.as_deref() == Some("hiking_nature")).expect("hiking page").id.clone();
        let mut fields = BTreeMap::new();
        fields.insert("startPoint".into(), "Geiranger Zentrum".into());
        fields.insert("duration".into(), "ca. 4 h".into());
        fields.insert("difficulty".into(), "Mittel".into());
        fields.insert("guidance".into(), "Bei Nässe vorsichtig.".into());
        let saved = save_interest_entries(created.project_path, page_id, vec![DestinationInterestEntry {
            id: "route-fosserasa".into(), kind: "hiking_route".into(), title: "Fosseråsa – Storsæterfossen".into(), fields,
        }]).expect("save Interest entry");
        let page = saved.project.page_manifest.iter().find(|page| page.destination_interest_kind.as_deref() == Some("hiking_nature")).expect("hiking page");
        assert_eq!(page.interest_entries.len(), 1);
        assert_eq!(page.interest_entries[0].fields.get("difficulty").map(String::as_str), Some("Mittel"));
    }

    #[test]
    fn rejects_duplicate_interest_kind_for_same_destination() {
        let temp = tempfile::tempdir().expect("tempdir");
        let created = create_nls_project(temp.path().to_string_lossy().into_owned(), "Duplicate Interest".into(), REFERENCE_WORLD_ID.into(), "de".into()).expect("new journey");
        let with_bergen = add_journey_place(created.project_path.clone(), "Bergen".into(), "Norwegen".into()).expect("bergen");
        let stage_id = with_bergen.project.journey.as_ref().expect("journey").stages[0].id.clone();
        add_destination_interest(created.project_path.clone(), stage_id.clone(), "photography".into()).expect("first photography");
        let duplicate = add_destination_interest(created.project_path.clone(), stage_id, "photography".into());
        assert!(duplicate.is_err());
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

    #[test]
    fn pdf_proof_success_validates_without_timeout_error() {
        let result =
            complete_studio_pdf_proof(Ok(()), Path::new("/tmp/studio-proof-success.pdf"), |_| {
                Ok(())
            });

        assert!(result.is_ok());
    }

    #[test]
    fn pdf_proof_timeout_is_success_when_written_pdf_validates() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("proof.pdf");
        fs::write(&output, b"%PDF written by delayed native callback").expect("proof");

        let result =
            resolve_pdf_proof_completion(Err(mpsc::RecvTimeoutError::Timeout), &output, |_| Ok(()));

        assert!(result.is_ok());
    }

    #[test]
    fn pdf_proof_genuine_hang_reports_timeout() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("missing.pdf");

        let result =
            resolve_pdf_proof_completion(Err(mpsc::RecvTimeoutError::Timeout), &output, |_| Ok(()));

        assert_eq!(
            result.expect_err("missing file must timeout"),
            "PDF_PROOF_RENDER_FAILED: PDF-Proof-Erzeugung hat zu lange gedauert."
        );
    }

    #[test]
    fn pdf_proof_render_failure_is_reported() {
        let result = resolve_pdf_proof_completion(
            Ok(Err(
                "PDF_PROOF_RENDER_FAILED: WebKit konnte den PDF-Proof nicht erzeugen.".into(),
            )),
            Path::new("/tmp/studio-proof-render-failed.pdf"),
            |_| Ok(()),
        );

        assert_eq!(
            result.expect_err("render failure"),
            "PDF_PROOF_RENDER_FAILED: WebKit konnte den PDF-Proof nicht erzeugen."
        );
    }

    #[test]
    fn pdf_proof_write_failure_is_reported() {
        let result = complete_studio_pdf_proof(
            Err("PDF_PROOF_WRITE_FAILED: PDF-Proof konnte nicht geschrieben werden.".into()),
            Path::new("/tmp/studio-proof-write-failed.pdf"),
            |_| Ok(()),
        );

        assert_eq!(
            result.expect_err("write failure"),
            "PDF_PROOF_WRITE_FAILED: PDF-Proof konnte nicht geschrieben werden."
        );
    }

    #[test]
    fn pdf_proof_invalid_page_size_is_reported_after_render_success() {
        let result = complete_studio_pdf_proof(
            Ok(()),
            Path::new("/tmp/studio-proof-invalid-page-size.pdf"),
            |_| Err("PDF_PROOF_PAGE_SIZE_INVALID: PDF ist 595.000 × 842.000 pt statt A5.".into()),
        );

        assert_eq!(
            result.expect_err("page size failure"),
            "PDF_PROOF_PAGE_SIZE_INVALID: PDF ist 595.000 × 842.000 pt statt A5."
        );
    }

    fn write_test_pdf_with_content(
        path: &Path,
        media_box: lopdf::Object,
        crop_box: Option<lopdf::Object>,
        trim_box: Option<lopdf::Object>,
        content_streams: Vec<Vec<u8>>,
    ) {
        let mut document = lopdf::Document::with_version("1.7");
        let pages_id = document.new_object_id();
        let page_id = document.new_object_id();
        let content_ids: Vec<_> = content_streams
            .into_iter()
            .map(|content| document.add_object(lopdf::Stream::new(lopdf::Dictionary::new(), content)))
            .collect();
        let resources_id = document.add_object(lopdf::Dictionary::new());
        let mut page = lopdf::Dictionary::new();
        page.set("Type", "Page");
        page.set("Parent", pages_id);
        page.set("MediaBox", media_box);
        if let Some(crop_box) = crop_box {
            page.set("CropBox", crop_box);
        }
        if let Some(trim_box) = trim_box {
            page.set("TrimBox", trim_box);
        }
        if content_ids.len() == 1 {
            page.set("Contents", content_ids[0]);
        } else {
            page.set(
                "Contents",
                content_ids
                    .into_iter()
                    .map(lopdf::Object::Reference)
                    .collect::<Vec<_>>(),
            );
        }
        page.set("Resources", resources_id);
        document.objects.insert(page_id, lopdf::Object::Dictionary(page));
        document.objects.insert(
            pages_id,
            lopdf::Object::Dictionary(lopdf::dictionary! {
                "Type" => "Pages",
                "Kids" => vec![lopdf::Object::Reference(page_id)],
                "Count" => 1
            }),
        );
        let catalog_id = document.add_object(lopdf::dictionary! {
            "Type" => "Catalog",
            "Pages" => pages_id
        });
        document.trailer.set("Root", catalog_id);
        document.save(path).expect("save test pdf");
    }

    fn write_test_pdf(path: &Path, media_box: lopdf::Object, crop_box: Option<lopdf::Object>) {
        write_test_pdf_with_content(path, media_box, crop_box, None, vec![Vec::new()]);
    }

    fn write_pdfa_convertible_test_pdf(path: &Path) {
        let mut document = lopdf::Document::with_version("1.7");
        let pages_id = document.new_object_id();
        let page_id = document.new_object_id();
        let content_id = document.add_object(lopdf::Stream::new(
            lopdf::Dictionary::new(),
            b"q 1 0 0 1 10 20 cm Q".to_vec(),
        ));
        let profile_id = document.add_object(lopdf::Stream::new(
            lopdf::dictionary! {
                "N" => 3,
                "Alternate" => "DeviceRGB"
            },
            b"sRGB IEC61966-2.1 profile".to_vec(),
        ));
        let resources_id = document.add_object(lopdf::Dictionary::new());
        let a5_box = lopdf::Object::Array(vec![
            lopdf::Object::Real(0.0),
            lopdf::Object::Real(0.0),
            lopdf::Object::Real(A5_WIDTH_PT as f32),
            lopdf::Object::Real(A5_HEIGHT_PT as f32),
        ]);
        document.objects.insert(
            page_id,
            lopdf::Object::Dictionary(lopdf::dictionary! {
                "Type" => "Page",
                "Parent" => lopdf::Object::Reference(pages_id),
                "MediaBox" => a5_box.clone(),
                "CropBox" => a5_box,
                "Resources" => lopdf::Object::Reference(resources_id),
                "Contents" => content_id
            }),
        );
        document.objects.insert(
            pages_id,
            lopdf::Object::Dictionary(lopdf::dictionary! {
                "Type" => "Pages",
                "Kids" => vec![lopdf::Object::Reference(page_id)],
                "Count" => 1
            }),
        );
        let catalog_id = document.add_object(lopdf::dictionary! {
            "Type" => "Catalog",
            "Pages" => lopdf::Object::Reference(pages_id)
        });
        document.trailer.set("Root", catalog_id);
        assert!(document.objects.contains_key(&profile_id));
        document
            .save(path)
            .expect("save PDF/A-convertible test pdf");
    }

    fn pdf_box(width: i64, height: i64) -> lopdf::Object {
        lopdf::Object::Array(vec![
            lopdf::Object::Integer(0),
            lopdf::Object::Integer(0),
            lopdf::Object::Integer(width),
            lopdf::Object::Integer(height),
        ])
    }

    fn pdf_box_from_coords(x_min: f64, y_min: f64, x_max: f64, y_max: f64) -> lopdf::Object {
        lopdf::Object::Array(vec![
            lopdf::Object::Real(x_min as f32),
            lopdf::Object::Real(y_min as f32),
            lopdf::Object::Real(x_max as f32),
            lopdf::Object::Real(y_max as f32),
        ])
    }

    fn first_page_box(path: &Path, box_name: &[u8]) -> PdfPageBox {
        let document = lopdf::Document::load(path).expect("load pdf");
        let page_id = *document.get_pages().values().next().expect("first page");
        let page = document
            .get_object(page_id)
            .expect("page")
            .as_dict()
            .expect("page dict");
        pdf_page_box(page.get(box_name).expect("page box")).expect("box coordinates")
    }

    fn assert_close(left: f64, right: f64) {
        assert!(
            (left - right).abs() <= PDF_BOX_TOLERANCE_PT,
            "{left} != {right}"
        );
    }

    fn content_stream_hash(bytes: &[u8]) -> u64 {
        bytes
            .iter()
            .fold(0xcbf29ce484222325_u64, |hash, byte| {
                (hash ^ (*byte as u64)).wrapping_mul(0x100000001b3)
            })
    }

    fn collect_content_streams(
        document: &lopdf::Document,
        object: &lopdf::Object,
        streams: &mut Vec<Vec<u8>>,
    ) {
        match object {
            lopdf::Object::Reference(id) => {
                collect_content_streams(document, document.get_object(*id).expect("content ref"), streams);
            }
            lopdf::Object::Array(items) => {
                for item in items {
                    collect_content_streams(document, item, streams);
                }
            }
            lopdf::Object::Stream(stream) => {
                streams.push(stream.decompressed_content().expect("decoded content"));
            }
            _ => panic!("unexpected page content object"),
        }
    }

    fn page_content_streams(path: &Path) -> Vec<Vec<u8>> {
        let document = lopdf::Document::load(path).expect("load pdf");
        let page_id = *document.get_pages().values().next().expect("first page");
        let page = document
            .get_object(page_id)
            .expect("page")
            .as_dict()
            .expect("page dict");
        let mut streams = Vec::new();
        collect_content_streams(
            &document,
            page.get(b"Contents").expect("page contents"),
            &mut streams,
        );
        streams
    }

    fn content_stream_evidence(streams: &[Vec<u8>]) -> Vec<(usize, u64)> {
        streams
            .iter()
            .map(|stream| (stream.len(), content_stream_hash(stream)))
            .collect()
    }

    fn write_valid_staged_pdf(staging: &Path, index: usize, content: &[u8]) -> PathBuf {
        let path = staging.join(format!("{index:04}.pdf"));
        write_test_pdf_with_content(
            &path,
            pdf_box(419, 595),
            Some(pdf_box(419, 595)),
            None,
            vec![content.to_vec()],
        );
        normalize_pdf_a5_page_boxes(&path).expect("normalize staged proof");
        validate_pdf_a5_page_boxes(&path).expect("valid staged proof");
        path
    }

    fn document_page_request(
        staging: &Path,
        index: usize,
        page_id: &str,
    ) -> StudioDocumentProofPageRequest {
        StudioDocumentProofPageRequest {
            index,
            page_id: page_id.into(),
            title: page_id.into(),
            staged_path: staging.join(format!("{index:04}.pdf")).to_string_lossy().into_owned(),
        }
    }

    fn document_proof_request(
        output_path: &Path,
        staging: &Path,
        page_ids: &[&str],
    ) -> StudioDocumentProofRequest {
        StudioDocumentProofRequest {
            output_path: output_path.to_string_lossy().into_owned(),
            staging_path: staging.to_string_lossy().into_owned(),
            pages: page_ids
                .iter()
                .enumerate()
                .map(|(position, page_id)| document_page_request(staging, position + 1, page_id))
                .collect(),
        }
    }

    #[test]
    fn pdf_proof_normalizes_webkit_integer_page_boxes_to_exact_a5_metadata() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("webkit-integer.pdf");
        write_test_pdf(&output, pdf_box(419, 595), None);

        normalize_pdf_a5_page_boxes(&output).expect("normalize");
        validate_pdf_a5_page_boxes(&output).expect("exact A5 boxes");
    }

    #[test]
    fn pdf_proof_normalization_preserves_top_left_anchor_and_extends_right_bottom() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("webkit-anchor.pdf");
        write_test_pdf_with_content(
            &output,
            pdf_box(419, 595),
            Some(pdf_box(419, 595)),
            Some(pdf_box(419, 595)),
            vec![b"q 1 0 0 1 10 20 cm Q".to_vec()],
        );

        let original_media_box = first_page_box(&output, b"MediaBox");
        let original_crop_box = first_page_box(&output, b"CropBox");
        let original_trim_box = first_page_box(&output, b"TrimBox");
        normalize_pdf_a5_page_boxes(&output).expect("normalize");
        let media_box = first_page_box(&output, b"MediaBox");
        let crop_box = first_page_box(&output, b"CropBox");
        let trim_box = first_page_box(&output, b"TrimBox");

        for (before, after) in [
            (original_media_box, media_box),
            (original_crop_box, crop_box),
            (original_trim_box, trim_box),
        ] {
            assert_close(after.x_min, before.x_min);
            assert_close(after.y_max, before.y_max);
            assert_close(after.width(), A5_WIDTH_PT);
            assert_close(after.height(), A5_HEIGHT_PT);
            assert!(after.x_max > before.x_max);
            assert!(after.y_min < before.y_min);
        }
    }

    #[test]
    fn pdf_proof_normalization_does_not_change_page_content_streams() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("webkit-content.pdf");
        write_test_pdf_with_content(
            &output,
            pdf_box(419, 595),
            Some(pdf_box(419, 595)),
            None,
            vec![
                b"q 1 0 0 1 10 20 cm".to_vec(),
                b"0 0 100 100 re f Q".to_vec(),
            ],
        );
        let before = page_content_streams(&output);
        let before_evidence = content_stream_evidence(&before);

        normalize_pdf_a5_page_boxes(&output).expect("normalize");

        let after = page_content_streams(&output);
        let after_evidence = content_stream_evidence(&after);
        assert_eq!(after.len(), 2);
        assert_eq!(after_evidence, before_evidence);
        assert_eq!(after, before);
    }

    #[test]
    fn pdf_proof_wrong_top_left_anchor_is_detectable() {
        let original = pdf_page_box(&pdf_box(419, 595)).expect("original box");
        let wrong_anchor = pdf_page_box(&pdf_box_from_coords(0.0, 0.0, A5_WIDTH_PT, A5_HEIGHT_PT))
            .expect("wrong anchor box");

        assert_close(wrong_anchor.width(), A5_WIDTH_PT);
        assert_close(wrong_anchor.height(), A5_HEIGHT_PT);
        assert_close(wrong_anchor.x_min, original.x_min);
        assert!(
            (wrong_anchor.y_max - original.y_max).abs() > PDF_BOX_TOLERANCE_PT,
            "top anchor should differ"
        );
    }

    #[test]
    fn pdf_proof_rejects_arbitrary_nearby_page_boxes_without_named_normalization() {
        let result = assert_a5_pdf_box(&pdf_box(420, 595), "MediaBox");

        assert!(result.is_err());
    }

    #[test]
    fn pdf_proof_rejects_a4_page_box() {
        let result = assert_a5_pdf_box(&pdf_box(595, 842), "MediaBox");

        assert!(result.is_err());
    }

    #[test]
    fn pdf_proof_rejects_invalid_pdf_file() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("invalid.pdf");
        fs::write(&output, b"not a pdf").expect("invalid pdf");

        assert!(validate_pdf_a5_page_boxes(&output).is_err());
    }

    #[test]
    fn document_proof_assembles_one_page_document() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-one");
        fs::create_dir(&staging).expect("staging");
        write_valid_staged_pdf(&staging, 1, b"page one");
        let output = temp.path().join("travelbook.pdf");

        let result = assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["page-a"],
        ))
        .expect("assemble");

        assert_eq!(result.page_count, 1);
        validate_pdf_a5_page_boxes(&output).expect("final exact A5");
        let document = lopdf::Document::load(&output).expect("final pdf");
        assert_eq!(document.get_pages().len(), 1);
    }

    #[test]
    fn document_proof_preserves_multi_page_order_and_content_streams() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-order");
        fs::create_dir(&staging).expect("staging");
        let first = write_valid_staged_pdf(&staging, 1, b"content A");
        let second = write_valid_staged_pdf(&staging, 2, b"content B");
        let third = write_valid_staged_pdf(&staging, 3, b"content C");
        let expected_hashes = [first, second, third]
            .iter()
            .map(|path| {
                let document = lopdf::Document::load(path).expect("source pdf");
                let page_id = *document.get_pages().values().next().expect("source page");
                page_content_stream_hashes(&document, page_id).expect("source hashes")
            })
            .collect::<Vec<_>>();
        let output = temp.path().join("travelbook.pdf");

        assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["a", "b", "c"],
        ))
        .expect("assemble");

        let document = lopdf::Document::load(&output).expect("final pdf");
        let actual_hashes = document
            .get_pages()
            .values()
            .map(|page_id| page_content_stream_hashes(&document, *page_id).expect("final hashes"))
            .collect::<Vec<_>>();
        assert_eq!(actual_hashes, expected_hashes);
    }

    #[test]
    fn document_proof_supports_variable_page_count_without_fixed_assumption() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-variable");
        fs::create_dir(&staging).expect("staging");
        for index in 1..=5 {
            write_valid_staged_pdf(&staging, index, format!("content {index}").as_bytes());
        }
        let output = temp.path().join("travelbook.pdf");

        let result = assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["a", "b", "c", "d", "e"],
        ))
        .expect("assemble");

        assert_eq!(result.page_count, 5);
        let document = lopdf::Document::load(&output).expect("final pdf");
        assert_eq!(document.get_pages().len(), 5);
    }

    #[test]
    fn document_proof_page_failure_fails_whole_document_without_final_output() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-fail");
        fs::create_dir(&staging).expect("staging");
        write_valid_staged_pdf(&staging, 1, b"content A");
        write_valid_staged_pdf(&staging, 2, b"content B");
        write_test_pdf(
            &staging.join("0003.pdf"),
            pdf_box(595, 842),
            Some(pdf_box(595, 842)),
        );
        let output = temp.path().join("travelbook.pdf");

        let result = assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["a", "b", "c"],
        ));

        assert!(result.expect_err("invalid page fails").starts_with("PDF_DOCUMENT_PROOF_PAGE_FAILED"));
        assert!(!output.exists());
    }

    #[test]
    fn document_proof_rejects_empty_staged_capture_before_assembly() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-empty");
        fs::create_dir(&staging).expect("staging");
        write_test_pdf_with_content(
            &staging.join("0001.pdf"),
            pdf_box(419, 595),
            Some(pdf_box(419, 595)),
            None,
            vec![Vec::new()],
        );
        normalize_pdf_a5_page_boxes(&staging.join("0001.pdf")).expect("normalize empty A5 page");
        let output = temp.path().join("travelbook.pdf");

        let result = assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["blank"],
        ));

        assert!(result.expect_err("empty capture fails").starts_with("PDF_DOCUMENT_PROOF_EMPTY_CAPTURE"));
        assert!(!output.exists());
    }

    #[test]
    fn document_proof_accepts_valid_non_text_content_page() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-non-text");
        fs::create_dir(&staging).expect("staging");
        write_valid_staged_pdf(&staging, 1, b"q 0 0 100 100 re f Q");
        let output = temp.path().join("travelbook.pdf");

        let result = assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["image-dominant"],
        ))
        .expect("non-text content is valid");

        assert_eq!(result.page_count, 1);
        assert!(output.exists());
    }

    #[test]
    fn document_proof_manifest_matches_final_document() {
        let temp = tempfile::tempdir().expect("tempdir");
        let staging = temp.path().join("document-proof-manifest");
        fs::create_dir(&staging).expect("staging");
        write_valid_staged_pdf(&staging, 1, b"content A");
        write_valid_staged_pdf(&staging, 2, b"content B");
        let output = temp.path().join("travelbook.pdf");

        assemble_studio_document_pdf_proof(document_proof_request(
            &output,
            &staging,
            &["a", "b"],
        ))
        .expect("assemble");

        let manifest: StudioDocumentProofManifest = serde_json::from_slice(
            &fs::read(staging.join("manifest.json")).expect("manifest"),
        )
        .expect("manifest json");
        assert_eq!(manifest.schema, "northern-lines.studio.document-proof.v1");
        assert_eq!(manifest.page_count, 2);
        assert_eq!(manifest.pages.iter().map(|page| page.page_id.as_str()).collect::<Vec<_>>(), vec!["a", "b"]);
        assert!(manifest.pages.iter().all(|page| page.validation_status == "validated"));
        assert!(manifest.pages.iter().all(|page| page.content_stream_count > 0));
        assert!(manifest.pages.iter().all(|page| page.decoded_content_bytes > 0));
        assert!(manifest.pages.iter().all(|page| !page.decoded_content_hashes.is_empty()));
        validate_document_pdf_output(&output, &manifest).expect("manifest matches final");
    }

    #[test]
    fn pdf_proof_removes_stale_target_before_rendering() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("stale.pdf");
        fs::write(&output, b"old proof").expect("stale proof");

        prepare_pdf_proof_output(&output).expect("remove stale proof");

        assert!(!output.exists());
    }

    #[test]
    fn pdfa_temp_output_path_keeps_pdf_extension_for_atomic_candidate() {
        let temp = tempfile::tempdir().expect("tempdir");
        let output = temp.path().join("travelbook.pdf");

        let candidate = pdfa_temp_output_path(&output);

        assert_eq!(candidate, temp.path().join("travelbook.pdfa2b.tmp.pdf"));
        assert_eq!(
            candidate
                .extension()
                .and_then(|extension| extension.to_str()),
            Some("pdf")
        );
        assert_eq!(candidate.parent(), output.parent());
        assert_ne!(candidate, output);
    }

    #[test]
    fn pdfa_export_uses_pdf_temp_candidate_and_atomically_moves_final_output() {
        let temp = tempfile::tempdir().expect("tempdir");
        let source = temp.path().join("standard.pdf");
        write_pdfa_convertible_test_pdf(&source);
        let output = temp.path().join("travelbook-pdfa.pdf");
        let candidate = pdfa_temp_output_path(&output);

        assert!(source.exists());
        assert_eq!(
            output.extension().and_then(|extension| extension.to_str()),
            Some("pdf")
        );
        assert_eq!(
            candidate
                .extension()
                .and_then(|extension| extension.to_str()),
            Some("pdf")
        );
        assert!(pdfa::convert_to_pdfa2b(&source, &candidate).is_ok());
        assert!(candidate.exists());
        fs::remove_file(&candidate).expect("remove accepted candidate before export");

        let result = export_studio_pdfa2b(StudioPdfA2bExportRequest {
            source_path: source.to_string_lossy().into_owned(),
            output_path: output.to_string_lossy().into_owned(),
        })
        .expect("pdfa export succeeds");

        assert_eq!(result.page_count, 1);
        assert_eq!(result.profile, "PDF/A-2b");
        assert!(output.exists());
        assert!(!candidate.exists());
    }

    #[test]
    fn pdfa_export_failure_does_not_leave_final_or_candidate_output() {
        let temp = tempfile::tempdir().expect("tempdir");
        let source = temp.path().join("standard.pdf");
        write_test_pdf_with_content(
            &source,
            pdf_box(419, 595),
            Some(pdf_box(419, 595)),
            None,
            vec![b"content without rgb profile".to_vec()],
        );
        normalize_pdf_a5_page_boxes(&source).expect("normalize source");
        let output = temp.path().join("travelbook-pdfa.pdf");

        let result = export_studio_pdfa2b(StudioPdfA2bExportRequest {
            source_path: source.to_string_lossy().into_owned(),
            output_path: output.to_string_lossy().into_owned(),
        });

        assert_eq!(
            pdfa_temp_output_path(&output)
                .extension()
                .and_then(|extension| extension.to_str()),
            Some("pdf")
        );
        assert!(result
            .expect_err("pdfa conversion fails")
            .starts_with("PDF_A_"));
        assert!(!output.exists());
        assert!(!pdfa_temp_output_path(&output).exists());
    }
}
