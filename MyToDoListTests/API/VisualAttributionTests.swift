import XCTest
@testable import MyToDoList

final class VisualAttributionTests: XCTestCase {
    private func query(_ url: URL?) -> [String: String] {
        guard let url, let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return [:] }
        return Dictionary(uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") })
    }

    func testTextIsTheExactRequiredWording() {
        let credit = VisualAttribution(photographerName: "Jane Doe", photographerURL: "https://unsplash.com/@jane")

        XCTAssertEqual(credit?.text, "Photo by Jane Doe on Unsplash")
        XCTAssertEqual(String(credit!.attributedText.characters), "Photo by Jane Doe on Unsplash")
    }

    func testBothLinksCarryTheReferralUTMParameters() throws {
        let credit = try XCTUnwrap(VisualAttribution(photographerName: "Jane", photographerURL: "https://unsplash.com/@jane"))

        for url in [credit.photographerURL, credit.unsplashURL] {
            let items = query(url)
            XCTAssertEqual(items["utm_source"], "my_to_do_list", "\(String(describing: url))")
            XCTAssertEqual(items["utm_medium"], "referral", "\(String(describing: url))")
        }
        XCTAssertEqual(credit.photographerURL?.host, "unsplash.com")
        XCTAssertEqual(credit.photographerURL?.path, "/@jane")
        XCTAssertEqual(credit.unsplashURL.host, "unsplash.com")
    }

    func testExistingQueryStringIsJoinedWithAmpersand() throws {
        let url = try XCTUnwrap(VisualAttribution.tagged("https://unsplash.com/@jane?foo=bar"))

        XCTAssertEqual(url.absoluteString.filter { $0 == "?" }.count, 1)
        XCTAssertEqual(query(url)["foo"], "bar")
        XCTAssertEqual(query(url)["utm_source"], "my_to_do_list")
    }

    func testStaleUTMValuesAreReplacedNotDuplicated() throws {
        let url = try XCTUnwrap(VisualAttribution.tagged("https://unsplash.com/@jane?utm_source=other&utm_medium=email"))
        let names = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems?.map(\.name) ?? []

        XCTAssertEqual(names.filter { $0 == "utm_source" }.count, 1)
        XCTAssertEqual(query(url)["utm_source"], "my_to_do_list")
        XCTAssertEqual(query(url)["utm_medium"], "referral")
    }

    func testNonHTTPSLinksAreRejected() {
        XCTAssertNil(VisualAttribution.tagged("http://unsplash.com/@jane"))
        XCTAssertNil(VisualAttribution.tagged("javascript:alert(1)"))
        XCTAssertNil(VisualAttribution.tagged("tel:5551234"))
        XCTAssertNil(VisualAttribution.tagged("not a url"))
        XCTAssertNil(VisualAttribution.tagged(""))
    }

    func testMissingProfileLinkStillCreditsByName() throws {
        let credit = try XCTUnwrap(VisualAttribution(photographerName: "Jane", photographerURL: nil))

        XCTAssertNil(credit.photographerURL)
        XCTAssertEqual(credit.text, "Photo by Jane on Unsplash")
    }

    func testBlankPhotographerNameProducesNoCredit() {
        XCTAssertNil(VisualAttribution(photographerName: nil, photographerURL: nil))
        XCTAssertNil(VisualAttribution(photographerName: "   ", photographerURL: "https://unsplash.com/@x"))
    }

    func testOnlyReadyTasksHaveACredit() {
        let task = TodoTask(title: "Buy groceries")
        task.visualPhotographerName = "Jane"
        task.visualPhotographerURL = "https://unsplash.com/@jane"
        task.visualImageURL = "https://images.unsplash.com/photo-1?w=400"

        for status in [TaskVisualStatus.idle, .pending, .fallback, .skippedNoKey, .privacyBlocked, .noResults] {
            task.visualStatus = status
            XCTAssertNil(VisualAttribution(task: task), "no credit for \(status)")
        }

        task.visualStatus = .ready
        XCTAssertEqual(VisualAttribution(task: task)?.text, "Photo by Jane on Unsplash")
    }

    func testReadyWithoutAnImageURLIsNotCredited() {
        let task = TodoTask(title: "Buy groceries")
        task.visualStatus = .ready
        task.visualPhotographerName = "Jane"

        XCTAssertNil(VisualAttribution(task: task))
    }

    func testAttributedTextLinksTheNameAndUnsplash() throws {
        let credit = try XCTUnwrap(VisualAttribution(photographerName: "Jane", photographerURL: "https://unsplash.com/@jane"))
        let links = credit.attributedText.runs.compactMap { run in run.link.map { (String(credit.attributedText[run.range].characters), $0) } }

        XCTAssertEqual(links.map(\.0), ["Jane", "Unsplash"])
        XCTAssertEqual(links[0].1, credit.photographerURL)
        XCTAssertEqual(links[1].1, credit.unsplashURL)
    }
}
