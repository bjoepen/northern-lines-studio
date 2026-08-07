use serde::{Deserialize, Serialize};
use std::{fs, path::Path};

const EXPECTED_FORMAT: &str = "northern-lines-studio-project";
const SUPPORTED_FORMAT_VERSION: &str = "0.1.0";
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
struct StudioPage {
    id: String,
    order: u32,
    #[serde(rename = "type")]
    page_type: String,
    title: String,
    content: String,
    layout: String,
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
    document: DocumentSettings,
    page_manifest: Vec<StudioPage>,
    #[serde(default)]
    project_path: String,
}

fn read_project(path: &Path) -> Result<StudioProject, String> {
    if path.extension().and_then(|value| value.to_str()) != Some("nls") {
        return Err("Das ausgewählte Verzeichnis besitzt nicht die Endung .nls.".into());
    }

    let manifest_path = path.join("project.json");
    let source = fs::read_to_string(&manifest_path)
        .map_err(|_| "project.json konnte im .nls-Projekt nicht gelesen werden.".to_string())?;

    let mut project: StudioProject = serde_json::from_str(&source)
        .map_err(|error| format!("project.json ist ungültig: {error}"))?;

    validate_project(&project)?;
    project.page_manifest.sort_by_key(|page| page.order);
    project.project_path = path.to_string_lossy().into_owned();
    Ok(project)
}

fn validate_project(project: &StudioProject) -> Result<(), String> {
    if project.format != EXPECTED_FORMAT {
        return Err(format!("Unbekanntes Projektformat: {}", project.format));
    }
    if project.format_version != SUPPORTED_FORMAT_VERSION {
        return Err(format!(
            "Nicht unterstützte Projektformat-Version: {}",
            project.format_version
        ));
    }
    if project.document.page_format != "A5" || project.document.orientation != "portrait" {
        return Err("Build 002 unterstützt ausschließlich A5 im Hochformat.".into());
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
                "Build 002 kennt ausschließlich '{}' als Reference World.",
                REFERENCE_WORLD_ID
            ));
        }
    }

    for (index, page) in project.page_manifest.iter().enumerate() {
        if page.id.trim().is_empty() || page.title.trim().is_empty() {
            return Err(format!("Seite {} besitzt keine gültige ID oder keinen Titel.", index + 1));
        }
        if project.page_manifest.iter().filter(|candidate| candidate.id == page.id).count() > 1 {
            return Err(format!("Doppelte Seiten-ID: {}", page.id));
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

    fn sample_project() -> StudioProject {
        StudioProject {
            format: EXPECTED_FORMAT.into(),
            format_version: SUPPORTED_FORMAT_VERSION.into(),
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
            document: DocumentSettings {
                page_format: "A5".into(),
                orientation: "portrait".into(),
            },
            page_manifest: vec![StudioPage {
                id: "cover".into(),
                order: 1,
                page_type: "cover".into(),
                title: "Cover".into(),
                content: "content/pages/001-cover.md".into(),
                layout: "cover-standard".into(),
            }],
            project_path: String::new(),
        }
    }

    #[test]
    fn accepts_valid_build_002_project() {
        assert!(validate_project(&sample_project()).is_ok());
    }

    #[test]
    fn accepts_build_001_project_without_editorial_world() {
        let mut project = sample_project();
        project.editorial_world = None;
        assert!(validate_project(&project).is_ok());
    }

    #[test]
    fn rejects_unsupported_format_version() {
        let mut project = sample_project();
        project.format_version = "9.0.0".into();
        assert!(validate_project(&project).is_err());
    }

    #[test]
    fn rejects_duplicate_page_ids() {
        let mut project = sample_project();
        project.page_manifest.push(project.page_manifest[0].clone());
        assert!(validate_project(&project).is_err());
    }

    #[test]
    fn rejects_unknown_reference_world() {
        let mut project = sample_project();
        project.editorial_world.as_mut().unwrap().id = "arctic".into();
        assert!(validate_project(&project).is_err());
    }
}
