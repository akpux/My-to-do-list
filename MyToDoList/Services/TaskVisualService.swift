import Foundation
import SwiftData

enum VisualRefreshAction: Equatable {
    /// Nothing to do.
    case none
    /// Run the pipeline: search, select, ping, persist.
    case fetch
    /// The title became sensitive. Drop any photo and record `privacyBlocked`. No network.
    case markPrivacyBlocked
}

/// Decides whether a save should touch the network (FRD §7 "Refetch when / Retry when").
/// Pure, so the rules are unit tested without SwiftData or a network.
enum VisualRefreshPolicy {
    static func action(
        status: TaskVisualStatus,
        storedQuery: String?,
        newQuery: VisualQuery,
        hasKey: Bool
    ) -> VisualRefreshAction {
        if newQuery.isSensitive {
            return status == .privacyBlocked ? .none : .markPrivacyBlocked
        }
        // Empty title: nothing to search. The editor does not allow saving one anyway.
        guard newQuery.shouldSearch else { return .none }

        switch status {
        case .idle, .pending, .fallback, .privacyBlocked:
            // `pending` here means an earlier request never finished (for example the app was killed).
            // `fallback` is a transient failure and gets one retry on the next editor save.
            return .fetch
        case .ready, .noResults:
            // The derived query is what matters, so cosmetic title edits keep the same photo.
            // This also covers a newer `visualQueryVersion` producing a different query.
            return storedQuery == newQuery.query ? .none : .fetch
        case .skippedNoKey:
            return hasKey ? .fetch : .none
        }
    }
}

/// Orchestrates privacy -> search -> filter -> pick -> download ping -> persist (FRD §5).
///
/// Called from the editor save path, never from a view body. A failure here can only change the
/// task's visual fields; it can never fail or delay saving the task itself.
@MainActor
final class TaskVisualService {
    /// Production instance. UI tests (`-UITesting`) get no client so they never reach the network.
    static let shared: TaskVisualService = {
        let isUITesting = ProcessInfo.processInfo.arguments.contains("-UITesting")
        return TaskVisualService(client: isUITesting ? nil : UnsplashClient.fromBundle())
    }()

    /// After quota exhaustion, do not search again for this long (Unsplash demo quota is hourly).
    static let quotaCooldown: TimeInterval = 60 * 60

    private let client: ImageSearching?
    private let now: () -> Date
    private var inFlight: [UUID: (query: String, task: Task<Void, Never>)] = [:]
    private var quotaCooldownUntil: Date?
    private var keyRejected = false

    init(client: ImageSearching?, now: @escaping () -> Date = { .now }) {
        self.client = client
        self.now = now
    }

    private var hasKey: Bool { client != nil && !keyRejected }

    /// Decide and, if needed, start resolving a visual. Returns the background task (nil when no
    /// request was started) so tests can await it. Callers normally ignore it.
    @discardableResult
    func resolveIfNeeded(for task: TodoTask, in context: ModelContext) -> Task<Void, Never>? {
        let taskID = task.id
        let newQuery = VisualQueryBuilder.build(title: task.title, category: task.category)

        // An in-flight request for the same query is already doing this work.
        if let existing = inFlight[taskID], existing.query == newQuery.query { return nil }

        let action = VisualRefreshPolicy.action(
            status: task.visualStatus,
            storedQuery: task.visualQuery,
            newQuery: newQuery,
            hasKey: hasKey
        )

        switch action {
        case .none:
            return nil

        case .markPrivacyBlocked:
            cancel(taskID: taskID)
            clearPhoto(on: task)
            task.visualQuery = nil
            task.visualQueryVersion = VisualQueryBuilder.version
            task.visualStatus = .privacyBlocked
            task.visualFetchedAt = now()
            save(context)
            return nil

        case .fetch:
            guard let client, !keyRejected else {
                if !task.hasReadyVisual { task.visualStatus = .skippedNoKey }
                save(context)
                return nil
            }
            if let until = quotaCooldownUntil, now() < until {
                if !task.hasReadyVisual { task.visualStatus = .fallback }
                save(context)
                return nil
            }

            cancel(taskID: taskID)
            // Keep showing an earlier photo while a refetch runs; only show `pending` when there is none.
            if !task.hasReadyVisual { task.visualStatus = .pending }
            save(context)

            let query = newQuery.query
            let work = Task { [weak self] in
                guard let self else { return }
                await self.run(taskID: taskID, query: query, client: client, context: context)
            }
            inFlight[taskID] = (query, work)
            return work
        }
    }

