use serde::{Deserialize, Serialize};
use std::{collections::{BTreeMap, HashSet}, fs, path::Path};

const EXPECTED_FORMAT: &str = "northern-lines-studio-project";
const CURRENT_FORMAT_VERSION: &str = "0.5.0";
const BUILD_009_FORMAT_VERSION: &str = "0.4.0";
const BUILD_004_FORMAT_VERSION: &str = "0.3.0";
const BUILD_003_FORMAT_VERSION: &str = "0.2.0";
const LEGACY_FORMAT_VERSION: &str = "0.1.0";
const REFERENCE_WORLD_ID: &str = "fjord";

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
    stages: Vec<JourneyStage>,
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

fn infer_role(page_type: &str) -> &'static str {
    match page_type {
        "cover" | "welcome" | "contents" => "front_matter",
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

fn infer_legacy_journey(project: &StudioProject) -> Journey {
    let mut stages = Vec::new();
    for page in &project.page_manifest {
        if page.page_type == "destination" {
            stages.push(JourneyStage {
                id: page.id.trim_start_matches("page-").to_string(),
                kind: "destination".into(),
                title: page.title.clone(),
                country: None,
            });
        }
    }

    Journey {
        id: format!("{}-journey", project.project_id),
        title: project.title.clone(),
        journey_type: "journey".into(),
        start_date: None,
        end_date: None,
        stages,
    }
}

fn migrate_project(mut project: StudioProject) -> Result<StudioProject, String> {
    match project.format_version.as_str() {
        CURRENT_FORMAT_VERSION => {}
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
    validate_project(&project)?;
    project.page_manifest.sort_by_key(|page| page.order);
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

    let journey = project
        .journey
        .as_ref()
        .ok_or_else(|| "Das Projekt besitzt kein Journey-Modell.".to_string())?;
    if journey.id.trim().is_empty() || journey.title.trim().is_empty() || journey.journey_type.trim().is_empty() {
        return Err("Journey besitzt keine gültige ID, keinen Titel oder keinen Typ.".into());
    }

    let mut stage_ids = HashSet::new();
    for stage in &journey.stages {
        if stage.id.trim().is_empty() || stage.title.trim().is_empty() || stage.kind.trim().is_empty() {
            return Err("Journey Stage besitzt ungültige Pflichtfelder.".into());
        }
        if !stage_ids.insert(stage.id.clone()) {
            return Err(format!("Doppelte Journey-Stage-ID: {}", stage.id));
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
    if editorial_world_id != REFERENCE_WORLD_ID {
        return Err(format!("Editorial World '{editorial_world_id}' ist für neue Reisen noch nicht freigegeben."));
    }
    let folder = Path::new(&parent_path).join(format!("{}.nls", slugify(title)));
    if folder.exists() { return Err(format!("Eine Reise mit diesem Namen existiert dort bereits: {}", folder.display())); }
    fs::create_dir_all(folder.join("content/pages")).map_err(|e| format!("Die Reise konnte nicht angelegt werden: {e}"))?;

    let pages = vec![
        starter_page("page-cover", 1, "cover", "front_matter", title, "content/pages/001-cover.md", "cover", None),
        starter_page("page-welcome", 2, "welcome", "front_matter", "Willkommen", "content/pages/002-welcome.md", "welcome", None),
        starter_page("page-contents", 3, "contents", "front_matter", "Inhaltsverzeichnis", "content/pages/003-contents.md", "contents", None),
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
        journey: Some(Journey { id: format!("{}-journey", slugify(title)), title: title.into(), journey_type: "travel".into(), start_date: None, end_date: None, stages: Vec::new() }),
        document: DocumentSettings { page_format: "A5".into(), orientation: "portrait".into() },
        page_manifest: pages, project_path: folder.to_string_lossy().into_owned(), migrated_from_version: None,
    };
    validate_project(&project)?;
    write_project(&folder, &project)?;
    let project = read_project(&folder)?;
    Ok(project_session(project, &folder))
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
    journey.stages.push(JourneyStage { id: base.clone(), kind: "destination".into(), title: title.into(), country: (!country.trim().is_empty()).then(|| country.trim().to_string()) });
    let destination_count = project.page_manifest.iter().filter(|page| page.page_type == "destination").count() as u32;
    let order = 4 + destination_count;
    let content = format!("content/pages/{:03}-{}.md", order, base);
    let mut page = StudioPage {
        id: format!("page-{base}"), order, page_type: "destination".into(), role: Some("destination".into()),
        title: title.into(), content: content.clone(), layout: "destination-standard".into(), journey_stage: Some(base),
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![load_nls_project, create_nls_project, save_authoring_component, add_journey_place])
        .run(tauri::generate_context!())
        .expect("error while running Northern Lines Studio");
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
                || version == BUILD_009_FORMAT_VERSION
                || version == BUILD_004_FORMAT_VERSION
            {
                Some(REFERENCE_WORLD_ID.into())
            } else {
                None
            },
            legacy_editorial_world: if version == CURRENT_FORMAT_VERSION
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
                    stages: vec![JourneyStage {
                        id: "bergen".into(),
                        kind: "destination".into(),
                        title: "Bergen".into(),
                        country: Some("Norway".into()),
                    }],
                })
            } else {
                None
            },
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
                layout: "destination-standard".into(),
                journey_stage: if version != LEGACY_FORMAT_VERSION { Some("bergen".into()) } else { None },
                knowledge_type: None,
                components: if version == CURRENT_FORMAT_VERSION { vec!["hero".into(), "title".into(), "introduction".into(), "history".into(), "photography".into(), "knowledge".into(), "souvenirs".into(), "qr".into()] } else { vec![] },
                authoring: BTreeMap::new(),
            }],
            project_path: String::new(),
            migrated_from_version: None,
        }
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
        assert_eq!(created.project.page_manifest.len(), 8);
        assert!(Path::new(&created.project_path).join("project.json").exists());
        assert!(validate_project(&created.project).is_ok());
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
