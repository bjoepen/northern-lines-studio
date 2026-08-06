# Build 001: Project reader and static A5 preview

## Objective

Prove that Northern Lines Studio can open one prepared `.nls` project, show its ordered page list and display a static A5 portrait preview for the selected page.

## Included

- Swift Package-based native macOS executable
- SwiftUI app shell
- AppKit A5 canvas
- `.nls` package selection
- `project.json` decoding
- format and version validation
- duplicate page-ID validation
- page sidebar
- read-only inspector
- example project
- unit tests for core manifest validation

## Explicitly excluded

- creating or saving projects
- editing content
- moving or resizing objects
- page thumbnails
- zoom controls
- drag-and-drop
- layout selection
- asset management
- Publisher CLI execution
- rendering, PDF export and preflight

## Acceptance criteria

Build 001 is complete when:

- the package opens and builds in Xcode on macOS 14+
- `Examples/Norway-Sample.nls` can be opened
- all three pages appear in manifest order
- selecting a page updates preview and inspector
- invalid format versions are rejected without crashing
- automated tests pass on macOS
- no excluded feature has been added
