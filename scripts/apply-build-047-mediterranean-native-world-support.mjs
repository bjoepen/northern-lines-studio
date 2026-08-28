import fs from 'node:fs';

const path = 'src-tauri/src/lib.rs';
let source = fs.readFileSync(path, 'utf8');

function replaceOnce(before, after, label) {
  if (source.includes(after)) return;
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`Build 047 native apply failed: ${label} anchor count=${count}`);
  source = source.replace(before, after);
}

replaceOnce(
  'const BALTIC_WORLD_ID: &str = "baltic";\n',
  'const BALTIC_WORLD_ID: &str = "baltic";\nconst MEDITERRANEAN_WORLD_ID: &str = "mediterranean";\n',
  'Mediterranean world constant'
);

replaceOnce(
  'fn is_supported_editorial_world(id: &str) -> bool {\n    id == REFERENCE_WORLD_ID || id == BALTIC_WORLD_ID\n}',
  'fn is_supported_editorial_world(id: &str) -> bool {\n    id == REFERENCE_WORLD_ID || id == BALTIC_WORLD_ID || id == MEDITERRANEAN_WORLD_ID\n}',
  'native supported world validation'
);

const testAnchor = `    #[test]\n    fn creates_a_new_fjord_journey() {`;
const mediterraneanTest = `    #[test]\n    fn supports_mediterranean_world_and_persists_world_switch() {\n        let root = tempfile::tempdir().expect("tempdir");\n        let created = create_nls_project(\n            root.path().to_string_lossy().into_owned(),\n            "Mittelmeer Test".into(),\n            MEDITERRANEAN_WORLD_ID.into(),\n            "de".into(),\n        ).expect("create mediterranean");\n        assert_eq!(\n            created.project.editorial_world_id.as_deref(),\n            Some(MEDITERRANEAN_WORLD_ID)\n        );\n        let switched = update_editorial_world(\n            created.project.project_path.clone(),\n            REFERENCE_WORLD_ID.into(),\n        ).expect("switch world");\n        assert_eq!(\n            switched.project.editorial_world_id.as_deref(),\n            Some(REFERENCE_WORLD_ID)\n        );\n    }\n\n`;
if (!source.includes('fn supports_mediterranean_world_and_persists_world_switch()')) {
  const count = source.split(testAnchor).length - 1;
  if (count !== 1) throw new Error(`Build 047 native apply failed: Mediterranean test anchor count=${count}`);
  source = source.replace(testAnchor, mediterraneanTest + testAnchor);
}

fs.writeFileSync(path, source);
console.log('Build 047 Mediterranean native world support apply: PASS');
console.log('Rust project validation now accepts fjord, baltic and mediterranean.');
