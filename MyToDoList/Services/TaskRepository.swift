import SwiftData

@MainActor
struct TaskRepository {
    let modelContext: ModelContext

    func insert(_ task: TodoTask) {
        modelContext.insert(task)
        save()
    }

    func delete(_ task: TodoTask) {
        TaskVisualService.shared.cancel(taskID: task.id)
        modelContext.delete(task)
        save()
    }

    func save() {
        try? modelContext.save()
    }
}

