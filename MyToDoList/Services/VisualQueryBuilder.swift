import Foundation

/// Result of turning a task title + category into a stock-photo search query.
/// Pure data; no network. See FRD §5.1.
struct VisualQuery: Equatable {
    /// 2-5 word English stock-photo query. Empty when nothing should be searched.
    var query: String
    /// True when the title matched the sensitivity gate. The provider must never be called.
    var isSensitive: Bool
    /// Debug / test identifier, e.g. `keyword.grocery`, `category.work`, `sensitive.health`.
    var matchedRuleID: String

    /// Only a non-sensitive, non-empty query may leave the device.
    var shouldSearch: Bool { !isSensitive && !query.isEmpty }
}

/// Layer 1 of the visuals pipeline: our intelligence, not the vendor's.
/// Everything here is deterministic and offline so it can be unit tested.
enum VisualQueryBuilder {
    /// Bump when the keyword map or fallback table changes (stored as `visualQueryVersion`).
    static let version = 1

    static func build(title: String, category: TaskCategory?) -> VisualQuery {
        let raw = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !raw.isEmpty else {
            return VisualQuery(query: "", isSensitive: false, matchedRuleID: "empty")
        }

        if let ruleID = VisualPrivacyGuard.sensitiveRuleID(for: raw) {
            return VisualQuery(query: "", isSensitive: true, matchedRuleID: ruleID)
        }

        let normalized = normalize(raw)

        for rule in keywordRules where normalized.range(of: rule.pattern, options: .regularExpression) != nil {
            return VisualQuery(query: rule.query, isSensitive: false, matchedRuleID: "keyword.\(rule.id)")
        }

        let fallback = categoryFallback(for: category)
        return VisualQuery(query: fallback.query, isSensitive: false, matchedRuleID: fallback.ruleID)
    }

    /// Lowercase, trim, replace punctuation with spaces, collapse whitespace.
    static func normalize(_ title: String) -> String {
        let lowered = title.lowercased()
        let scalars = lowered.unicodeScalars.map { scalar -> Character in
            CharacterSet.alphanumerics.contains(scalar) || CharacterSet.whitespacesAndNewlines.contains(scalar)
                ? Character(scalar)
                : " "
        }
        return String(scalars)
            .split(whereSeparator: { $0.isWhitespace })
            .joined(separator: " ")
    }

    /// FRD §5.1 rule 6: 2-5 words, ASCII letters and single spaces only.
    static func isValidQuery(_ query: String) -> Bool {
        let words = query.split(separator: " ", omittingEmptySubsequences: false)
        guard (2...5).contains(words.count) else { return false }
        return words.allSatisfy { word in
            !word.isEmpty && word.unicodeScalars.allSatisfy { $0.isASCII && CharacterSet.lowercaseLetters.contains($0) }
        }
    }

    // MARK: - Category fallback (FRD §3.4)

    static func categoryFallback(for category: TaskCategory?) -> (query: String, ruleID: String) {
        switch category {
        case .work: ("office desk workspace", "category.work")
        case .home: ("home interior living", "category.home")
        case .random: ("everyday lifestyle still life", "category.random")
        case nil: ("checklist notebook desk", "category.none")
        }
    }

    // MARK: - Keyword map (FRD §5.1 rule 3). First match wins.

    struct KeywordRule {
        let id: String
        let pattern: String
        let query: String
    }

