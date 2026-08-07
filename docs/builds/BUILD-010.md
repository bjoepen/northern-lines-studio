# Build 010 – Story Authoring Foundation

**Studio:** 0.10.0  
**.nls format:** 0.5.0

Build 010 is the first authoring build. Present Story Components can be selected in the Inspector, edited as semantic content, assigned an editorial status and saved back to the open `.nls` project.

The UI deliberately avoids rich-text controls and free layout tools. The primary authoring question remains: **What do you want to tell here?**

## Added
- `src/lib/authoring/` domain
- semantic authoring status lifecycle
- component editor in the Story Inspector
- `save_authoring_component` Tauri command
- persistent per-component authoring entries
- `.nls` 0.5.0 migration path
- authoring tests and Rust validation

## Known limitations
- text-only authoring in this foundation build
- Hero/image assets are not selected yet
- no undo/redo or autosave
- Publisher bridge remains conceptual; rendering is unchanged
