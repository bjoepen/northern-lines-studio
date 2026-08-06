import AppKit
import SwiftUI

struct A5CanvasRepresentable: NSViewRepresentable {
    let page: StudioPage?

    func makeNSView(context: Context) -> A5CanvasView {
        A5CanvasView()
    }

    func updateNSView(_ nsView: A5CanvasView, context: Context) {
        nsView.page = page
    }
}

final class A5CanvasView: NSView {
    var page: StudioPage? {
        didSet { needsDisplay = true }
    }

    override var isFlipped: Bool { true }

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)

        NSColor.windowBackgroundColor.setFill()
        dirtyRect.fill()

        let pageHeight: CGFloat = min(bounds.height - 80, 680)
        let pageWidth = pageHeight * 148 / 210
        let pageRect = NSRect(
            x: bounds.midX - pageWidth / 2,
            y: max(40, bounds.midY - pageHeight / 2),
            width: pageWidth,
            height: pageHeight
        )

        let shadow = NSShadow()
        shadow.shadowBlurRadius = 14
        shadow.shadowOffset = NSSize(width: 0, height: 3)
        shadow.shadowColor = NSColor.black.withAlphaComponent(0.18)

        NSGraphicsContext.saveGraphicsState()
        shadow.set()
        NSColor.white.setFill()
        NSBezierPath(rect: pageRect).fill()
        NSGraphicsContext.restoreGraphicsState()

        let title = page?.title ?? "A5 Preview"
        let type = page?.type.uppercased() ?? "NO PAGE SELECTED"

        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 28, weight: .semibold),
            .foregroundColor: NSColor.labelColor
        ]
        let metaAttributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 11, weight: .medium),
            .foregroundColor: NSColor.secondaryLabelColor
        ]

        NSString(string: type).draw(
            at: NSPoint(x: pageRect.minX + 38, y: pageRect.minY + 42),
            withAttributes: metaAttributes
        )
        NSString(string: title).draw(
            in: NSRect(x: pageRect.minX + 38, y: pageRect.minY + 72, width: pageRect.width - 76, height: 90),
            withAttributes: titleAttributes
        )

        NSColor.separatorColor.setStroke()
        let line = NSBezierPath()
        line.move(to: NSPoint(x: pageRect.minX + 38, y: pageRect.minY + 170))
        line.line(to: NSPoint(x: pageRect.maxX - 38, y: pageRect.minY + 170))
        line.stroke()
    }
}
