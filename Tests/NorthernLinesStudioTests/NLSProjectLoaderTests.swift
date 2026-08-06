import XCTest
@testable import NorthernLinesStudio

final class NLSProjectLoaderTests: XCTestCase {
    func testValidProjectPassesValidation() throws {
        let project = StudioProject(
            format: StudioProject.supportedFormat,
            formatVersion: StudioProject.supportedFormatVersion,
            title: "Sample",
            pageSize: .a5Portrait,
            pages: [StudioPage(id: "cover", title: "Cover", type: "cover", content: nil)]
        )

        XCTAssertNoThrow(try NLSProjectLoader().validate(project))
    }

    func testUnsupportedVersionFailsValidation() {
        let project = StudioProject(
            format: StudioProject.supportedFormat,
            formatVersion: "9.9",
            title: "Sample",
            pageSize: .a5Portrait,
            pages: [StudioPage(id: "cover", title: "Cover", type: "cover", content: nil)]
        )

        XCTAssertThrowsError(try NLSProjectLoader().validate(project)) { error in
            XCTAssertEqual(error as? NLSProjectError, .unsupportedVersion("9.9"))
        }
    }

    func testDuplicatePageIdentifiersFailValidation() {
        let duplicate = StudioPage(id: "page", title: "Page", type: "standard", content: nil)
        let project = StudioProject(
            format: StudioProject.supportedFormat,
            formatVersion: StudioProject.supportedFormatVersion,
            title: "Sample",
            pageSize: .a5Portrait,
            pages: [duplicate, duplicate]
        )

        XCTAssertThrowsError(try NLSProjectLoader().validate(project)) { error in
            XCTAssertEqual(error as? NLSProjectError, .duplicatePageID("page"))
        }
    }
}
