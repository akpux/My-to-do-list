import SwiftUI

struct TaskRow: View {
    let task: TodoTask
    let toggleCompletion: () -> Void
    let reinstate: () -> Void
    let edit: () -> Void

    var body: some View {
        TimelineView(.periodic(from: .now, by: 60)) { context in
            VStack(spacing: 4) {
                HStack(alignment: .top, spacing: 8) {
                    TaskRowThumbnail(task: task)

                    TaskRowMeta(task: task)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    TaskCheckbox(isCompleted: task.isCompleted, action: toggleCompletion)
                }
                .padding(.vertical, 10)

                Divider()

                TaskRowFooter(
                    task: task,
                    now: context.date,
                    edit: edit
                )
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 4)
            .background {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color(.systemBackground))
                    .shadow(color: .black.opacity(0.12), radius: 20, y: 8)
            }
            .contentShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .contextMenu {
                TaskPhotoCreditMenu(task: task)
            }
            .onTapGesture {
                if task.isCompleted, task.dueDate != nil { reinstate() }
            }
            .accessibilityHint(task.isCompleted && task.dueDate != nil ? "Double tap to restore this task" : "")
        }
    }
}

/// 60pt thumbnail. The category symbol on `subtleAccent` is both the placeholder and the fallback for
/// every non-`ready` status; a `ready` Unsplash photo is drawn over it in the same fixed frame, so a
/// late-arriving image cannot shift layout (FRD §8.1). It only renders the persisted URL: no search
/// and no download ping ever starts from here.
struct TaskRowThumbnail: View {
    let task: TodoTask
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private static let shape = RoundedRectangle(cornerRadius: 8, style: .continuous)

    private var photoURL: URL? {
        guard task.hasReadyVisual, let string = task.visualImageURL else { return nil }
        return URL(string: string)
    }

    private var altText: String? {
        guard photoURL != nil,
              let alt = task.visualAlt?.trimmingCharacters(in: .whitespacesAndNewlines),
              !alt.isEmpty else { return nil }
        return alt
    }

    var body: some View {
        Image(systemName: task.category?.symbolName ?? "checklist")
            .font(.title3)
            .foregroundStyle(AppTheme.accent)
            .frame(width: 60, height: 60)
            .background(AppTheme.subtleAccent, in: Self.shape)
            .overlay { photo }
            .clipShape(Self.shape)
            .overlay {
                Self.shape.stroke(Color(white: 0.8), lineWidth: 1)
            }
            .opacity(task.isCompleted ? 0.55 : 1)
            .modifier(ThumbnailAccessibility(altText: altText))
    }

    @ViewBuilder
    private var photo: some View {
        if let photoURL {
            AsyncImage(
                url: photoURL,
                transaction: Transaction(animation: reduceMotion ? nil : .easeIn(duration: 0.2))
            ) { phase in
                if let image = phase.image {
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 60, height: 60)
                }
            }
        }
    }
}

/// Decorative unless the photo has alt text. The task title stays the real accessible label.
private struct ThumbnailAccessibility: ViewModifier {
    let altText: String?

    func body(content: Content) -> some View {
        if let altText {
            content
                .accessibilityLabel(altText)
                .accessibilityAddTraits(.isImage)
        } else {
            content.accessibilityHidden(true)
        }
    }
}

/// Long-press menu entries for the required Unsplash photo credit (FRD §8.2).
/// Empty (so no menu appears) unless the task has a `ready` photo.
struct TaskPhotoCreditMenu: View {
    let task: TodoTask

    var body: some View {
        if let credit = VisualAttribution(task: task) {
            Section(credit.text) {
                if let profile = credit.photographerURL {
                    Link(destination: profile) {
                        Label(credit.photographerName, systemImage: "person.crop.circle")
                    }
                }
                Link(destination: credit.unsplashURL) {
                    Label("Unsplash", systemImage: "photo")
                }
            }
        }
    }
}

