import SwiftUI

struct PagePreview: View {
    let page: StudioPage?

    var body: some View {
        GeometryReader { geometry in
            ScrollView([.horizontal, .vertical]) {
                A5CanvasRepresentable(page: page)
                    .frame(
                        width: max(geometry.size.width, 620),
                        height: max(geometry.size.height, 760)
                    )
            }
            .background(Color(nsColor: .windowBackgroundColor))
        }
    }
}
