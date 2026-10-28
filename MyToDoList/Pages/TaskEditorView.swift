import SwiftUI
import SwiftData

struct TaskEditorView: View {
    let task: TodoTask?
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    @State private var title: String
    @State private var hasDeadline: Bool
    @State private var dueDate: Date
    @State private var category: TaskCategory?
    @State private var priority: TaskPriority?

    init(task: TodoTask? = nil) {
        self.task = task
        _title = State(initialValue: task?.title ?? "")
        _hasDeadline = State(initialValue: task?.dueDate != nil)
        _dueDate = State(initialValue: task?.dueDate ?? .now)
        _category = State(initialValue: task?.category)
        _priority = State(initialValue: task?.priority)
    }

    private var canSave: Bool { !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }

    var body: some View {
        NavigationStack {
            Form {
                Section("Task") {
                    TextField("Task title", text: $title, axis: .vertical)
                        .lineLimit(1...3)
                        .accessibilityIdentifier("task.title")
                }

                Section("Task Type") {
                    Picker("Task type", selection: $category) {
                        Text("None").tag(TaskCategory?.none)
                        ForEach(TaskCategory.allCases) { item in
                            Label(item.rawValue, systemImage: item.symbolName).tag(TaskCategory?.some(item))
                        }
                    }
                }

                Section("Priority") {
                    Picker("Priority", selection: $priority) {
                        Text("None").tag(TaskPriority?.none)
                        ForEach(TaskPriority.allCases) { item in
                            Text(item.rawValue).tag(TaskPriority?.some(item))
                        }
                    }
                }

                Section("Deadline") {
                    Toggle("Set a deadline", isOn: $hasDeadline)
                    if hasDeadline {
                        DatePicker("Date and time", selection: $dueDate, displayedComponents: [.date, .hourAndMinute])
                    }
                }

                // Required Unsplash credit (FRD §8.2). Only when this task shows a ready photo.
                if let task, let credit = VisualAttribution(task: task) {
                    Section {
                        Text(credit.attributedText)
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .listRowBackground(Color.clear)
                            .accessibilityIdentifier("task.photoCredit")
                    }
                }
            }
            .navigationTitle(task == nil ? "New Task" : "Edit Task")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(task == nil ? "Create" : "Save", action: save)
                        .disabled(!canSave)
                        .accessibilityIdentifier("task.save")
                }
            }
        }
    }

    private func save() {
        let destination = task ?? TodoTask(title: title)
        destination.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        destination.dueDate = hasDeadline ? dueDate : nil
        destination.category = category
        destination.priority = priority

        let repository = TaskRepository(modelContext: modelContext)
        if task == nil {
            repository.insert(destination)
        } else {
            repository.save()
        }
        // The task is already saved. Resolving its photo runs in the background and can only change
        // the task's visual fields; it never delays or fails this save (FRD §8.3).
        TaskVisualService.shared.resolveIfNeeded(for: destination, in: modelContext)
        dismiss()
    }
}

#Preview("New task") {
    TaskEditorView()
        .modelContainer(PreviewSupport.empty)
}

#Preview("Edit task") {
    let sample = PreviewSupport.sampleTask()
    return TaskEditorView(task: sample.task)
        .modelContainer(sample.container)
}
