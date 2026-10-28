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

/// Lifecycle of a task's stock photo (FRD §7). Anything other than `.ready` renders the category symbol.
enum TaskVisualStatus: String {
    /// Never attempted. Every task created before visuals existed reads back as this.
    case idle
    /// A fetch is in flight and there is no earlier photo to keep showing.
    case pending
    /// Image URL and attribution are stored.
    case ready
    /// Transient failure: offline, timeout, 5xx, or quota exhausted.
    case fallback
    /// Access key missing, empty, or rejected.
    case skippedNoKey
    /// The sensitivity gate matched; the provider was never called.
    case privacyBlocked
    /// The search worked but no usable candidate remained.
    case noResults
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
    /// Calendar day the card belongs under; bumps when the task is created, completed, or reinstated.
    var groupedAt: Date?

    // MARK: Task visual (FRD §7). Optional or defaulted so existing stores migrate lightly.
    var visualProvider: String?
    /// The query that produced the stored photo (or that was blocked / empty). Never the raw title.
    var visualQuery: String?
    var visualQueryVersion: Int = 0
    var visualPhotoID: String?
    /// Unsplash `urls.small`, hotlinked. Never downloaded or re-hosted.
    var visualImageURL: String?
    var visualSourceURL: String?
    /// Kept so the one-time download ping is never repeated for the same selection.
    var visualDownloadLocation: String?
    var visualPhotographerName: String?
    var visualPhotographerURL: String?
    var visualAlt: String?
    var visualBlurHash: String?
    var visualStatusRaw: String = TaskVisualStatus.idle.rawValue
    var visualFetchedAt: Date?

    init(
        id: UUID = UUID(),
        title: String,
        dueDate: Date? = nil,
        category: TaskCategory? = nil,
        priority: TaskPriority? = nil,
        isCompleted: Bool = false,
        createdAt: Date = .now,
        completedAt: Date? = nil,
        groupedAt: Date? = nil
    ) {
        self.id = id
        self.title = title
        self.dueDate = dueDate
        self.categoryRawValue = category?.rawValue
        self.priorityRawValue = priority?.rawValue
        self.isCompleted = isCompleted
        self.createdAt = createdAt
        self.completedAt = completedAt
        self.groupedAt = groupedAt ?? (isCompleted ? (completedAt ?? createdAt) : createdAt)
    }

    var category: TaskCategory? {
        get { categoryRawValue.flatMap(TaskCategory.init(rawValue:)) }
        set { categoryRawValue = newValue?.rawValue }
    }

    var priority: TaskPriority? {
        get { priorityRawValue.flatMap(TaskPriority.init(rawValue:)) }
        set { priorityRawValue = newValue?.rawValue }
    }

    var visualStatus: TaskVisualStatus {
        get { TaskVisualStatus(rawValue: visualStatusRaw) ?? .idle }
        set { visualStatusRaw = newValue.rawValue }
    }

    /// True only when a photo can actually be drawn and credited.
    var hasReadyVisual: Bool {
        visualStatus == .ready && visualImageURL != nil
    }

    func setCompleted(_ completed: Bool, now: Date = .now) {
        isCompleted = completed
        completedAt = completed ? now : nil
        groupedAt = now
    }

    /// Day the list header uses: last create / complete / reinstate, never the deadline.
    var listingDate: Date {
        groupedAt ?? (isCompleted ? (completedAt ?? createdAt) : createdAt)
    }

    func isMissed(now: Date = .now) -> Bool {
        guard let dueDate else { return false }
        return !isCompleted && dueDate < now
    }
}

extension TodoTask: Identifiable {}
