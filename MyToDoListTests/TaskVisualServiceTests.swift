import XCTest
import SwiftData
@testable import MyToDoList

/// Provider double. Records every call so tests can assert exactly what left the device.
final class MockImageSearch: ImageSearching, @unchecked Sendable {
    private let lock = NSLock()
    private var _searchedQueries: [String] = []
    private var _pingedLocations: [String] = []
    private var _searchResult: Result<[ImageCandidate], Error>
    private var _pingResult: Result<Void, Error> = .success(())
    private var _hold = false

    init(searchResult: Result<[ImageCandidate], Error> = .success([])) {
        _searchResult = searchResult
    }

    var searchedQueries: [String] { lock.withLock { _searchedQueries } }
    var pingedLocations: [String] { lock.withLock { _pingedLocations } }

    var searchResult: Result<[ImageCandidate], Error> {
        get { lock.withLock { _searchResult } }
        set { lock.withLock { _searchResult = newValue } }
    }

    var pingResult: Result<Void, Error> {
        get { lock.withLock { _pingResult } }
        set { lock.withLock { _pingResult = newValue } }
    }

    /// While true, `search` suspends so a test can act while a request is "in flight".
    var holdSearch: Bool {
        get { lock.withLock { _hold } }
        set { lock.withLock { _hold = newValue } }
    }

    func search(query: String) async throws -> [ImageCandidate] {
        lock.withLock { _searchedQueries.append(query) }
        while holdSearch { try await Task.sleep(for: .milliseconds(5)) }
        return try searchResult.get()
    }

    func trackDownload(location: String) async throws {
        lock.withLock { _pingedLocations.append(location) }
        try pingResult.get()
    }
}

@MainActor
final class TaskVisualServiceTests: XCTestCase {
    private var container: ModelContainer!
    private var context: ModelContext!
    private var clock: Date = Date(timeIntervalSinceReferenceDate: 1_000_000)

    override func setUpWithError() throws {
        container = try ModelContainer(
            for: TodoTask.self, UserProfile.self,
            configurations: ModelConfiguration(isStoredInMemoryOnly: true)
        )
        context = ModelContext(container)
    }

    override func tearDown() {
        context = nil
        container = nil
        super.tearDown()
    }

    // MARK: Helpers

    private func candidate(_ id: String, photographer: String = "Jane Doe") -> ImageCandidate {
        ImageCandidate(
            providerPhotoID: id,
            imageURL: "https://images.unsplash.com/\(id)?w=400",
            sourceURL: "https://unsplash.com/photos/\(id)",
            downloadLocation: "https://api.unsplash.com/photos/\(id)/download",
            width: 4000,
            height: 3000,
            altText: "alt \(id)",
            photographerName: photographer,
            photographerURL: "https://unsplash.com/@jane",
            blurHash: "LDDSa5X"
        )
    }

    private func makeService(_ client: ImageSearching?) -> TaskVisualService {
        TaskVisualService(client: client, now: { [unowned self] in clock })
    }

    @discardableResult
    private func makeTask(_ title: String, category: TaskCategory? = .home) throws -> TodoTask {
        let task = TodoTask(title: title, category: category)
        context.insert(task)
        try context.save()
        return task
    }

    private func resolve(_ service: TaskVisualService, _ task: TodoTask) async {
        await service.resolveIfNeeded(for: task, in: context)?.value
    }

    private func waitUntil(_ condition: @autoclosure () -> Bool, file: StaticString = #filePath, line: UInt = #line) async {
        for _ in 0..<400 where !condition() { try? await Task.sleep(for: .milliseconds(5)) }
        XCTAssertTrue(condition(), "timed out waiting", file: file, line: line)
    }

    private func allTasks() throws -> [TodoTask] {
        try context.fetch(FetchDescriptor<TodoTask>())
    }

    // MARK: - Happy path

    func testResolvePersistsThePhotoAndPingsExactlyOnce() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries for dinner")

        let work = service.resolveIfNeeded(for: task, in: context)
        XCTAssertEqual(task.visualStatus, .pending, "pending until the search returns")
        await work?.value

