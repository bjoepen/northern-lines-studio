import AppKit
import Foundation
import Observation

@MainActor
@Observable
final class ProjectWorkspace {
    private(set) var project: StudioProject?
    private(set) var projectURL: URL?
    var selectedPageID: StudioPage.ID?
    var presentedError: String?

    var selectedPage: StudioPage? {
        guard let selectedPageID else { return project?.pages.first }
        return project?.pages.first { $0.id == selectedPageID }
    }

    func openProject() {
        let panel = NSOpenPanel()
        panel.title = "Open Northern Lines Studio Project"
        panel.prompt = "Open"
        panel.canChooseFiles = true
        panel.canChooseDirectories = true
        panel.allowsMultipleSelection = false
        panel.allowedContentTypes = []

        guard panel.runModal() == .OK, let url = panel.url else { return }
        loadProject(at: url)
    }

    func loadProject(at url: URL) {
        do {
            let loadedProject = try NLSProjectLoader().loadProject(at: url)
            project = loadedProject
            projectURL = url
            selectedPageID = loadedProject.pages.first?.id
            presentedError = nil
        } catch {
            presentedError = error.localizedDescription
        }
    }
}
