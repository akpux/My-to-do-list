import Foundation
import SwiftData

@Model
final class UserProfile {
    @Attribute(.unique) var id: UUID
    var displayName: String
    var mobileNumber: String?
    var email: String?
    var createdAt: Date

    init(
        id: UUID = UUID(),
        displayName: String,
        mobileNumber: String? = nil,
        email: String? = nil,
        createdAt: Date = .now
    ) {
        self.id = id
        self.displayName = displayName
        self.mobileNumber = mobileNumber
        self.email = email
        self.createdAt = createdAt
    }
}

