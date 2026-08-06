# Build 001 validation

## Automated checks

- [ ] package builds on macOS 14+
- [ ] all unit tests pass
- [x] `Package.swift` parses successfully
- [x] example `project.json` is valid JSON
- [x] example content paths exist

## Manual macOS checks

- [ ] application launches
- [ ] Open Project selects `Examples/Norway-Sample.nls`
- [ ] page list contains Cover, Willkommen and Bergen
- [ ] selection updates the A5 preview
- [ ] selection updates the inspector
- [ ] unsupported project version shows an error

## Environment limitation

The repository package was assembled in a Linux validation environment. SwiftUI and AppKit compilation must therefore be completed on macOS/Xcode before release approval.
