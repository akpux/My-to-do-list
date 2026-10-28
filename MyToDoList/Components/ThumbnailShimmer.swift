import SwiftUI

/// Neutral skeleton for the 60pt task thumbnail while a photo is loading.
struct ThumbnailShimmer: View {
    static let size: CGFloat = 60
    static let cornerRadius: CGFloat = 8

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private static let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

    var body: some View {
        Group {
            if reduceMotion {
                Color(.tertiarySystemFill)
            } else {
                ShimmerSweep()
            }
        }
        .frame(width: Self.size, height: Self.size)
        .clipShape(Self.shape)
        .overlay {
            Self.shape.stroke(Color(white: 0.8), lineWidth: 1)
        }
        .accessibilityHidden(true)
    }
}

private struct ShimmerSweep: View {
    private static let sweepDuration: TimeInterval = 1.2

    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 30)) { timeline in
            let elapsed = timeline.date.timeIntervalSinceReferenceDate
            let phase = elapsed.truncatingRemainder(dividingBy: Self.sweepDuration) / Self.sweepDuration

            GeometryReader { geometry in
                let width = geometry.size.width
                Color(.tertiarySystemFill)
                    .overlay {
                        LinearGradient(
                            colors: [
                                .clear,
                                Color.white.opacity(0.4),
                                .clear,
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(width: width * 0.55)
                        .offset(x: -width * 0.35 + phase * (width * 1.7))
                    }
            }
        }
    }
}

#Preview("Shimmer") {
    ThumbnailShimmer()
        .padding()
}

#Preview("Shimmer — dark") {
    ThumbnailShimmer()
        .padding()
        .preferredColorScheme(.dark)
}
