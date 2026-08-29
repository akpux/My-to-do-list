import SwiftUI

struct TaskRow: View {
    let task: TodoTask
    let toggleCompletion: () -> Void
    let delete: () -> Void
    let reinstate: () -> Void

    var body: some View {
        TimelineView(.periodic(from: .now, by: 60)) { context in
            HStack(alignment: .top, spacing: 12) {
                Button(action: toggleCompletion) {
                    Image(systemName: task.isCompleted ? "checkmark.square.fill" : "square")
                        .font(.title3)
                        .foregroundStyle(task.isCompleted ? Color.secondary : AppTheme.accent)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(task.isCompleted ? "Mark incomplete" : "Mark complete")

                VStack(alignment: .leading, spacing: 8) {
                    Text(task.title)
                        .fontWeight(.semibold)
                        .foregroundStyle(task.isCompleted ? .secondary : .primary)
                        .strikethrough(task.isCompleted)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    metadata

                    if task.isMissed(now: context.date) {
                        Label("Missed", systemImage: "exclamationmark.triangle.fill")
                            .font(.caption.weight(.medium))
                            .foregroundStyle(.red)
                    }
                }

                if task.isCompleted {
                    Button(role: .destructive, action: delete) {
                        Image(systemName: "trash")
                            .font(.subheadline)
                    }
                    .buttonStyle(.borderless)
                    .accessibilityLabel("Delete completed task")
                }
            }
            .padding(.vertical, 8)
            .contentShape(Rectangle())
            .onTapGesture {
                if task.isCompleted, task.dueDate != nil { reinstate() }
            }
            .accessibilityHint(task.isCompleted && task.dueDate != nil ? "Double tap to restore this task" : "")
        }
    }

    @ViewBuilder
    private var metadata: some View {
        HStack(spacing: 12) {
            if let dueDate = task.dueDate {
                Label(dueDate.formatted(date: .abbreviated, time: .shortened), systemImage: "clock")
            }
            if let category = task.category {
                Label(category.rawValue, systemImage: category.symbolName)
            }
            if let priority = task.priority {
                Label(priority.rawValue, systemImage: "flag.fill")
                    .foregroundStyle(priority == .high ? Color.orange : (priority == .medium ? Color.yellow : Color.green))
            }
        }
        .font(.caption)
        .foregroundStyle(.secondary)
        .lineLimit(1)
    }
}
