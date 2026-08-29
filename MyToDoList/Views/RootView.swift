import SwiftUI
import SwiftData

struct RootView: View {
    @Query(sort: \UserProfile.createdAt) private var profiles: [UserProfile]

    var body: some View {
        Group {
            if let profile = profiles.first {
                TaskListView(profile: profile)
            } else {
                LocalAuthFlowView()
            }
        }
        .tint(AppTheme.accent)
    }
}

#Preview {
    RootView()
        .modelContainer(for: [TodoTask.self, UserProfile.self], inMemory: true)
}

