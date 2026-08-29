import Foundation
import SwiftData

enum TaskCategory: String, CaseIterable, Identifiable {
    case work = "Work"
    case home = "Home"
    case random = "Random"

    var id: String { rawValue }
    var symbolName: String {
        switch self {
        case .work: "briefcase"
        case .home: "house"
        case .random: "sparkles"
        }
    }
}

enum TaskPriority: String, CaseIterable, Identifiable {
    case high = "High"
    case medium = "Medium"
    case low = "Low"

    var id: String { rawValue }
    var tintName: String {
        switch self {
        case .high: "orange"
        case .medium: "yellow"
        case .low: "green"
        }
    }
}

@Model
final class TodoTask {
    @Attribute(.unique) var id: UUID
    var title: String
    var dueDate: Date?
    var categoryRawValue: String?
    var priorityRawValue: String?
    var isCompleted: Bool
    var createdAt: Date
    var completedAt: Date?

    init(
        id: UUID = UUID(),
        title: String,
        dueDate: Date? = nil,
        category: TaskCategory? = nil,
        priority: TaskPriority? = nil,
        isCompleted: Bool = false,
        createdAt: Date = .now,
        completedAt: Date? = nil
    ) {
        self.id = id
        self.title = title
        self.dueDate = dueDate
        self.categoryRawValue = category?.rawValue
        self.priorityRawValue = priority?.rawValue
        self.isCompleted = isCompleted
        self.createdAt = createdAt
        self.completedAt = completedAt
    }

    var category: TaskCategory? {
        get { categoryRawValue.flatMap(TaskCategory.init(rawValue:)) }
        set { categoryRawValue = newValue?.rawValue }
    }

    var priority: TaskPriority? {
        get { priorityRawValue.flatMap(TaskPriority.init(rawValue:)) }
        set { priorityRawValue = newValue?.rawValue }
    }

    func setCompleted(_ completed: Bool, now: Date = .now) {
        isCompleted = completed
        completedAt = completed ? now : nil
    }

    func isMissed(now: Date = .now) -> Bool {
        guard let dueDate else { return false }
        return !isCompleted && dueDate < now
    }
}

extension TodoTask: Identifiable {}
