import XCTest
@testable import MyToDoList

final class PhotoSelectorTests: XCTestCase {
    private func candidate(
        _ id: String,
        imageURL: String? = "https://images.unsplash.com/photo-\(UUID().uuidString)?w=400",
        downloadLocation: String? = "https://api.unsplash.com/photos/x/download",
        width: Int = 4000,
        height: Int = 3000,
        alt: String? = "bunch of vegetables",
        photographer: String? = "Jane Doe"
    ) -> ImageCandidate {
        ImageCandidate(
            providerPhotoID: id,
            imageURL: imageURL,
            sourceURL: "https://unsplash.com/photos/\(id)",
            downloadLocation: downloadLocation,
            width: width,
            height: height,
            altText: alt,
            photographerName: photographer,
            photographerURL: "https://unsplash.com/@jane",
            blurHash: nil
        )
    }

    // MARK: - Stable index

    func testSameSeedGivesSameIndex() {
        let a = PhotoSelector.stableIndex(seed: "task-1:grocery shopping vegetables", count: 8)
        let b = PhotoSelector.stableIndex(seed: "task-1:grocery shopping vegetables", count: 8)

        XCTAssertNotNil(a)
        XCTAssertEqual(a, b)
    }

    func testStableIndexIsAlwaysInRange() {
        for count in 1...12 {
            for n in 0..<200 {
                let index = PhotoSelector.stableIndex(seed: "seed-\(n)", count: count)
                XCTAssertNotNil(index)
                XCTAssertTrue((0..<count).contains(index!), "seed-\(n) count \(count) -> \(index!)")
            }
        }
    }

    func testStableIndexOnEmptyListIsNilNotACrash() {
        XCTAssertNil(PhotoSelector.stableIndex(seed: "anything", count: 0))
        XCTAssertNil(PhotoSelector.stableIndex(seed: "anything", count: -3))
    }

    func testStableIndexIsPinnedAcrossLaunches() {
        // djb2 is fixed. If this fails the algorithm changed and every stored choice would drift on refetch.
        // djb2("a") = 5381 * 33 + 97 = 177_670
        XCTAssertEqual(PhotoSelector.stableIndex(seed: "a", count: 1_000_000), 177_670)
    }

    func testDifferentTasksDoNotAllLandOnTheSamePhoto() {
        let query = "grocery shopping vegetables"
        let indexes = (0..<40).compactMap { _ in
            PhotoSelector.stableIndex(seed: PhotoSelector.seed(taskID: UUID(), query: query), count: 8)
        }

        XCTAssertGreaterThan(Set(indexes).count, 1, "all 40 tasks picked the same index")
    }

    func testSeedCombinesTaskIDAndQuery() {
        let id = UUID()

        XCTAssertEqual(PhotoSelector.seed(taskID: id, query: "a b"), "\(id.uuidString):a b")
    }

    // MARK: - Filter

    func testFilterKeepsAGoodCandidate() {
        XCTAssertEqual(PhotoSelector.filter([candidate("good")]).map(\.providerPhotoID), ["good"])
    }

    func testFilterDropsCandidatesMissingImageURLDownloadLocationOrPhotographer() {
        let candidates = [
            candidate("noURL", imageURL: nil),
            candidate("blankURL", imageURL: "   "),
            candidate("noDownload", downloadLocation: nil),
            candidate("noPhotographer", photographer: nil),
            candidate("blankPhotographer", photographer: " "),
            candidate("good"),
        ]

        XCTAssertEqual(PhotoSelector.filter(candidates).map(\.providerPhotoID), ["good"])
    }

    func testFilterDropsTooSmallImages() {
        let candidates = [
            candidate("narrow", width: 599),
            candidate("short", height: 399),
            candidate("exactMinimum", width: 600, height: 400),
        ]

        XCTAssertEqual(PhotoSelector.filter(candidates).map(\.providerPhotoID), ["exactMinimum"])
    }

    func testFilterDropsUnsafeAltText() {
        let candidates = [
            candidate("gun", alt: "man holding a gun"),
            candidate("nude", alt: "Nude statue in museum"),
            candidate("phrase", alt: "a dead body on a road"),
            candidate("safe", alt: "gunmetal laptop on desk"),
            candidate("noAlt", alt: nil),
        ]

        XCTAssertEqual(Set(PhotoSelector.filter(candidates).map(\.providerPhotoID)), ["safe", "noAlt"])
    }

    func testFilterDropsExcludedIDs() {
        let candidates = [candidate("a"), candidate("b")]

        XCTAssertEqual(PhotoSelector.filter(candidates, excluding: ["a"]).map(\.providerPhotoID), ["b"])
    }

    // MARK: - Select

    func testSelectOnEmptyListIsNil() {
        XCTAssertNil(PhotoSelector.select(taskID: UUID(), query: "a b", from: []))
    }

    func testSelectWhenEverythingIsFilteredIsNil() {
        let candidates = [candidate("tiny", width: 10, height: 10)]

        XCTAssertNil(PhotoSelector.select(taskID: UUID(), query: "a b", from: candidates))
    }

    func testSelectIsStableForTheSameTaskAndQuery() {
        let id = UUID()
        let candidates = (0..<8).map { candidate("p\($0)") }

        let first = PhotoSelector.select(taskID: id, query: "grocery shopping vegetables", from: candidates)
        let second = PhotoSelector.select(taskID: id, query: "grocery shopping vegetables", from: candidates)

        XCTAssertNotNil(first)
        XCTAssertEqual(first, second)
    }

    func testSelectIndexesIntoTheFilteredListNotTheRawOne() {
        // Only one candidate survives, so it must be the one returned regardless of seed.
        let candidates = [candidate("bad1", width: 1, height: 1), candidate("only"), candidate("bad2", photographer: nil)]

        for _ in 0..<20 {
            XCTAssertEqual(PhotoSelector.select(taskID: UUID(), query: "a b", from: candidates)?.providerPhotoID, "only")
        }
    }

    func testSelectCanExcludeTheCurrentPhoto() {
        let candidates = [candidate("current"), candidate("next")]

        for _ in 0..<20 {
            XCTAssertEqual(
                PhotoSelector.select(taskID: UUID(), query: "a b", from: candidates, excluding: ["current"])?.providerPhotoID,
                "next"
            )
        }
    }
}
