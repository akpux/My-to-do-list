import SwiftUI

struct TaskListEmptyState: View {
    let isPending: Bool

    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(AppTheme.iconButtonFill)
                Image("ListCheck")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 36, height: 36)
                    .foregroundStyle(AppTheme.accent)
            }
            .frame(width: 50, height: 50)

            VStack(spacing: 0) {
                Text("No Tasks")
                    .font(.title2.bold())
                    .foregroundStyle(.primary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)

                Text(isPending ? "New & Pending tasks will appear here" : "Completed tasks will appear here")
                    .font(.headline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
            }
            .padding(.horizontal, 16)
        }
        .frame(maxWidth: .infinity, minHeight: 280)
        .accessibilityElement(children: .combine)
    }
}

#Preview {
    TaskListEmptyState(isPending: true)
}
