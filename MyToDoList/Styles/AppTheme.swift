import SwiftUI

enum AppTheme {
    static let accent = Color(red: 142 / 255, green: 31 / 255, blue: 253 / 255)
    static let subtleAccent = Color(red: 243 / 255, green: 240 / 255, blue: 1)
    /// Icon button well on empty state / funnel (`235, 229, 255`).
    static let iconButtonFill = Color(red: 235 / 255, green: 229 / 255, blue: 255 / 255)
    static let cardBorder = Color(uiColor: .separator).opacity(0.45)
    static let priorityHigh = Color(red: 199 / 255, green: 117 / 255, blue: 1 / 255)
    static let priorityMedium = Color(red: 187 / 255, green: 149 / 255, blue: 0 / 255)
    /// Figma `color/text/textsecondary` — Task row Edit label (`#3C3C43`).
    static let textSecondary = Color(red: 60 / 255, green: 60 / 255, blue: 67 / 255)
    /// Widget container date label (`#434144`).
    static let dateDividerLabel = Color(red: 67 / 255, green: 65 / 255, blue: 68 / 255)
    /// Widget container date rule (`#A1A1A1`).
    static let dateDividerRule = Color(red: 161 / 255, green: 161 / 255, blue: 161 / 255)

    /// HUI segmented control `113:3241`: track inset 2, segment padding 8 / 6, gap 4.
    static let segmentedControlHeight: CGFloat = 38
    /// Page inset around the control (parent frame padding).
    static let segmentedControlPageInset: CGFloat = 12
    /// Space from the segmented control to the date divider.
    static let taskListSectionGap: CGFloat = 16

    static func priorityColor(for priority: TaskPriority?) -> Color {
        switch priority {
        case .high: priorityHigh
        case .medium: priorityMedium
        case .low, nil: Color.primary
        }
    }
}

extension Date {
    /// Task row due line: `15 Oct 2026, 12:23 AM` (comma between date and time, never “at”).
    var taskRowDueDateTimeText: String {
        let datePart = formatted(.dateTime.day().month(.abbreviated).year())
        let timePart = formatted(date: .omitted, time: .shortened)
        return "\(datePart), \(timePart)"
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