        XCTAssertEqual(mock.searchedQueries, ["grocery shopping vegetables"])
        XCTAssertEqual(mock.pingedLocations, ["https://api.unsplash.com/photos/p1/download"])
        XCTAssertEqual(task.visualStatus, .ready)
        XCTAssertEqual(task.visualProvider, "unsplash")
        XCTAssertEqual(task.visualQuery, "grocery shopping vegetables")
        XCTAssertEqual(task.visualQueryVersion, VisualQueryBuilder.version)
        XCTAssertEqual(task.visualPhotoID, "p1")
        XCTAssertEqual(task.visualImageURL, "https://images.unsplash.com/p1?w=400")
        XCTAssertEqual(task.visualSourceURL, "https://unsplash.com/photos/p1")
        XCTAssertEqual(task.visualDownloadLocation, "https://api.unsplash.com/photos/p1/download")
        XCTAssertEqual(task.visualPhotographerName, "Jane Doe")
        XCTAssertEqual(task.visualPhotographerURL, "https://unsplash.com/@jane")
        XCTAssertEqual(task.visualAlt, "alt p1")
        XCTAssertEqual(task.visualBlurHash, "LDDSa5X")
        XCTAssertNotNil(task.visualFetchedAt)
        XCTAssertTrue(task.hasReadyVisual)
    }

    func testOnlyTheQueryLeavesTheDeviceNeverTheTitle() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let task = try makeTask("Buy groceries for dinner at Zorblax Market")

        await resolve(makeService(mock), task)

        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertFalse(mock.searchedQueries[0].lowercased().contains("zorblax"))
        XCTAssertFalse(task.visualQuery?.lowercased().contains("zorblax") ?? false)
    }

    // MARK: - Privacy

    func testSensitiveTitleMakesZeroProviderCalls() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Discuss medication with my doctor")

        let work = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(work, "no request may even be started")
        XCTAssertTrue(mock.searchedQueries.isEmpty)
        XCTAssertTrue(mock.pingedLocations.isEmpty)
        XCTAssertEqual(task.visualStatus, .privacyBlocked)
        XCTAssertNil(task.visualQuery)
        XCTAssertNil(task.visualImageURL)
    }

    func testEditingATitleIntoSensitiveClearsThePhotoWithoutNetwork() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)
        XCTAssertEqual(task.visualStatus, .ready)

        task.title = "Therapy appointment"
        let work = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(work)
        XCTAssertEqual(mock.searchedQueries.count, 1, "no second request")
        XCTAssertEqual(task.visualStatus, .privacyBlocked)
        XCTAssertNil(task.visualImageURL)
        XCTAssertNil(task.visualPhotographerName)
        XCTAssertNil(VisualAttribution(task: task))
    }

    // MARK: - Empty results

    func testNoUsableCandidatesRecordsNoResultsAndNeverPings() async throws {
        let tiny = ImageCandidate(
            providerPhotoID: "tiny", imageURL: "https://images.unsplash.com/t", sourceURL: nil,
            downloadLocation: "https://api.unsplash.com/photos/tiny/download", width: 10, height: 10,
            altText: nil, photographerName: "Jane", photographerURL: nil, blurHash: nil
        )
        let mock = MockImageSearch(searchResult: .success([tiny]))
        let task = try makeTask("Buy groceries")

        await resolve(makeService(mock), task)

        XCTAssertEqual(task.visualStatus, .noResults)
        XCTAssertEqual(task.visualQuery, "grocery shopping vegetables")
        XCTAssertNil(task.visualImageURL)
        XCTAssertTrue(mock.pingedLocations.isEmpty)
    }

    func testNoResultsIsNotRetriedForTheSameQuery() async throws {
        let mock = MockImageSearch(searchResult: .success([]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)

        let again = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(again)
        XCTAssertEqual(mock.searchedQueries.count, 1)
    }

    // MARK: - Failures never block the task

    func testServerFailureLeavesTheTaskSavedWithFallback() async throws {
        let mock = MockImageSearch(searchResult: .failure(ImageSearchError.server(500)))
        let task = try makeTask("Buy groceries")

        await resolve(makeService(mock), task)

        XCTAssertEqual(task.visualStatus, .fallback)
        XCTAssertEqual(try allTasks().map(\.title), ["Buy groceries"])
        XCTAssertNil(VisualAttribution(task: task))
    }

    func testOfflineFailureFallsBack() async throws {
        let mock = MockImageSearch(searchResult: .failure(ImageSearchError.network))
        let task = try makeTask("Buy groceries")

        await resolve(makeService(mock), task)

        XCTAssertEqual(task.visualStatus, .fallback)
    }

    func testFallbackIsRetriedOnTheNextEditorSave() async throws {
        let mock = MockImageSearch(searchResult: .failure(ImageSearchError.network))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)
        XCTAssertEqual(task.visualStatus, .fallback)

        mock.searchResult = .success([candidate("p1")])
        await resolve(service, task)

        XCTAssertEqual(task.visualStatus, .ready)
        XCTAssertEqual(mock.searchedQueries.count, 2)
    }

    func testFailedPingStillPersistsThePhoto() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        mock.pingResult = .failure(ImageSearchError.network)
        let task = try makeTask("Buy groceries")

        await resolve(makeService(mock), task)

        XCTAssertEqual(task.visualStatus, .ready)
        XCTAssertEqual(mock.pingedLocations.count, 1, "attempted once, not looped")
    }

    func testFailureKeepsThePreviousReadyPhoto() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)

        task.title = "Morning run"
        mock.searchResult = .failure(ImageSearchError.network)
        await resolve(service, task)

        XCTAssertEqual(task.visualStatus, .ready)
        XCTAssertEqual(task.visualPhotoID, "p1")
        XCTAssertEqual(task.visualQuery, "grocery shopping vegetables", "stale query means the next save retries")
    }

    // MARK: - Quota and key (FRD §9)

    func testQuotaExhaustionEntersCooldownAndDoesNotLoop() async throws {
        let mock = MockImageSearch(searchResult: .failure(ImageSearchError.quotaExhausted))
        let service = makeService(mock)
        let first = try makeTask("Buy groceries")
        await resolve(service, first)
        XCTAssertEqual(first.visualStatus, .fallback)
        XCTAssertEqual(mock.searchedQueries.count, 1)

        let second = try makeTask("Morning run")
        let work = service.resolveIfNeeded(for: second, in: context)

        XCTAssertNil(work, "inside the cooldown no request is made")
        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertEqual(second.visualStatus, .fallback)

        // After the cooldown the service searches again.
        clock = clock.addingTimeInterval(TaskVisualService.quotaCooldown + 1)
        mock.searchResult = .success([candidate("p9")])
        await resolve(service, second)
        XCTAssertEqual(mock.searchedQueries.count, 2)
        XCTAssertEqual(second.visualStatus, .ready)
    }

    func testRejectedKeyStopsFurtherCallsAndMarksSkippedNoKey() async throws {
        let mock = MockImageSearch(searchResult: .failure(ImageSearchError.invalidKey))
        let service = makeService(mock)
        let first = try makeTask("Buy groceries")
        await resolve(service, first)
        XCTAssertEqual(first.visualStatus, .skippedNoKey)

        let second = try makeTask("Morning run")
        let work = service.resolveIfNeeded(for: second, in: context)

        XCTAssertNil(work)
        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertEqual(second.visualStatus, .skippedNoKey)
    }

    func testMissingKeyNeverTouchesTheNetwork() throws {
        let service = makeService(nil)
        let task = try makeTask("Buy groceries")

        let work = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(work)
        XCTAssertEqual(task.visualStatus, .skippedNoKey)
        XCTAssertEqual(try allTasks().count, 1, "the task itself is unaffected")
    }

    // MARK: - Refetch rules (FRD §7)

    func testCosmeticTitleEditKeepsThePhotoAndCostsNoRequest() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)

        task.title = "Buy groceries today"
        let work = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(work)
        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertEqual(task.visualPhotoID, "p1")
    }

    func testChangingTheMeaningOfTheTitleRefetches() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)

        task.title = "Morning run"
        mock.searchResult = .success([candidate("run1")])
        await resolve(service, task)

        XCTAssertEqual(mock.searchedQueries, ["grocery shopping vegetables", "fitness workout gym"])
        XCTAssertEqual(task.visualPhotoID, "run1")
        XCTAssertEqual(task.visualQuery, "fitness workout gym")
        XCTAssertEqual(mock.pingedLocations.count, 2, "one ping per selection")
    }

    func testChangingCategoryRefetchesWhenItChangesTheQuery() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Sort it out", category: .work)
        await resolve(service, task)
        XCTAssertEqual(task.visualQuery, "office desk workspace")

        task.category = .home
        mock.searchResult = .success([candidate("h1")])
        await resolve(service, task)

        XCTAssertEqual(task.visualQuery, "home interior living")
        XCTAssertEqual(task.visualPhotoID, "h1")
    }

    func testResavingAnUnchangedReadyTaskMakesNoRequest() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")
        await resolve(service, task)

        task.dueDate = .now.addingTimeInterval(3_600)
        task.priority = .high
        XCTAssertNil(service.resolveIfNeeded(for: task, in: context))
        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertEqual(mock.pingedLocations.count, 1)
    }

    // MARK: - In flight

    func testASecondSaveWhileSearchingDoesNotDuplicateTheRequest() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        mock.holdSearch = true
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")

        let first = service.resolveIfNeeded(for: task, in: context)
        await waitUntil(mock.searchedQueries.count == 1)
        let second = service.resolveIfNeeded(for: task, in: context)

        XCTAssertNil(second)
        mock.holdSearch = false
        await first?.value
        XCTAssertEqual(mock.searchedQueries.count, 1)
        XCTAssertEqual(task.visualStatus, .ready)
    }

    func testDeletingATaskMidFlightWritesNothingAndDoesNotCrash() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        mock.holdSearch = true
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")

        let work = service.resolveIfNeeded(for: task, in: context)
        await waitUntil(mock.searchedQueries.count == 1)

        context.delete(task)
        try context.save()
        mock.holdSearch = false
        await work?.value

        XCTAssertTrue(try allTasks().isEmpty)
        XCTAssertTrue(mock.pingedLocations.isEmpty, "a deleted task must not be pinged for")
    }

    func testCancelStopsInFlightWork() async throws {
        let mock = MockImageSearch(searchResult: .success([candidate("p1")]))
        mock.holdSearch = true
        let service = makeService(mock)
        let task = try makeTask("Buy groceries")

        let work = service.resolveIfNeeded(for: task, in: context)
        await waitUntil(mock.searchedQueries.count == 1)
        service.cancel(taskID: task.id)
        mock.holdSearch = false
        await work?.value

        XCTAssertNotEqual(task.visualStatus, .ready)
        XCTAssertTrue(mock.pingedLocations.isEmpty)
        XCTAssertNil(task.visualImageURL)
    }

    func testRepositoryDeleteRemovesTheTask() throws {
        let task = try makeTask("Buy groceries")

        // Also cancels any in-flight visual work for the task via the shared service (a no-op here).
        TaskRepository(modelContext: context).delete(task)

        XCTAssertTrue(try allTasks().isEmpty)
    }
}

