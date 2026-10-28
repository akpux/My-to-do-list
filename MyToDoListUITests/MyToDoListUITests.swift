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

    /// Task creation must never depend on the image provider. `-UITesting` gives the visuals service no
    /// client, so this proves a task still saves and shows its title with the category-symbol fallback.
    func testCreatingATaskWorksWithoutAnyImageProvider() {
        let app = XCUIApplication()
        app.launchArguments = ["-UITesting", "1"]
        app.launch()

        let nameField = app.textFields["welcome.name"]
        XCTAssertTrue(nameField.waitForExistence(timeout: 5))
        nameField.tap()
        nameField.typeText("Avery")
        app.buttons["welcome.continue"].tap()

        let add = app.buttons["task.add"]
        XCTAssertTrue(add.waitForExistence(timeout: 5))
        add.tap()

        let title = app.textFields["task.title"]
        XCTAssertTrue(title.waitForExistence(timeout: 5))
        title.tap()
        title.typeText("Buy groceries for dinner")

        let save = app.buttons["task.save"]
        XCTAssertTrue(save.isEnabled)
        save.tap()

        XCTAssertTrue(app.staticTexts["Buy groceries for dinner"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.buttons["task.add"].exists, "list chrome is intact after saving")
    }
}

