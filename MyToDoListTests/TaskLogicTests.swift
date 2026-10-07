import XCTest
@testable import MyToDoList

final class TaskLogicTests: XCTestCase {
    func testTaskBecomesMissedAfterItsDeadline() {
        let now = Date(timeIntervalSinceReferenceDate: 1_000)
        let task = TodoTask(title: "Pay rent", dueDate: now.addingTimeInterval(-60))

        XCTAssertTrue(task.isMissed(now: now))
        task.setCompleted(true, now: now)
        XCTAssertFalse(task.isMissed(now: now))
    }

    func testGroupingUsesCreatedDateNotDeadline() {
        let calendar = Calendar(identifier: .gregorian)
        let now = Date.now
        let yesterday = calendar.date(byAdding: .day, value: -1, to: now)!
        let createdYesterday = TodoTask(title: "Due today", dueDate: now, createdAt: yesterday)
        let addedToday = TodoTask(title: "Added today", createdAt: now)

        let sections = TaskGrouping.sections(
            for: [createdYesterday, addedToday],
            calendar: calendar
        )

        XCTAssertEqual(sections.first(where: { $0.title == "Today" })?.tasks.map(\.title), ["Added today"])
        XCTAssertEqual(sections.first(where: { $0.title == "Yesterday" })?.tasks.map(\.title), ["Due today"])
    }

    func testGroupingMovesOnCompletionAndReinstatement() {
        let calendar = Calendar(identifier: .gregorian)
        let created = Date(timeIntervalSinceReferenceDate: 1_000)
        let completedOn = created.addingTimeInterval(86_400 * 6)
        let reinstatedOn = created.addingTimeInterval(86_400 * 9)
        let task = TodoTask(title: "Pay rent", createdAt: created)

        XCTAssertEqual(
            calendar.startOfDay(for: TaskGrouping.groupingDate(for: task)),
            calendar.startOfDay(for: created)
        )

        task.setCompleted(true, now: completedOn)
        XCTAssertEqual(
            calendar.startOfDay(for: TaskGrouping.groupingDate(for: task)),
            calendar.startOfDay(for: completedOn)
        )

        task.setCompleted(false, now: reinstatedOn)
        XCTAssertEqual(
            calendar.startOfDay(for: TaskGrouping.groupingDate(for: task)),
            calendar.startOfDay(for: reinstatedOn)
        )
    }

    func testPrioritySortPutsHighFirst() {
        let low = TodoTask(title: "Low", priority: .low)
        let high = TodoTask(title: "High", priority: .high)

        let sorted = TaskGrouping.sorted([low, high], by: .priority)

        XCTAssertEqual(sorted.first?.title, "High")
    }
}