// MARK: - Policy

final class VisualRefreshPolicyTests: XCTestCase {
    private func query(_ title: String, _ category: TaskCategory? = nil) -> VisualQuery {
        VisualQueryBuilder.build(title: title, category: category)
    }

    private func action(
        _ status: TaskVisualStatus,
        stored: String? = nil,
        title: String = "Buy groceries",
        hasKey: Bool = true
    ) -> VisualRefreshAction {
        VisualRefreshPolicy.action(status: status, storedQuery: stored, newQuery: query(title), hasKey: hasKey)
    }

    func testNeverAttemptedFetches() {
        XCTAssertEqual(action(.idle), .fetch)
    }

    func testStalePendingFetchesAgain() {
        XCTAssertEqual(action(.pending), .fetch)
    }

    func testReadyOnlyRefetchesWhenTheQueryChanges() {
        XCTAssertEqual(action(.ready, stored: "grocery shopping vegetables"), .none)
        XCTAssertEqual(action(.ready, stored: "fitness workout gym"), .fetch)
    }

    func testNoResultsOnlyRefetchesWhenTheQueryChanges() {
        XCTAssertEqual(action(.noResults, stored: "grocery shopping vegetables"), .none)
        XCTAssertEqual(action(.noResults, stored: "fitness workout gym"), .fetch)
    }

