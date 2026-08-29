import SwiftUI

enum AppTheme {
    static let accent = Color(red: 142 / 255, green: 31 / 255, blue: 253 / 255)
    static let subtleAccent = Color(red: 243 / 255, green: 240 / 255, blue: 1)
    static let cardBorder = Color(uiColor: .separator).opacity(0.45)
}

extension View {
    func appPrimaryButton() -> some View {
        font(.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(AppTheme.accent, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

