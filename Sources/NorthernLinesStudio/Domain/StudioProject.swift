import Foundation

struct StudioProject: Codable, Equatable, Sendable {
    let format: String
    let formatVersion: String
    let title: String
    let pageSize: PageSize
    let pages: [StudioPage]

    static let supportedFormat = "northern-lines-studio-project"
    static let supportedFormatVersion = "0.1"
}

struct PageSize: Codable, Equatable, Sendable {
    let widthMillimetres: Double
    let heightMillimetres: Double

    static let a5Portrait = PageSize(widthMillimetres: 148, heightMillimetres: 210)
}

struct StudioPage: Codable, Identifiable, Equatable, Sendable {
    let id: String
    let title: String
    let type: String
    let content: String?
}
