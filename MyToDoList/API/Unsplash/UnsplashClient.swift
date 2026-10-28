import Foundation

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
}
