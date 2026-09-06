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

#Preview("Name gate") {
    RootView()
        .modelContainer(PreviewSupport.empty)
}

#Preview("Task list") {
    RootView()
        .modelContainer(PreviewSupport.populated)
}