    func testTransientFallbackRetries() {
        XCTAssertEqual(action(.fallback, stored: "grocery shopping vegetables"), .fetch)
    }

    func testSkippedNoKeyRetriesOnlyOnceAKeyExists() {
        XCTAssertEqual(action(.skippedNoKey, hasKey: false), .none)
        XCTAssertEqual(action(.skippedNoKey, hasKey: true), .fetch)
    }

    func testSensitiveTitlesNeverFetch() {
        for status in [TaskVisualStatus.idle, .pending, .ready, .fallback, .noResults, .skippedNoKey] {
            XCTAssertEqual(action(status, title: "Therapy appointment"), .markPrivacyBlocked, "\(status)")
        }
        XCTAssertEqual(action(.privacyBlocked, title: "Therapy appointment"), .none)
    }

    func testPrivacyBlockedFetchesOnceTheTitleIsSafe() {
        XCTAssertEqual(action(.privacyBlocked, title: "Buy groceries"), .fetch)
    }

    func testEmptyTitleNeverFetches() {
        XCTAssertEqual(action(.idle, title: "   "), .none)
    }
}

// MARK: - Persistence

final class TaskVisualPersistenceTests: XCTestCase {
    private func makeContext() throws -> (ModelContainer, ModelContext) {
        let container = try ModelContainer(
            for: TodoTask.self, UserProfile.self,
            configurations: ModelConfiguration(isStoredInMemoryOnly: true)
        )
        return (container, ModelContext(container))
    }

