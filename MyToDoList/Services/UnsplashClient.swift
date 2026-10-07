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

/// Unsplash REST client (FRD §5.2). Search is a public action, authenticated with the **access
/// key** only via `Authorization: Client-ID`. The secret key is for OAuth and is never used.
struct UnsplashClient: ImageSearching {
    static let apiHost = "api.unsplash.com"
    static let timeout: TimeInterval = 7
    static let perPage = 8

    let accessKey: String
    var session: URLSession = .shared
    /// Pause before the single retry of a transient failure. Tests pass `.zero`.
    var retryDelay: Duration = .milliseconds(400)

    // MARK: Key from the app bundle

    /// Reads `UnsplashAccessKey` from Info.plist (derived from the gitignored Secrets.xcconfig).
    /// Returns nil for a missing, empty, unexpanded (`$(...)`), or placeholder key so the app falls
    /// back to category symbols without touching the network.
    static func fromBundle(_ bundle: Bundle = .main, session: URLSession = .shared) -> UnsplashClient? {
        guard let key = usableKey(bundle.object(forInfoDictionaryKey: "UnsplashAccessKey") as? String) else {
            return nil
        }
        return UnsplashClient(accessKey: key, session: session)
    }

    static func usableKey(_ raw: String?) -> String? {
        let key = (raw ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        guard !key.isEmpty, !key.contains("$("), key != "your-unsplash-access-key" else { return nil }
        return key
    }

    // MARK: Requests

    func makeSearchRequest(query: String) -> URLRequest {
        var components = URLComponents()
        components.scheme = "https"
        components.host = Self.apiHost
        components.path = "/search/photos"
        components.queryItems = [
            URLQueryItem(name: "query", value: query),
            URLQueryItem(name: "orientation", value: "landscape"),
            URLQueryItem(name: "per_page", value: String(Self.perPage)),
            URLQueryItem(name: "page", value: "1"),
            URLQueryItem(name: "order_by", value: "relevant"),
            URLQueryItem(name: "content_filter", value: "high"),
        ]
        return authorized(URLRequest(url: components.url!))
    }

    /// The key is only ever attached to `https://api.unsplash.com`. `download_location` comes from a
    /// network response, so it is validated rather than trusted.
    func makeDownloadRequest(location: String) throws -> URLRequest {
        guard let url = URL(string: location),
              url.scheme == "https",
              url.host == Self.apiHost else {
            throw ImageSearchError.untrustedURL
        }
        return authorized(URLRequest(url: url))
    }

    private func authorized(_ request: URLRequest) -> URLRequest {
        var request = request
        request.httpMethod = "GET"
        request.timeoutInterval = Self.timeout
        request.setValue("Client-ID \(accessKey)", forHTTPHeaderField: "Authorization")
        request.setValue("v1", forHTTPHeaderField: "Accept-Version")
        return request
    }

    // MARK: ImageSearching

    func search(query: String) async throws -> [ImageCandidate] {
        let (data, _) = try await perform(makeSearchRequest(query: query))
        return try Self.candidates(from: data)
    }

    func trackDownload(location: String) async throws {
        _ = try await perform(makeDownloadRequest(location: location))
    }

    // MARK: Transport

    /// Sends the request, retrying once for transient failures (timeout/offline, 5xx).
    /// 401/403/404/429 never retry.
    private func perform(_ request: URLRequest) async throws -> (Data, HTTPURLResponse) {
        var attempt = 0
        while true {
            do {
                let (data, response) = try await session.data(for: request)
                guard let http = response as? HTTPURLResponse else { throw ImageSearchError.invalidResponse }
                if (200..<300).contains(http.statusCode) { return (data, http) }
                if (500..<600).contains(http.statusCode), attempt == 0 {
                    attempt += 1
                    try await Task.sleep(for: retryDelay)
                    continue
                }
                throw Self.error(forStatus: http.statusCode, headers: http)
            } catch let error as URLError {
                if error.code == .cancelled { throw CancellationError() }
                if attempt == 0 {
                    attempt += 1
                    try await Task.sleep(for: retryDelay)
                    continue
                }
                throw ImageSearchError.network
            }
        }
    }

    /// 403 is overloaded: Unsplash returns it both for bad permissions and for an exhausted hourly
    /// quota. `X-Ratelimit-Remaining` tells them apart (FRD §9).
    static func error(forStatus status: Int, headers: HTTPURLResponse) -> ImageSearchError {
        switch status {
        case 401:
            return .invalidKey
        case 403:
            let remaining = headers.value(forHTTPHeaderField: "X-Ratelimit-Remaining").flatMap { Int($0) }
            return remaining == 0 ? .quotaExhausted : .invalidKey
        case 429:
            return .quotaExhausted
        case 404:
            return .notFound
        case 500..<600:
            return .server(status)
        default:
            return .unexpectedStatus(status)
        }
    }

    // MARK: Decoding

    static func candidates(from data: Data) throws -> [ImageCandidate] {
        let response: SearchResponse
        do {
            response = try JSONDecoder().decode(SearchResponse.self, from: data)
        } catch {
            throw ImageSearchError.invalidResponse
        }
        return response.results.map { photo in
            ImageCandidate(
                providerPhotoID: photo.id,
                imageURL: photo.urls?.small,
                sourceURL: photo.links?.html,
                downloadLocation: photo.links?.downloadLocation,
                width: photo.width ?? 0,
                height: photo.height ?? 0,
                altText: nonEmpty(photo.altDescription) ?? nonEmpty(photo.description),
                photographerName: nonEmpty(photo.user?.name),
                photographerURL: photo.user?.links?.html,
                blurHash: photo.blurHash
            )
        }
    }

    private static func nonEmpty(_ value: String?) -> String? {
        guard let value, !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return nil }
        return value
    }

    // Tolerant DTOs: anything missing becomes nil and is rejected by `PhotoSelector.filter`.
    private struct SearchResponse: Decodable {
        let results: [Photo]
    }

    private struct Photo: Decodable {
        let id: String
        let width: Int?
        let height: Int?
        let blurHash: String?
        let altDescription: String?
        let description: String?
        let urls: URLs?
        let links: Links?
        let user: User?

        enum CodingKeys: String, CodingKey {
            case id, width, height, description, urls, links, user
            case blurHash = "blur_hash"
            case altDescription = "alt_description"
        }
    }

    private struct URLs: Decodable {
        let small: String?
    }

    private struct Links: Decodable {
        let html: String?
        let downloadLocation: String?

        enum CodingKeys: String, CodingKey {
            case html
            case downloadLocation = "download_location"
        }
    }

    private struct User: Decodable {
        let name: String?
        let links: UserLinks?
    }

    private struct UserLinks: Decodable {
        let html: String?
    }
}
