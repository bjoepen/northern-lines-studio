# Build 010.1 Release Notes

**Story Authoring Engineering Stabilization**

Build 010.1 hardens the semantic authoring foundation after its first real-world use.

## Fixed
- strict TypeScript diagnostic in the semantic authoring test;
- missing runtime `path` during authoring save;
- loss of the runtime project path after the first save response;
- inaccurate Build-009 Rust migration fixture for the `0.4.0` project schema.

## Real-world evidence
The Bergen introduction was edited, saved, checked after page navigation, then checked again after quitting and reopening Studio. The authored text persisted successfully.

## Compatibility
The `.nls` format remains `0.5.0`. No new project migration is introduced.