    func testVisualFieldsRoundTripThroughSwiftData() throws {
        let (container, context) = try makeContext()
        let fetchedAt = Date(timeIntervalSinceReferenceDate: 12_345)
        let task = TodoTask(title: "Buy groceries", category: .home)
        task.visualProvider = "unsplash"
        task.visualQuery = "grocery shopping vegetables"
        task.visualQueryVersion = 1
        task.visualPhotoID = "p1"
        task.visualImageURL = "https://images.unsplash.com/p1?w=400"
        task.visualSourceURL = "https://unsplash.com/photos/p1"
        task.visualDownloadLocation = "https://api.unsplash.com/photos/p1/download"
        task.visualPhotographerName = "Jane Doe"
        task.visualPhotographerURL = "https://unsplash.com/@jane"
        task.visualAlt = "bunch of vegetables"
        task.visualBlurHash = "LDDSa5X"
        task.visualStatus = .ready
        task.visualFetchedAt = fetchedAt
        context.insert(task)
        try context.save()

        let reloaded = try XCTUnwrap(ModelContext(container).fetch(FetchDescriptor<TodoTask>()).first)

        XCTAssertEqual(reloaded.visualProvider, "unsplash")
        XCTAssertEqual(reloaded.visualQuery, "grocery shopping vegetables")
        XCTAssertEqual(reloaded.visualQueryVersion, 1)
        XCTAssertEqual(reloaded.visualPhotoID, "p1")
        XCTAssertEqual(reloaded.visualImageURL, "https://images.unsplash.com/p1?w=400")
        XCTAssertEqual(reloaded.visualSourceURL, "https://unsplash.com/photos/p1")
        XCTAssertEqual(reloaded.visualDownloadLocation, "https://api.unsplash.com/photos/p1/download")
        XCTAssertEqual(reloaded.visualPhotographerName, "Jane Doe")
        XCTAssertEqual(reloaded.visualPhotographerURL, "https://unsplash.com/@jane")
        XCTAssertEqual(reloaded.visualAlt, "bunch of vegetables")
        XCTAssertEqual(reloaded.visualBlurHash, "LDDSa5X")
        XCTAssertEqual(reloaded.visualStatus, .ready)
        XCTAssertEqual(reloaded.visualFetchedAt, fetchedAt)
        XCTAssertTrue(reloaded.hasReadyVisual)
    }

    func testATaskWithNoVisualFieldsReadsBackAsIdle() throws {
        let (container, context) = try makeContext()
        context.insert(TodoTask(title: "Plain task"))
        try context.save()

        let reloaded = try XCTUnwrap(ModelContext(container).fetch(FetchDescriptor<TodoTask>()).first)

        XCTAssertEqual(reloaded.visualStatus, .idle)
        XCTAssertEqual(reloaded.visualQueryVersion, 0)
        XCTAssertNil(reloaded.visualImageURL)
        XCTAssertNil(reloaded.visualQuery)
        XCTAssertFalse(reloaded.hasReadyVisual)
    }

    func testUnknownStatusRawValueDegradesToIdleInsteadOfCrashing() {
        let task = TodoTask(title: "Future task")
        task.visualStatusRaw = "someStatusFromANewerApp"

        XCTAssertEqual(task.visualStatus, .idle)
    }

    func testReadyWithoutAnImageURLIsNotDrawn() {
        let task = TodoTask(title: "Broken")
        task.visualStatus = .ready

        XCTAssertFalse(task.hasReadyVisual)
    }
}
