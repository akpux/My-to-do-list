import SwiftUI
import SwiftData

struct LocalAuthFlowView: View {
    var body: some View {
        NavigationStack {
            WelcomeView()
        }
    }
}

struct WelcomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var name = ""

    private var canContinue: Bool { name.trimmingCharacters(in: .whitespacesAndNewlines).count >= 2 }

    var body: some View {
        VStack(spacing: 22) {
            Spacer()

            Image(systemName: "checklist")
                .font(.system(size: 40, weight: .semibold))
                .foregroundStyle(AppTheme.accent)
                .frame(width: 82, height: 82)
                .background(AppTheme.subtleAccent, in: Circle())

            VStack(spacing: 8) {
                Text("Welcome!")
                    .font(.largeTitle.bold())
                Text("What should we call you?")
                    .foregroundStyle(.secondary)
            }

            TextField("Your name", text: $name)
                .textContentType(.name)
                .textInputAutocapitalization(.words)
                .padding()
                .background(Color(uiColor: .secondarySystemBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                .accessibilityIdentifier("welcome.name")

            Button(action: createLocalProfile) {
                Text("Continue")
                    .appPrimaryButton()
            }
            .disabled(!canContinue)
            .opacity(canContinue ? 1 : 0.45)
            .accessibilityIdentifier("welcome.continue")

            Spacer()
        }
        .padding(24)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func createLocalProfile() {
        guard canContinue else { return }
        modelContext.insert(UserProfile(
            displayName: name.trimmingCharacters(in: .whitespacesAndNewlines)
        ))
        try? modelContext.save()
    }
}

/// Parked for a later phase. Not shown in the MVP launch flow.
struct SignUpView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmation = ""
    @State private var showPassword = false
    @State private var errorMessage: String?

    private var canSubmit: Bool {
        name.trimmingCharacters(in: .whitespacesAndNewlines).count >= 2
            && email.contains("@")
            && password.count >= 6
            && password == confirmation
    }

    var body: some View {
        Form {
            Section {
                TextField("Your name", text: $name)
                    .textContentType(.name)
                    .textInputAutocapitalization(.words)
                TextField("Email address", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
            } header: {
                Text("Create account")
            } footer: {
                Text("This offline MVP saves your profile details only. Passwords are never stored.")
            }

            Section("Password") {
                Group {
                    if showPassword {
                        TextField("Password", text: $password)
                        TextField("Confirm password", text: $confirmation)
                    } else {
                        SecureField("Password", text: $password)
                        SecureField("Confirm password", text: $confirmation)
                    }
                }
                Toggle("Show password", isOn: $showPassword)
            }

            if let errorMessage {
                Section { Text(errorMessage).foregroundStyle(.red) }
            }

            Section {
                Button("Create local profile", action: createProfile)
                    .frame(maxWidth: .infinity)
                    .disabled(!canSubmit)
            }
        }
        .navigationTitle("Create Account")
    }

    private func createProfile() {
        guard canSubmit else {
            errorMessage = "Enter a name, valid email, and matching password of at least six characters."
            return
        }
        modelContext.insert(UserProfile(
            displayName: name.trimmingCharacters(in: .whitespacesAndNewlines),
            email: email.trimmingCharacters(in: .whitespacesAndNewlines)
        ))
        try? modelContext.save()
        dismiss()
    }
}

/// Parked for a later phase. Not shown in the MVP launch flow.
struct ForgotPasswordView: View {
    private enum Step { case request, confirmation, reset, complete }

    @State private var step: Step = .request
    @State private var email = ""
    @State private var password = ""
    @State private var confirmation = ""
    @State private var errorMessage: String?

    var body: some View {
        Group {
            switch step {
            case .request:
                Form {
                    Section {
                        Text("Enter an email address to continue through the local reset flow.")
                            .foregroundStyle(.secondary)
                        TextField("Email address", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                    }
                    Section {
                        Button("Send reset link") {
                            errorMessage = email.contains("@") ? nil : "Enter a valid email address."
                            if errorMessage == nil { step = .confirmation }
                        }
                    }
                    if let errorMessage { Section { Text(errorMessage).foregroundStyle(.red) } }
                }
                .navigationTitle("Forgot Password")
            case .confirmation:
                ContentUnavailableView(
                    "Check your email",
                    systemImage: "envelope.badge",
                    description: Text("A simulated reset link was sent to \(email).")
                )
                .safeAreaInset(edge: .bottom) {
                    Button("Set new password") { step = .reset }
                        .appPrimaryButton()
                        .padding()
                }
            case .reset:
                Form {
                    Section("New password") {
                        SecureField("New password", text: $password)
                        SecureField("Confirm password", text: $confirmation)
                    }
                    Section {
                        Button("Reset password") {
                            errorMessage = password.count >= 6 && password == confirmation ? nil : "Passwords must match and contain at least six characters."
                            if errorMessage == nil { step = .complete }
                        }
                    }
                    if let errorMessage { Section { Text(errorMessage).foregroundStyle(.red) } }
                }
                .navigationTitle("Reset Password")
            case .complete:
                ContentUnavailableView(
                    "Password reset",
                    systemImage: "checkmark.circle.fill",
                    description: Text("Your local demo reset flow is complete. No password was saved."))
                    .foregroundStyle(AppTheme.accent)
            }
        }
    }
}

#Preview("Welcome") {
    NavigationStack {
        WelcomeView()
    }
    .modelContainer(PreviewSupport.empty)
}

#Preview("Sign Up (later)") {
    NavigationStack {
        SignUpView()
    }
    .modelContainer(PreviewSupport.empty)
}

#Preview("Forgot Password (later)") {
    NavigationStack {
        ForgotPasswordView()
    }
}
