import Foundation

/// What the visuals pipeline needs from an image provider. The app only ever talks to this
/// protocol, so tests use a mock and a second provider could be added later (FRD §11).
protocol ImageSearching: Sendable {
    func search(query: String) async throws -> [ImageCandidate]
    /// Event ping only. Never used to embed or save the image (FRD §5.4).
    func trackDownload(location: String) async throws
}

enum ImageSearchError: Error, Equatable {
    /// 401, or a 403 that is not quota exhaustion. Stop calling until the key changes.
    case invalidKey
    /// 403 with `X-Ratelimit-Remaining: 0`, or 429. Enter a cooldown.
    case quotaExhausted
    case notFound
    case server(Int)
    case unexpectedStatus(Int)
    /// Offline, timeout, DNS, TLS.
    case network
    case invalidResponse
    case untrustedURL
}

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
