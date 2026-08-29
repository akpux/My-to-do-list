import XCTest

final class MyToDoListUITests: XCTestCase {
    func testLocalOnboardingCanReachTheTaskList() {
        let app = XCUIApplication()
        app.launchArguments = ["-UITesting", "1"]
        app.launch()

        let nameField = app.textFields["welcome.name"]
        XCTAssertTrue(nameField.waitForExistence(timeout: 5))
        nameField.tap()
        nameField.typeText("Avery")
        app.buttons["welcome.continue"].tap()

        XCTAssertTrue(app.buttons["task.add"].waitForExistence(timeout: 5))
    }
}

