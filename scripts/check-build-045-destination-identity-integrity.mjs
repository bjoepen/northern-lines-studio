import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 045 Destination Identity gate failed: ${message}`);
}

const rust = fs.readFileSync('src-tauri/src/lib.rs', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const updateStart = rust.indexOf('fn update_journey_place(');
must(updateStart >= 0, 'update_journey_place is missing');
const updateEnd = rust.indexOf('\n#[tauri::command]\nfn update_destination_profile(', updateStart);
must(updateEnd > updateStart, 'update_journey_place boundary is missing');
const update = rust.slice(updateStart, updateEnd);

must(
  update.includes('.destination_id') &&
  update.includes('let destination_id ='),
  'rename does not resolve the persisted JourneyStage.destinationId'
);
must(
  update.includes('destination.id == destination_id'),
  'rename does not join Destination through the persisted destinationId'
);
must(
  !update.includes('format!("destination-{stage_id}")'),
  'rename still derives Destination identity from JourneyStage.id'
);
must(
  update.includes(`"Der Ort besitzt noch keine Destination-Referenz."`),
  'rename does not fail closed when destinationId is missing'
);
must(
  update.includes(`"Destination Profile '{destination_id}' wurde nicht gefunden."`),
  'rename does not fail closed when the referenced Destination Profile is missing'
);

must(
  rust.includes('fn renames_journey_place_through_persisted_destination_identity()'),
  'non-derived destinationId regression test is missing'
);
must(
  rust.includes('"destination-stable-4711"'),
  'regression test does not exercise a deliberately non-derived destinationId'
);
must(
  rust.includes('assert_eq!(updated_stage.id, stage.id);'),
  'regression test does not protect stable JourneyStage.id'
);
must(
  rust.includes('assert_eq!(destination.name, "Stavanger");'),
  'regression test does not protect Destination.name synchronization'
);
must(
  rust.includes('assert_eq!(page.title, "Stavanger");'),
  'regression test does not protect Destination Page title synchronization'
);

must(
  pkg.scripts['consistency:build-045'] === 'node scripts/check-build-045-destination-identity-integrity.mjs',
  'Build 045 package gate is missing'
);
must(
  pkg.scripts.consistency.includes('check-build-045-destination-identity-integrity.mjs'),
  'Build 045 is not part of full consistency'
);

console.log('Build 045 Destination Identity Integrity Gate: PASS');
console.log('Creation may derive identity; runtime rename resolves persisted identity; stable IDs remain unchanged.');
