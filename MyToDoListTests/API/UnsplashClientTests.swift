import XCTest
@testable import MyToDoList

/// Intercepts every request so these tests never touch the real network (Unsplash demo quota is
/// 50 requests/hour). Tests in this file run serially, so shared static state is safe.
final class StubURLProtocol: URLProtocol {
    typealias Handler = (URLRequest) throws -> (HTTPURLResponse, Data)

    private static let lock = NSLock()
    private static var _handler: Handler?
    private static var _requests: [URLRequest] = []

    static var handler: Handler? {
        get { lock.lock(); defer { lock.unlock() }; return _handler }
        set { lock.lock(); _handler = newValue; lock.unlock() }
    }

    static var requests: [URLRequest] {
        lock.lock(); defer { lock.unlock() }; return _requests
    }

    static func reset() {
        lock.lock(); _handler = nil; _requests = []; lock.unlock()
    }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        Self.lock.lock()
        Self._requests.append(request)
        let handler = Self._handler
        Self.lock.unlock()

        guard let handler else {
            client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
            return
        }
        do {
            let (response, data) = try handler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}
}

final class UnsplashClientTests: XCTestCase {
    private let key = "TEST_ACCESS_KEY"

    override func setUp() {
        super.setUp()
        StubURLProtocol.reset()
    }

    override func tearDown() {
        StubURLProtocol.reset()
        super.tearDown()
    }

    private func makeClient() -> UnsplashClient {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [StubURLProtocol.self]
        return UnsplashClient(accessKey: key, session: URLSession(configuration: configuration), retryDelay: .zero)
    }

    private func respond(_ request: URLRequest, status: Int, headers: [String: String] = [:], body: String = "{}") -> (HTTPURLResponse, Data) {
        let response = HTTPURLResponse(url: request.url!, statusCode: status, httpVersion: "HTTP/2", headerFields: headers)!
        return (response, Data(body.utf8))
    }

    private let searchJSON = """
    {
      "total": 2,
      "results": [
        {
          "id": "D6Tu_L3chLE",
          "width": 3957,
          "height": 2968,
          "blur_hash": "LDDSa5X*txobx[RkNHWB~Us.$%WW",
          "description": null,
          "alt_description": "bunch of vegetables",
          "urls": { "small": "https://images.unsplash.com/photo-1?w=400" },
          "links": {
            "html": "https://unsplash.com/photos/bunch-of-vegetables-D6Tu_L3chLE",
            "download_location": "https://api.unsplash.com/photos/D6Tu_L3chLE/download?ixid=abc"
          },
          "user": { "name": "nrd", "links": { "html": "https://unsplash.com/@nicotitto" } }
        },
        { "id": "broken", "width": 10 }
      ]
    }
    """

    // MARK: - Request shape (FRD §5.2)

