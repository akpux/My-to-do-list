import SwiftUI
import SwiftData

private enum TaskTab: String, CaseIterable, Identifiable {
    case pending = "Pending"
    case completed = "Completed"
    var id: String { rawValue }
}

struct TaskListView: View {
    let profile: UserProfile
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \TodoTask.createdAt, order: .reverse) private var allTasks: [TodoTask]
    @State private var selectedTab: TaskTab = .pending
    @State private var sort: TaskSort = .created
    @State private var isPresentingNewTask = false
    @State private var taskToEdit: TodoTask?
    @State private var taskToReinstate: TodoTask?

    private var visibleTasks: [TodoTask] {
        let filtered = allTasks.filter { $0.isCompleted == (selectedTab == .completed) }
        return TaskGrouping.sorted(filtered, by: sort)
    }

    var body: some View {
        NavigationStack {
            List {
                if visibleTasks.isEmpty {
                    ContentUnavailableView(
                        selectedTab == .pending ? "No pending tasks" : "No completed tasks",
                        systemImage: selectedTab == .pending ? "checkmark.circle" : "tray",
                        description: Text(selectedTab == .pending ? "Add a task to get started." : "Completed tasks will appear here."))
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                } else {
                    ForEach(TaskGrouping.sections(for: visibleTasks)) { section in
                        Section(section.title) {
                            ForEach(section.tasks) { task in
                                TaskRow(
                                    task: task,
                                    toggleCompletion: { toggle(task) },
                                    delete: { delete(task) },
                                    reinstate: { taskToReinstate = task }
                                )
                            }
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Hey, \(profile.displayName)")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Picker("Task status", selection: $selectedTab) {
                        ForEach(TaskTab.allCases) { tab in
                            Text("\(tab.rawValue) (\(count(for: tab)))").tag(tab)
                        }
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 210)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Picker("Sort tasks", selection: $sort) {
                            ForEach(TaskSort.allCases) { option in
                                Label(option.rawValue, systemImage: option.symbolName).tag(option)
                            }
                        }
                    } label: {
                        Image(systemName: "arrow.up.arrow.down.circle")
                    }
                    .accessibilityLabel("Sort tasks")
                }
                ToolbarItem(placement: .bottomBar) {
                    Spacer()
                }
                ToolbarItem(placement: .bottomBar) {
                    Button {
                        isPresentingNewTask = true
                    } label: {
                        Label("Add Task", systemImage: "plus")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(AppTheme.accent)
                    .accessibilityIdentifier("task.add")
                    Spacer()
                }
            }
            .fullScreenCover(isPresented: $isPresentingNewTask) {
                TaskEditorView()
            }
            .fullScreenCover(item: $taskToEdit) { task in
                TaskEditorView(task: task)
            }
            .sheet(item: $taskToReinstate) { task in
                ReinstatementSheet(task: task, perform: { action in
                    handleReinstatement(action, for: task)
                })
            }
        }
    }

    private func count(for tab: TaskTab) -> Int {
        allTasks.count { $0.isCompleted == (tab == .completed) }
    }

    private func toggle(_ task: TodoTask) {
        task.setCompleted(!task.isCompleted)
        TaskRepository(modelContext: modelContext).save()
    }

    private func delete(_ task: TodoTask) {
        TaskRepository(modelContext: modelContext).delete(task)
    }

    private func handleReinstatement(_ action: ReinstatementAction, for task: TodoTask) {
        task.setCompleted(false)
        selectedTab = .pending
        switch action {
        case .reschedule:
            taskToEdit = task
        case .removeDeadline:
            task.dueDate = nil
        }
        TaskRepository(modelContext: modelContext).save()
    }
}

#Preview {
    let container = try! ModelContainer(for: TodoTask.self, UserProfile.self, configurations: ModelConfiguration(isStoredInMemoryOnly: true))
    let profile = UserProfile(displayName: "Avery")
    container.mainContext.insert(profile)
    container.mainContext.insert(TodoTask(title: "Plan the week", dueDate: .now.addingTimeInterval(3_600), category: .work, priority: .high))
    return TaskListView(profile: profile).modelContainer(container)
}
