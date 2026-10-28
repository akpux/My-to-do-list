import Foundation

enum TaskSort: String, CaseIterable, Identifiable {
    case created = "Recently added"
    case deadline = "Deadline"
    case category = "Task type"
    case missed = "Missed"
    case priority = "Priority"

    var id: String { rawValue }
    var symbolName: String {
        switch self {
        case .created: "clock.arrow.circlepath"
        case .deadline: "calendar"
        case .category: "tag"
        case .missed: "exclamationmark.triangle"
        case .priority: "flag"
        }
    }
}

struct TaskSection: Identifiable {
    let id: String
    let title: String
    let tasks: [TodoTask]
}

enum TaskGrouping {
    static func sorted(_ tasks: [TodoTask], by sort: TaskSort, now: Date = .now) -> [TodoTask] {
        tasks.sorted { lhs, rhs in
            switch sort {
            case .created:
                return lhs.createdAt > rhs.createdAt
            case .deadline:
                return (lhs.dueDate ?? .distantFuture) < (rhs.dueDate ?? .distantFuture)
            case .category:
                return (lhs.category?.rawValue ?? "ZZZ") < (rhs.category?.rawValue ?? "ZZZ")
            case .missed:
                if lhs.isMissed(now: now) != rhs.isMissed(now: now) {
                    return lhs.isMissed(now: now)
                }
                return (lhs.dueDate ?? .distantFuture) < (rhs.dueDate ?? .distantFuture)
            case .priority:
                return priorityRank(lhs.priority) < priorityRank(rhs.priority)
            }
        }
    }

    static func sections(for tasks: [TodoTask], calendar: Calendar = .autoupdatingCurrent) -> [TaskSection] {
        let grouped = Dictionary(grouping: tasks) { task in
            calendar.startOfDay(for: groupingDate(for: task))
        }

        return grouped.map { date, tasks in
            TaskSection(
                id: date.ISO8601Format(),
                title: sectionTitle(for: date, calendar: calendar),
                tasks: tasks
            )
        }
        .sorted { lhs, rhs in lhs.id > rhs.id }
    }

    /// Created day for pending cards; completion/reinstatement day after a status change.
    static func groupingDate(for task: TodoTask) -> Date {
        task.listingDate
    }

    /// Widget container date label: `12 Aug, Fri`.
    static func sectionTitle(for date: Date, calendar: Calendar = .autoupdatingCurrent) -> String {
        let day = calendar.startOfDay(for: date)
        let dayMonth = day.formatted(.dateTime.day().month(.abbreviated))
        let weekday = day.formatted(.dateTime.weekday(.abbreviated))
        return "\(dayMonth), \(weekday)"
    }

    private static func priorityRank(_ priority: TaskPriority?) -> Int {
        switch priority {
        case .high: 0
        case .medium: 1
        case .low: 2
        case nil: 3
        }
    }
}

