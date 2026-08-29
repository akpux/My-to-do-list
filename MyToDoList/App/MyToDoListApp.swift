import SwiftUI
import SwiftData

@main
struct MyToDoListApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            TodoTask.self,
            UserProfile.self
        ])
        let configuration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: ProcessInfo.processInfo.arguments.contains("-UITesting")
        )

        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Unable to create local data store: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            RootView()
        }
        .modelContainer(sharedModelContainer)
    }
}
