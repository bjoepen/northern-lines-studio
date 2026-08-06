import SwiftUI

@main
struct NorthernLinesStudioApp: App {
    @State private var workspace = ProjectWorkspace()

    var body: some Scene {
        WindowGroup {
            StudioRootView()
                .environment(workspace)
                .frame(minWidth: 960, minHeight: 640)
        }
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Open Project…") {
                    workspace.openProject()
                }
                .keyboardShortcut("o")
            }
        }
    }
}
