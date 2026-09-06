import SwiftUI

enum ReinstatementAction {
    case reschedule
    case removeDeadline
}

struct ReinstatementSheet: View {
    let task: TodoTask
    let perform: (ReinstatementAction) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "calendar.badge.clock")
                .font(.system(size: 38))
                .foregroundStyle(AppTheme.accent)
                .frame(width: 80, height: 80)
                .background(AppTheme.subtleAccent, in: Circle())

            VStack(spacing: 8) {
                Text("Reinstate Task?")
                    .font(.title2.bold())
                Text("\(task.title) is complete. Move it back to your pending tasks with a new deadline or no deadline.")
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
            }

            Button("Add New Deadline") {
                perform(.reschedule)
                dismiss()
            }
            .appPrimaryButton()

            Button("Remove Deadline") {
                perform(.removeDeadline)
                dismiss()
            }
            .font(.headline)
            .foregroundStyle(AppTheme.accent)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .overlay {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .stroke(AppTheme.accent, lineWidth: 1.5)
            }

            Button("Cancel", role: .cancel) { dismiss() }
                .foregroundStyle(.secondary)
        }
        .padding(24)
        .presentationDetents([.medium])
    }
}

#Preview {
    let sample = PreviewSupport.sampleTask(title: "Reply to mail", isCompleted: true)
    return ReinstatementSheet(task: sample.task, perform: { _ in })
        .modelContainer(sample.container)
}

