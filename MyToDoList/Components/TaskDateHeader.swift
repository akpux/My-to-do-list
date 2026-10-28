import SwiftUI

/// Widget container date row: caption between two rules, e.g. `12 Aug, Fri`.
struct TaskDateHeader: View {
    let title: String

    var body: some View {
        HStack(spacing: 8) {
            rule
            Text(title)
                .font(.caption.weight(.semibold))
                .foregroundStyle(AppTheme.dateDividerLabel)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
            rule
        }
        .accessibilityElement(children: .combine)
    }

    private var rule: some View {
        Rectangle()
            .fill(AppTheme.dateDividerRule)
            .frame(height: 1)
            .frame(maxWidth: .infinity)
    }
}

#Preview {
    TaskDateHeader(title: "12 Aug, Fri")
        .padding()
        .background(Color(.systemGroupedBackground))
}
