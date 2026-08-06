import Foundation

enum NLSProjectError: LocalizedError, Equatable {
    case missingManifest
    case unsupportedFormat(String)
    case unsupportedVersion(String)
    case emptyPageList
    case duplicatePageID(String)
    case unreadableManifest

    var errorDescription: String? {
        switch self {
        case .missingManifest:
            return "The project does not contain project.json."
        case .unsupportedFormat(let value):
            return "Unsupported project format: \(value)."
        case .unsupportedVersion(let value):
            return "Unsupported project format version: \(value)."
        case .emptyPageList:
            return "The project does not contain any pages."
        case .duplicatePageID(let id):
            return "The project contains the duplicate page ID \(id)."
        case .unreadableManifest:
            return "The project manifest could not be read."
        }
    }
}

struct NLSProjectLoader {
    func loadProject(at packageURL: URL) throws -> StudioProject {
        let manifestURL = packageURL.appendingPathComponent("project.json")
        guard FileManager.default.fileExists(atPath: manifestURL.path) else {
            throw NLSProjectError.missingManifest
        }

        let data: Data
        do {
            data = try Data(contentsOf: manifestURL)
        } catch {
            throw NLSProjectError.unreadableManifest
        }

        let project: StudioProject
        do {
            project = try JSONDecoder().decode(StudioProject.self, from: data)
        } catch {
            throw NLSProjectError.unreadableManifest
        }

        try validate(project)
        return project
    }

    func validate(_ project: StudioProject) throws {
        guard project.format == StudioProject.supportedFormat else {
            throw NLSProjectError.unsupportedFormat(project.format)
        }
        guard project.formatVersion == StudioProject.supportedFormatVersion else {
            throw NLSProjectError.unsupportedVersion(project.formatVersion)
        }
        guard !project.pages.isEmpty else {
            throw NLSProjectError.emptyPageList
        }

        var identifiers = Set<String>()
        for page in project.pages where !identifiers.insert(page.id).inserted {
            throw NLSProjectError.duplicatePageID(page.id)
        }
    }
}
