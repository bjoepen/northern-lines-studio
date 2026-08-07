use serde::{Deserialize, Serialize};
use std::{collections::HashSet, fs, path::Path};

const EXPECTED_FORMAT: &str = "northern-lines-studio-project";
const CURRENT_FORMAT_VERSION: &str = "0.2.0";
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
    editorial_world: Option<EditorialWorld>,
    #[serde(default)]
    journey: Option<Journey>,
    document: DocumentSettings,
    page_manifest: Vec<StudioPage>,
    #[serde(default)]
    project_path: String,
    #[serde(default)]
    migrated_from_version: Option<String>,
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
        LEGACY_FORMAT_VERSION => {
            project.migrated_from_version = Some(LEGACY_FORMAT_VERSION.into());
            project.format_version = CURRENT_FORMAT_VERSION.into();

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
        }
        version => {
            return Err(format!("Nicht unterstützte Projektformat-Version: {version}"));
        }
    }
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
        return Err("Build 003 unterstützt ausschließlich A5 im Hochformat.".into());
    }
    if project.page_manifest.is_empty() {
        return Err("Das Projekt enthält keine Seiten.".into());
    }

    if let Some(world) = &project.editorial_world {
        if world.id.trim().is_empty() || world.name.trim().is_empty() {
            return Err("Editorial World besitzt keine gültige ID oder keinen Namen.".into());
        }
        if world.companion.id.trim().is_empty() || world.companion.name.trim().is_empty() {
            return Err("Editorial World besitzt keinen gültigen Companion.".into());
        }
        if world.reference && world.id != REFERENCE_WORLD_ID {
            return Err(format!(
                "Build 003 kennt ausschließlich '{}' als Reference World.",
                REFERENCE_WORLD_ID
            ));
        }
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

#[tauri::command]
fn load_nls_project(path: String) -> Result<StudioProject, String> {
    read_project(Path::new(&path))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![load_nls_project])
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
            editorial_world: Some(EditorialWorld {
                id: REFERENCE_WORLD_ID.into(),
                name: "Fjord".into(),
                reference: true,
                companion: EditorialCompanion {
                    id: "puffin".into(),
                    name: "Papageientaucher".into(),
                },
            }),
            journey: if version == CURRENT_FORMAT_VERSION {
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
                role: if version == CURRENT_FORMAT_VERSION { Some("destination".into()) } else { None },
                title: "Bergen".into(),
                content: "content/pages/010-bergen.md".into(),
                layout: "destination-standard".into(),
                journey_stage: if version == CURRENT_FORMAT_VERSION { Some("bergen".into()) } else { None },
                knowledge_type: None,
            }],
            project_path: String::new(),
            migrated_from_version: None,
        }
    }

    #[test]
    fn accepts_valid_build_003_project() {
        assert!(validate_project(&sample_project(CURRENT_FORMAT_VERSION)).is_ok());
    }

    #[test]
    fn migrates_build_002_project_to_0_2_0() {
        let migrated = migrate_project(sample_project(LEGACY_FORMAT_VERSION)).unwrap();
        assert_eq!(migrated.format_version, CURRENT_FORMAT_VERSION);
        assert_eq!(migrated.migrated_from_version.as_deref(), Some(LEGACY_FORMAT_VERSION));
        assert_eq!(migrated.page_manifest[0].role.as_deref(), Some("destination"));
        assert_eq!(migrated.page_manifest[0].journey_stage.as_deref(), Some("bergen"));
        assert!(migrated.journey.is_some());
        assert!(validate_project(&migrated).is_ok());
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
    fn rejects_unknown_reference_world() {
        let mut project = sample_project(CURRENT_FORMAT_VERSION);
        project.editorial_world.as_mut().unwrap().id = "arctic".into();
        assert!(validate_project(&project).is_err());
    }

    #[test]
    fn rejects_unknown_journey_stage_reference() {
        let mut project = sample_project(CURRENT_FORMAT_VERSION);
        project.page_manifest[0].journey_stage = Some("unknown".into());
        assert!(validate_project(&project).is_err());
    }
}