    /// Cancels any in-flight work for a task, for example when it is deleted.
    func cancel(taskID: UUID) {
        inFlight[taskID]?.task.cancel()
        inFlight[taskID] = nil
    }

    // MARK: - Pipeline

    private func run(taskID: UUID, query: String, client: ImageSearching, context: ModelContext) async {
        defer {
            // Only clear our own entry; a newer request may have replaced it.
            if inFlight[taskID]?.query == query { inFlight[taskID] = nil }
        }

        do {
            let candidates = try await client.search(query: query)
            guard !Task.isCancelled else { return }

            // Never hold a model across an await: re-fetch, so a task deleted mid-flight is simply gone.
            guard let task = fetchTask(id: taskID, in: context) else { return }

            guard let selected = PhotoSelector.select(taskID: taskID, query: query, from: candidates) else {
                // The new query produced nothing usable, so the old photo no longer matches the title.
                clearPhoto(on: task)
                task.visualQuery = query
                task.visualQueryVersion = VisualQueryBuilder.version
                task.visualStatus = .noResults
                task.visualFetchedAt = now()
                save(context)
                return
            }

            // Required by Unsplash: exactly one ping per selection. A failed ping never blocks the photo.
            if let location = selected.downloadLocation {
                try? await client.trackDownload(location: location)
            }
            guard !Task.isCancelled, let task = fetchTask(id: taskID, in: context) else { return }

            task.visualProvider = "unsplash"
            task.visualQuery = query
            task.visualQueryVersion = VisualQueryBuilder.version
            task.visualPhotoID = selected.providerPhotoID
            task.visualImageURL = selected.imageURL
            task.visualSourceURL = selected.sourceURL
            task.visualDownloadLocation = selected.downloadLocation
            task.visualPhotographerName = selected.photographerName
            task.visualPhotographerURL = selected.photographerURL
            task.visualAlt = selected.altText
            task.visualBlurHash = selected.blurHash
            task.visualStatus = .ready
            task.visualFetchedAt = now()
            save(context)
        } catch is CancellationError {
            return
        } catch {
            guard !Task.isCancelled, let task = fetchTask(id: taskID, in: context) else { return }
            handleFailure(error, for: task, in: context)
        }
    }

    /// Failures never remove an earlier photo. They only record why a new one is missing.
    private func handleFailure(_ error: Error, for task: TodoTask, in context: ModelContext) {
        let keep = task.hasReadyVisual
        switch error as? ImageSearchError {
        case .invalidKey?:
            keyRejected = true
            if !keep { task.visualStatus = .skippedNoKey }
        case .quotaExhausted?:
            quotaCooldownUntil = now().addingTimeInterval(Self.quotaCooldown)
            if !keep { task.visualStatus = .fallback }
        default:
            if !keep { task.visualStatus = .fallback }
        }
        if !keep { task.visualFetchedAt = now() }
        save(context)
    }

    // MARK: - Helpers

    private func clearPhoto(on task: TodoTask) {
        task.visualProvider = nil
        task.visualPhotoID = nil
        task.visualImageURL = nil
        task.visualSourceURL = nil
        task.visualDownloadLocation = nil
        task.visualPhotographerName = nil
        task.visualPhotographerURL = nil
        task.visualAlt = nil
        task.visualBlurHash = nil
    }

    private func fetchTask(id: UUID, in context: ModelContext) -> TodoTask? {
        var descriptor = FetchDescriptor<TodoTask>(predicate: #Predicate { $0.id == id })
        descriptor.fetchLimit = 1
        return try? context.fetch(descriptor).first
    }

    private func save(_ context: ModelContext) {
        try? context.save()
    }
}
