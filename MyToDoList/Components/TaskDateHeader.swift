import SwiftUI

/// HUI Header `Type=Nested`: 17pt semibold, secondary label, leading.
struct TaskDateHeader: View {
    let title: String

    var body: some View {
        Text(title)
            .font(.headline)
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}

#Preview {
    List {
        Section {
            Text("Task")
        } header: {
            TaskDateHeader(title: "Today")
                .textCase(nil)
        }
    }
    .listStyle(.plain)
}
