import SwiftUI

struct PageInspector: View {
    let page: StudioPage?

    var body: some View {
        Form {
            Section("Page") {
                LabeledContent("Title", value: page?.title ?? "—")
                LabeledContent("Type", value: page?.type ?? "—")
                LabeledContent("ID", value: page?.id ?? "—")
            }

            Section("Source") {
                LabeledContent("Content", value: page?.content ?? "—")
            }
        }
        .formStyle(.grouped)
    }
}
