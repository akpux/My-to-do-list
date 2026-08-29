import SwiftData
import SwiftUI

@MainActor
enum PreviewSupport {
    static func container(seed: (ModelContext) -> Void = { _ in }) -> ModelContainer {
        let schema = Schema([TodoTask.self, UserProfile.self])
        let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)
        let container = try! ModelContainer(for: schema, configurations: [configuration])
        seed(container.mainContext)
        return container
    }

    static var empty: ModelContainer {
        container()
    }

    static var populated: ModelContainer {
        container { context in
            insertSampleData(into: context)
        }
    }

    @discardableResult
    static func insertSampleData(into context: ModelContext) -> UserProfile {
        let profile = UserProfile(displayName: "Avery")
        context.insert(profile)

        let pending = TodoTask(
            title: "Plan the week",
            dueDate: .now.addingTimeInterval(3_600),
            category: .work,
            priority: .high
        )
        let home = TodoTask(
            title: "Buy groceries",
            dueDate: .now.addingTimeInterval(86_400),
            category: .home,
            priority: .medium
        )
        let completed = TodoTask(
            title: "Reply to mail",
            dueDate: .now.addingTimeInterval(-7_200),
            category: .random,
            priority: .low,
            isCompleted: true,
            completedAt: .now.addingTimeInterval(-1_800)
        )
        context.insert(pending)
        context.insert(home)
        context.insert(completed)
        return profile
    }

    static func sampleTask(
        title: String = "Plan the week",
        isCompleted: Bool = false
    ) -> (container: ModelContainer, task: TodoTask) {
        var task: TodoTask!
        let container = container { context in
            task = TodoTask(
                title: title,
                dueDate: .now.addingTimeInterval(isCompleted ? -3_600 : 3_600),
                category: .work,
                priority: .high,
                isCompleted: isCompleted,
                completedAt: isCompleted ? .now : nil
            )
            context.insert(task)
        }
        return (container, task)
    }
}