struct TaskRowMeta: View {
    let task: TodoTask

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(task.title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(task.isCompleted ? .secondary : .primary)
                .strikethrough(task.isCompleted)
                .lineLimit(3)

            HStack(spacing: 4) {
                if let category = task.category {
                    Text(category.rawValue)
                        .font(.footnote)
                        .foregroundStyle(.primary)
                }
                if task.category != nil, task.priority != nil {
                    Circle()
                        .fill(Color.primary.opacity(0.45))
                        .frame(width: 3, height: 3)
                }
                if let priority = task.priority {
                    Text(priority.rawValue)
                        .font(.footnote)
                        .foregroundStyle(AppTheme.priorityColor(for: priority))
                }
            }
        }
    }
}

struct TaskRowFooter: View {
    let task: TodoTask
    let now: Date
    let edit: () -> Void

    var body: some View {
        HStack {
            if task.isMissed(now: now) {
                Label {
                    Text("Missed")
                        .font(.footnote.weight(.semibold))
                } icon: {
                    Image("CalendarSchedule")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 14, height: 14)
                }
                .foregroundStyle(.red)
                .labelStyle(.titleAndIcon)
            } else if let dueDate = task.dueDate {
                Label {
                    Text(dueDate.formatted(date: .abbreviated, time: .shortened))
                        .font(.footnote.weight(.semibold))
                } icon: {
                    Image("CalendarSchedule")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 14, height: 14)
                }
                .foregroundStyle(.primary)
                .labelStyle(.titleAndIcon)
            }

            Spacer(minLength: 8)

            Button(action: edit) {
                HStack(spacing: 3) {
                    Text("Edit")
                        .font(.callout.weight(.semibold))
                    Image("EditPencil")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                }
                .foregroundStyle(.secondary)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Edit task")
        }
        .padding(.vertical, 7)
    }
}

struct TaskCheckbox: View {
    let isCompleted: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            RoundedRectangle(cornerRadius: 2, style: .continuous)
                .fill(isCompleted ? Color(white: 0.63) : Color.clear)
                .overlay {
                    RoundedRectangle(cornerRadius: 2, style: .continuous)
                        .stroke(Color(white: 0.63), lineWidth: 1)
                }
                .overlay {
                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(.white)
                    }
                }
                .frame(width: 16, height: 16)
                .padding(11)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(isCompleted ? "Mark incomplete" : "Mark complete")
    }
}

#Preview("Pending") {
    let sample = PreviewSupport.sampleTask()
    return List {
        TaskRow(task: sample.task, toggleCompletion: {}, reinstate: {}, edit: {})
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
    }
    .listStyle(.plain)
    .modelContainer(sample.container)
}

#Preview("Completed") {
    let sample = PreviewSupport.sampleTask(title: "Reply to mail", isCompleted: true)
    return List {
        TaskRow(task: sample.task, toggleCompletion: {}, reinstate: {}, edit: {})
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
    }
    .listStyle(.plain)
    .modelContainer(sample.container)
}

#Preview("Photo ready / fallback / completed") {
    let sample = PreviewSupport.sampleTask(title: "Buy groceries for dinner")
    let ready = sample.task
    ready.visualStatus = .ready
    ready.visualImageURL = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=max"
    ready.visualAlt = "bunch of vegetables"
    ready.visualPhotographerName = "nrd"
    ready.visualPhotographerURL = "https://unsplash.com/@nicotitto"

    let fallback = TodoTask(title: "Discuss medication", category: .home)
    fallback.visualStatus = .privacyBlocked

    let completed = TodoTask(title: "Reply to mail", category: .work, isCompleted: true, completedAt: .now)
    completed.visualStatus = .ready
    completed.visualImageURL = ready.visualImageURL

    return List {
        ForEach([ready, fallback, completed]) { task in
            TaskRow(task: task, toggleCompletion: {}, reinstate: {}, edit: {})
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
        }
    }
    .listStyle(.plain)
    .modelContainer(sample.container)
}
