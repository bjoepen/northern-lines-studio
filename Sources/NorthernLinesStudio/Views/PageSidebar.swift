import SwiftUI

struct PageSidebar: View {
    @Environment(ProjectWorkspace.self) private var workspace
    @Binding var selection: StudioPage.ID?

    var body: some View {
        Group {
            if let project = workspace.project {
                List(project.pages, selection: $selection) { page in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(page.title)
                        Text(page.type)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .tag(page.id)
                }
                .navigationTitle(project.title)
            } else {
                ContentUnavailableView(
                    "No Project Open",
                    systemImage: "book.closed",
                    description: Text("Open an .nls project to view its pages.")
                )
            }
        }
        .navigationSplitViewColumnWidth(min: 220, ideal: 260)
    }
}