    func testSearchRequestMatchesTheFRDEndpointAndHeaders() throws {
        let request = makeClient().makeSearchRequest(query: "grocery shopping vegetables")
        let components = try XCTUnwrap(URLComponents(url: request.url!, resolvingAgainstBaseURL: false))
        let items = Dictionary(uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") })

        XCTAssertEqual(components.scheme, "https")
        XCTAssertEqual(components.host, "api.unsplash.com")
        XCTAssertEqual(components.path, "/search/photos")
        XCTAssertEqual(items["query"], "grocery shopping vegetables")
        XCTAssertEqual(items["orientation"], "landscape")
        XCTAssertEqual(items["per_page"], "8")
        XCTAssertEqual(items["page"], "1")
        XCTAssertEqual(items["order_by"], "relevant")
        XCTAssertEqual(items["content_filter"], "high")
        XCTAssertNil(items["size"], "Unsplash search has no size parameter")
        XCTAssertEqual(request.httpMethod, "GET")
        XCTAssertEqual(request.timeoutInterval, 7)
        XCTAssertEqual(request.value(forHTTPHeaderField: "Authorization"), "Client-ID TEST_ACCESS_KEY")
        XCTAssertEqual(request.value(forHTTPHeaderField: "Accept-Version"), "v1")
    }

    // MARK: - Parsing

    func testSearchMapsPhotosIntoCandidatesAndToleratesBrokenOnes() async throws {
        StubURLProtocol.handler = { [self] request in respond(request, status: 200, body: searchJSON) }

        let candidates = try await makeClient().search(query: "grocery shopping vegetables")

        XCTAssertEqual(candidates.count, 2)
        let first = candidates[0]
        XCTAssertEqual(first.providerPhotoID, "D6Tu_L3chLE")
        XCTAssertEqual(first.imageURL, "https://images.unsplash.com/photo-1?w=400")
        XCTAssertEqual(first.sourceURL, "https://unsplash.com/photos/bunch-of-vegetables-D6Tu_L3chLE")
        XCTAssertEqual(first.downloadLocation, "https://api.unsplash.com/photos/D6Tu_L3chLE/download?ixid=abc")
        XCTAssertEqual(first.photographerName, "nrd")
        XCTAssertEqual(first.photographerURL, "https://unsplash.com/@nicotitto")
        XCTAssertEqual(first.altText, "bunch of vegetables")
        XCTAssertEqual(first.width, 3957)
        XCTAssertEqual(first.blurHash, "LDDSa5X*txobx[RkNHWB~Us.$%WW")

        // The malformed photo decodes but is rejected by the selector, never crashing the pipeline.
        XCTAssertTrue(PhotoSelector.filter([candidates[1]]).isEmpty)
        XCTAssertEqual(PhotoSelector.filter(candidates).map(\.providerPhotoID), ["D6Tu_L3chLE"])
    }

    func testAltFallsBackToDescription() throws {
        let json = #"{"results":[{"id":"x","description":"A man drinking coffee","alt_description":null}]}"#
        let candidates = try UnsplashClient.candidates(from: Data(json.utf8))

        XCTAssertEqual(candidates.first?.altText, "A man drinking coffee")
    }

    func testGarbageBodyIsAnInvalidResponse() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 200, body: "not json") }

        await assertThrows(.invalidResponse) { _ = try await makeClient().search(query: "a b") }
    }

    // MARK: - Error mapping (FRD §9)

    func testUnauthorizedIsInvalidKeyAndDoesNotRetry() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 401) }

        await assertThrows(.invalidKey) { _ = try await makeClient().search(query: "a b") }
        XCTAssertEqual(StubURLProtocol.requests.count, 1)
    }

    func testForbiddenWithZeroRemainingIsQuotaExhausted() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 403, headers: ["X-Ratelimit-Remaining": "0"]) }

        await assertThrows(.quotaExhausted) { _ = try await makeClient().search(query: "a b") }
        XCTAssertEqual(StubURLProtocol.requests.count, 1, "403 must never retry in a loop")
    }

    func testForbiddenWithQuotaLeftIsAPermissionProblem() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 403, headers: ["X-Ratelimit-Remaining": "37"]) }

        await assertThrows(.invalidKey) { _ = try await makeClient().search(query: "a b") }
    }

    func testTooManyRequestsIsQuotaExhaustedWithoutRetry() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 429) }

        await assertThrows(.quotaExhausted) { _ = try await makeClient().search(query: "a b") }
        XCTAssertEqual(StubURLProtocol.requests.count, 1)
    }

    func testNotFound() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 404) }

        await assertThrows(.notFound) { _ = try await makeClient().search(query: "a b") }
    }

    // MARK: - Retry once for transient failures

    func testServerErrorRetriesOnceThenSucceeds() async throws {
        let calls = Counter()
        StubURLProtocol.handler = { [self] request in
            calls.increment() == 1 ? respond(request, status: 503) : respond(request, status: 200, body: searchJSON)
        }

        let candidates = try await makeClient().search(query: "a b")

        XCTAssertEqual(candidates.count, 2)
        XCTAssertEqual(StubURLProtocol.requests.count, 2)
    }

    func testServerErrorTwiceGivesUpAfterOneRetry() async {
        StubURLProtocol.handler = { [self] request in respond(request, status: 500) }

        await assertThrows(.server(500)) { _ = try await makeClient().search(query: "a b") }
        XCTAssertEqual(StubURLProtocol.requests.count, 2)
    }

    func testOfflineRetriesOnceThenReportsNetwork() async {
        StubURLProtocol.handler = { _ in throw URLError(.notConnectedToInternet) }

        await assertThrows(.network) { _ = try await makeClient().search(query: "a b") }
        XCTAssertEqual(StubURLProtocol.requests.count, 2)
    }

    // MARK: - Download ping (FRD §5.4)

    func testDownloadPingGoesToUnsplashWithTheClientIDHeader() async throws {
        StubURLProtocol.handler = { [self] request in respond(request, status: 200, body: #"{"url":"x"}"#) }

        try await makeClient().trackDownload(location: "https://api.unsplash.com/photos/abc/download?ixid=1")

        let request = try XCTUnwrap(StubURLProtocol.requests.first)
        XCTAssertEqual(request.url?.host, "api.unsplash.com")
        XCTAssertEqual(request.value(forHTTPHeaderField: "Authorization"), "Client-ID TEST_ACCESS_KEY")
    }

    func testAccessKeyIsNeverSentToAnotherHost() async {
        let untrusted = [
            "https://evil.example.com/photos/abc/download",
            "http://api.unsplash.com/photos/abc/download",
            "https://api.unsplash.com.evil.example.com/photos/abc/download",
            "not a url",
            "",
        ]
        for location in untrusted {
            await assertThrows(.untrustedURL, "location: \(location)") {
                try await makeClient().trackDownload(location: location)
            }
        }
        XCTAssertTrue(StubURLProtocol.requests.isEmpty, "no request may leave for an untrusted host")
    }

    // MARK: - Key from the bundle

    func testUsableKeyRejectsMissingEmptyPlaceholderAndUnexpandedValues() {
        XCTAssertNil(UnsplashClient.usableKey(nil))
        XCTAssertNil(UnsplashClient.usableKey(""))
        XCTAssertNil(UnsplashClient.usableKey("   "))
        XCTAssertNil(UnsplashClient.usableKey("$(UNSPLASH_ACCESS_KEY)"))
        XCTAssertNil(UnsplashClient.usableKey("your-unsplash-access-key"))
        XCTAssertEqual(UnsplashClient.usableKey("  abc123 "), "abc123")
    }

    func testTheAppBundleNeverCarriesTheSecretKey() {
        // Only the access key is wired into Info.plist; the secret key is for OAuth and must not ship.
        let keys = (Bundle.main.infoDictionary ?? [:]).keys
        XCTAssertFalse(keys.contains { $0.lowercased().contains("secret") })
    }

    // MARK: - Helpers

    private func assertThrows(
        _ expected: ImageSearchError,
        _ message: String = "",
        file: StaticString = #filePath,
        line: UInt = #line,
        _ body: () async throws -> Void
    ) async {
        do {
            try await body()
            XCTFail("expected \(expected) \(message)", file: file, line: line)
        } catch let error as ImageSearchError {
            XCTAssertEqual(error, expected, message, file: file, line: line)
        } catch {
            XCTFail("unexpected error \(error) \(message)", file: file, line: line)
        }
    }
}

final class Counter: @unchecked Sendable {
    private let lock = NSLock()
    private var value = 0

    @discardableResult
    func increment() -> Int {
        lock.lock(); defer { lock.unlock() }
        value += 1
        return value
    }
}
