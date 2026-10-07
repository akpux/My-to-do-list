import SwiftUI

enum AppTheme {
    static let accent = Color(red: 142 / 255, green: 31 / 255, blue: 253 / 255)
    static let subtleAccent = Color(red: 243 / 255, green: 240 / 255, blue: 1)
    /// Icon button well on empty state / funnel (`235, 229, 255`).
    static let iconButtonFill = Color(red: 235 / 255, green: 229 / 255, blue: 255 / 255)
    static let cardBorder = Color(uiColor: .separator).opacity(0.45)
    static let priorityHigh = Color(red: 199 / 255, green: 117 / 255, blue: 1 / 255)
    static let priorityMedium = Color(red: 187 / 255, green: 149 / 255, blue: 0 / 255)

    /// HUI segmented control `113:3241`: track inset 2, segment padding 8 / 6, gap 4.
    static let segmentedControlHeight: CGFloat = 38
    /// Page inset around the control (parent frame padding).
    static let segmentedControlPageInset: CGFloat = 12

    static func priorityColor(for priority: TaskPriority?) -> Color {
        switch priority {
        case .high: priorityHigh
        case .medium: priorityMedium
        case .low, nil: Color.primary
        }
    }
}

extension View {
    func appPrimaryButton() -> some View {
        font(.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(AppTheme.accent, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

