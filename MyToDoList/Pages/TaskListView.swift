import SwiftUI
import SwiftData

private enum TaskTab: String, CaseIterable, Identifiable {
    case pending = "Pending"
    case completed = "Completed"
    var id: String { rawValue }
}

private struct TaskTabSegmentedControl: UIViewRepresentable {
    @Binding var selection: TaskTab
    var pendingCount: Int

    func makeCoordinator() -> Coordinator {
        Coordinator(selection: $selection)
    }

    func makeUIView(context: Context) -> UISegmentedControl {
        let control = UISegmentedControl(items: titles)
        control.selectedSegmentIndex = selection == .pending ? 0 : 1
        control.apportionsSegmentWidthsByContent = false
        control.addTarget(context.coordinator, action: #selector(Coordinator.valueChanged(_:)), for: .valueChanged)
        control.setContentHuggingPriority(.defaultLow, for: .horizontal)
        control.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        return control
    }

    func updateUIView(_ control: UISegmentedControl, context: Context) {
        let pendingTitle = titles[0]
        if control.titleForSegment(at: 0) != pendingTitle {
            control.setTitle(pendingTitle, forSegmentAt: 0)
        }
        let index = selection == .pending ? 0 : 1
        if control.selectedSegmentIndex != index {
            control.selectedSegmentIndex = index
        }
        context.coordinator.selection = $selection
    }

    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UISegmentedControl, context: Context) -> CGSize? {
        CGSize(width: proposal.width ?? uiView.intrinsicContentSize.width, height: AppTheme.segmentedControlHeight)
    }

    private var titles: [String] {
        ["\(TaskTab.pending.rawValue) (\(pendingCount))", TaskTab.completed.rawValue]
    }

    final class Coordinator: NSObject {
        var selection: Binding<TaskTab>

        init(selection: Binding<TaskTab>) {
            self.selection = selection
        }

        @objc func valueChanged(_ sender: UISegmentedControl) {
            selection.wrappedValue = sender.selectedSegmentIndex == 0 ? .pending : .completed
        }
    }
}

private struct TaskListSubtitle: ViewModifier {
    let text: String

    init(_ text: String) {
        self.text = text
    }

    func body(content: Content) -> some View {
        if #available(iOS 26.0, *) {
            content.navigationSubtitle(text)
        } else {
            content
        }
    }
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
                TaskTabSegmentedControl(selection: $selectedTab, pendingCount: count(for: .pending))
                    .accessibilityLabel("Task status")
                    .listRowInsets(
                        EdgeInsets(
                            top: AppTheme.segmentedControlPageInset,
                            leading: AppTheme.segmentedControlPageInset,
                            bottom: AppTheme.segmentedControlPageInset,
                            trailing: AppTheme.segmentedControlPageInset
                        )
                    )
                    .listRowSeparator(.hidden)
                    .listRowBackground(Color.clear)

                if visibleTasks.isEmpty {
                    TaskListEmptyState(isPending: selectedTab == .pending)
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 24, leading: 16, bottom: 24, trailing: 16))
                } else {
                    ForEach(TaskGrouping.sections(for: visibleTasks)) { section in
                        Section {
                            ForEach(section.tasks) { task in
                                TaskRow(
                                    task: task,
                                    toggleCompletion: { toggle(task) },
                                    reinstate: { taskToReinstate = task },
                                    edit: { taskToEdit = task }
                                )
                                .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
                                .listRowSeparator(.hidden)
                                .listRowBackground(Color.clear)
                                .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                    if task.isCompleted {
                                        Button(role: .destructive, action: { delete(task) }) {
                                            Label("Delete", systemImage: "trash")
                                        }
                                    }
                                }
                            }
                        } header: {
                            TaskDateHeader(title: section.title)
                                .textCase(nil)
                                .frame(maxWidth: .infinity)
                                .listRowInsets(EdgeInsets(top: 10, leading: 16, bottom: 10, trailing: 16))
                        }
                    }
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Hey, \(profile.displayName)")
            .navigationBarTitleDisplayMode(.large)
            .modifier(TaskListSubtitle("Let’s organise your day"))
            .safeAreaInset(edge: .bottom) {
                Button {
                    isPresentingNewTask = true
                } label: {
                    Label("Add Task", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(AppTheme.accent)
                .accessibilityIdentifier("task.add")
                .padding(.bottom, 8)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Picker("Sort tasks", selection: $sort) {
                            ForEach(TaskSort.allCases) { option in
                                Label(option.rawValue, systemImage: option.symbolName).tag(option)
                            }
                        }
                    } label: {
                        Image("FunnelSimple")
                            .foregroundStyle(AppTheme.accent)
                    }
                    .accessibilityLabel("Sort tasks")
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

#Preview("Pending tasks") {
    var profile: UserProfile!
    let container = PreviewSupport.container { context in
        profile = PreviewSupport.insertSampleData(into: context)
    }
    return TaskListView(profile: profile)
        .modelContainer(container)
}

#Preview("Empty list") {
    var profile: UserProfile!
    let container = PreviewSupport.container { context in
        profile = UserProfile(displayName: "Avery")
        context.insert(profile)
    }
    return TaskListView(profile: profile)
        .modelContainer(container)
}
