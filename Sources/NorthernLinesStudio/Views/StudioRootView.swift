import SwiftUI

struct StudioRootView: View {
    @Environment(ProjectWorkspace.self) private var workspace

    var body: some View {
        @Bindable var workspace = workspace

        NavigationSplitView {
            PageSidebar(selection: $workspace.selectedPageID)
        } detail: {
            PagePreview(page: workspace.selectedPage)
                .toolbar {
                    ToolbarItem(placement: .primaryAction) {
                        Button("Open Project…") {
                            workspace.openProject()
                        }
                    }
                }
        }
        .inspector(isPresented: .constant(workspace.project != nil)) {
            PageInspector(page: workspace.selectedPage)
                .inspectorColumnWidth(min: 220, ideal: 260, max: 340)
        }
        .alert("Project could not be opened", isPresented: Binding(
            get: { workspace.presentedError != nil },
            set: { if !$0 { workspace.presentedError = nil } }
        )) {
            Button("OK", role: .cancel) { workspace.presentedError = nil }
        } message: {
            Text(workspace.presentedError ?? "Unknown error")
        }
    }
}
