// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "NorthernLinesStudio",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "NorthernLinesStudio", targets: ["NorthernLinesStudio"])
    ],
    targets: [
        .executableTarget(
            name: "NorthernLinesStudio",
            path: "Sources/NorthernLinesStudio"
        ),
        .testTarget(
            name: "NorthernLinesStudioTests",
            dependencies: ["NorthernLinesStudio"],
            path: "Tests/NorthernLinesStudioTests"
        )
    ]
)
