import SwiftData

@MainActor
struct TaskRepository {
    let modelContext: ModelContext

    func insert(_ task: TodoTask) {
        modelContext.insert(task)
        save()
    }

    func delete(_ task: TodoTask) {
        modelContext.delete(task)
        save()
    }

    func save() {
        try? modelContext.save()
    }
}

