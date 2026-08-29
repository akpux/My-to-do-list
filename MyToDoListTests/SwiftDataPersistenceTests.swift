import XCTest
import SwiftData
@testable import MyToDoList

final class SwiftDataPersistenceTests: XCTestCase {
    func testTaskCanBeInsertedAndFetchedFromAnInMemoryStore() throws {
        let configuration = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: TodoTask.self, UserProfile.self, configurations: configuration)
        let context = ModelContext(container)
        context.insert(TodoTask(title: "Persist locally"))
        try context.save()

        let tasks = try context.fetch(FetchDescriptor<TodoTask>())

        XCTAssertEqual(tasks.count, 1)
        XCTAssertEqual(tasks.first?.title, "Persist locally")
    }
}
