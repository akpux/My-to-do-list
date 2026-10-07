import Foundation

/// A provider photo normalized into our own shape (FRD §5.2 field map).
/// Fields the filter requires are optional here so a malformed provider payload is
/// rejected by `PhotoSelector.filter` instead of crashing the decoder.
struct ImageCandidate: Equatable {
    var providerPhotoID: String
    /// `urls.small`, hotlinked as-is (never stripped, never downloaded).
    var imageURL: String?
    /// `links.html`, the human-facing photo page.
    var sourceURL: String?
    /// `links.download_location`, used for exactly one download ping.
    var downloadLocation: String?
    var width: Int
    var height: Int
    var altText: String?
    var photographerName: String?
    var photographerURL: String?
    var blurHash: String?
}

/// Layer 3 of the visuals pipeline: candidate filtering and deterministic selection.
/// Pure and offline (FRD §5.3).
enum PhotoSelector {
    static let minWidth = 600
    static let minHeight = 400

    /// Words that disqualify a photo based on its alt text. Metadata only; no image analysis in v1.
    static let unsafeAltWords: Set<String> = [
        "nude", "naked", "topless", "lingerie", "gun", "guns", "weapon", "weapons",
        "blood", "bloody", "corpse", "cigarette", "cigarettes", "drugs",
    ]
    static let unsafeAltPhrases = ["dead body", "drug use"]

    /// Deterministic across launches. Swift's `Hasher` is randomly seeded per process, so it must
    /// not be used here. This is djb2 with wrapping arithmetic.
    static func stableIndex(seed: String, count: Int) -> Int? {
        guard count > 0 else { return nil }
        var hash: UInt32 = 5381
        for byte in seed.utf8 {
            hash = (hash << 5) &+ hash &+ UInt32(byte)
        }
        return Int(hash % UInt32(count))
    }

    static func seed(taskID: UUID, query: String) -> String {
        "\(taskID.uuidString):\(query)"
    }

    /// Drops anything we could not attribute, track, or show safely.
    static func filter(_ candidates: [ImageCandidate], excluding excludedIDs: Set<String> = []) -> [ImageCandidate] {
        candidates.filter { candidate in
            if excludedIDs.contains(candidate.providerPhotoID) { return false }
            guard isPresent(candidate.imageURL),
                  isPresent(candidate.downloadLocation),
                  isPresent(candidate.photographerName) else { return false }
            if candidate.width < minWidth || candidate.height < minHeight { return false }
            if hasUnsafeAlt(candidate.altText) { return false }
            return true
        }
    }

    /// Filters, then picks one candidate by stable index of `taskID:query`. Nil when nothing usable remains.
    static func select(
        taskID: UUID,
        query: String,
        from candidates: [ImageCandidate],
        excluding excludedIDs: Set<String> = []
    ) -> ImageCandidate? {
        let usable = filter(candidates, excluding: excludedIDs)
        guard let index = stableIndex(seed: seed(taskID: taskID, query: query), count: usable.count) else {
            return nil
        }
        return usable[index]
    }

    private static func isPresent(_ value: String?) -> Bool {
        guard let value else { return false }
        return !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private static func hasUnsafeAlt(_ alt: String?) -> Bool {
        guard let alt else { return false }
        let lowered = alt.lowercased()
        if unsafeAltPhrases.contains(where: { lowered.contains($0) }) { return true }
        let words = lowered
            .split(whereSeparator: { !$0.isLetter })
            .map(String.init)
        return words.contains(where: { unsafeAltWords.contains($0) })
    }
}
