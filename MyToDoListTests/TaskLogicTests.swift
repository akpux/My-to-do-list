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

    func testGroupingUsesTodayYesterdayAndNoDeadline() {
        let calendar = Calendar(identifier: .gregorian)
        let now = Date.now
        let datedTask = TodoTask(title: "Today", dueDate: now)
        let unscheduledTask = TodoTask(title: "Later")

        let sections = TaskGrouping.sections(for: [datedTask, unscheduledTask], calendar: calendar)

        XCTAssertTrue(sections.contains(where: { $0.title == "Today" }))
        XCTAssertTrue(sections.contains(where: { $0.title == "No deadline" }))
    }

    func testPrioritySortPutsHighFirst() {
        let low = TodoTask(title: "Low", priority: .low)
        let high = TodoTask(title: "High", priority: .high)

        let sorted = TaskGrouping.sorted([low, high], by: .priority)

        XCTAssertEqual(sorted.first?.title, "High")
    }
}