    /// Patterns run against the normalized title. Whole-word matches so `car` does not hit `card`
    /// and `market` does not hit `marketing`.
    static let keywordRules: [KeywordRule] = [
        .init(id: "grocery", pattern: #"\b(grocer\w*|supermarket|market|vegetables?|fruits?)\b"#, query: "grocery shopping vegetables"),
        .init(id: "cooking", pattern: #"\b(dinner|cook\w*|meals?|recipes?|kitchen|lunch|breakfast)\b"#, query: "home cooking kitchen"),
        .init(id: "fitness", pattern: #"\b(gym|workouts?|run|runs|running|jog\w*|yoga|fitness|exercis\w*)\b"#, query: "fitness workout gym"),
        .init(id: "meeting", pattern: #"\b(meetings?|standup|stand up|presentations?|slides?)\b"#, query: "team meeting office"),
        .init(id: "email", pattern: #"\b(emails?|inbox|slack|messages?)\b"#, query: "laptop workspace desk"),
        .init(id: "chores", pattern: #"\b(laundry|dishes|clean\w*|chores?|vacuum\w*)\b"#, query: "home chores housework"),
        .init(id: "study", pattern: #"\b(school|homework|study\w*|exams?)\b"#, query: "study desk books"),
        .init(id: "travel", pattern: #"\b(travel\w*|flights?|airport|pack|packing|trip)\b"#, query: "travel suitcase airport"),
        .init(id: "bills", pattern: #"\b(bills?|rent|tax|taxes|budget\w*)\b"#, query: "calculator paperwork desk"),
        .init(id: "celebration", pattern: #"\b(birthdays?|party|parties|gifts?)\b"#, query: "celebration gift wrapping"),
        .init(id: "plants", pattern: #"\b(plants?|garden\w*)\b"#, query: "indoor plants garden"),
        .init(id: "pets", pattern: #"\b(dogs?|cats?|vet|pets?)\b"#, query: "pet dog cat home"),
        .init(id: "car", pattern: #"\b(car|cars|fuel|parking)\b"#, query: "car city street"),
        .init(id: "design", pattern: #"\b(design\w*|wireframes?|prototypes?|figma)\b"#, query: "creative design workspace"),
    ]
}

/// Sensitivity gate (FRD §5.1 rule 2). If this returns a rule ID, the title must never reach
/// the network, not even as a derived query. Rule IDs are for tests and debugging only and
/// never contain title text.
enum VisualPrivacyGuard {
    static func isSensitive(_ title: String) -> Bool {
        sensitiveRuleID(for: title) != nil
    }

    static func sensitiveRuleID(for title: String) -> String? {
        let lowered = title.lowercased()

        // Personal data is checked on the raw text, before punctuation is stripped.
        if lowered.range(of: #"[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}"#, options: .regularExpression) != nil {
            return "sensitive.email"
        }
        let digitsOnly = lowered.replacingOccurrences(of: #"[\s\-\.\(\)\+]"#, with: "", options: .regularExpression)
        if digitsOnly.range(of: #"\d{7,}"#, options: .regularExpression) != nil {
            return "sensitive.number"
        }
        if lowered.range(
            of: #"\b\d{1,5}\s+(?:[a-z]+\s+){1,3}(street|st|avenue|ave|road|rd|lane|ln|boulevard|blvd|drive|dr|court|ct|way)\b"#,
            options: .regularExpression
        ) != nil {
            return "sensitive.address"
        }

        let normalized = VisualQueryBuilder.normalize(title)
        for rule in wordRules where normalized.range(of: rule.pattern, options: .regularExpression) != nil {
            return "sensitive.\(rule.id)"
        }
        return nil
    }

    private struct WordRule {
        let id: String
        let pattern: String
    }

    private static let wordRules: [WordRule] = [
        .init(id: "health", pattern: #"\b(medic\w*|doctors?|dr|dentists?|dental|clinic\w*|therap\w*|psychiat\w*|psycholog\w*|diagnos\w*|symptoms?|surgery|prescriptions?|treatments?|hospital\w*|counsell?\w*|pregnan\w*|cancer|chemo\w*|hiv|std|mental health)\b"#),
        .init(id: "intimate", pattern: #"\b(sex\w*|porn\w*|nude\w*|erotic|dating|tinder|hinge|bumble|explicit)\b"#),
        .init(id: "harm", pattern: #"\b(suicid\w*|self harm|selfharm|kill\w*|murder\w*|violen\w*|abuse\w*|assault\w*|weapons?|guns?)\b"#),
        .init(id: "legal", pattern: #"\b(court|lawyers?|attorney|lawsuit|sue|legal|police|arrest\w*|jail|prison|divorce|custody|subpoena|litigation)\b"#),
        .init(id: "credentials", pattern: #"\b(passwords?|passcode|otp|one time code|one time password|pin code|bank account|account number|card number|credit card|cvv|ssn|social security|iban|routing number)\b"#),
        .init(id: "confidential", pattern: #"\b(confidential|nda|internal only|classified)\b"#),
        .init(id: "relationship", pattern: #"\b(breakup|break up|relationship conflict)\b"#),
    ]
}
