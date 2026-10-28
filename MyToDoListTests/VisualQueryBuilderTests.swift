import XCTest
@testable import MyToDoList

final class VisualQueryBuilderTests: XCTestCase {
    // MARK: - Keyword map

    func testGroceriesForDinnerMapsToGroceryQuery() {
        let result = VisualQueryBuilder.build(title: "Buy groceries for dinner", category: .home)

        XCTAssertEqual(result.query, "grocery shopping vegetables")
        XCTAssertEqual(result.matchedRuleID, "keyword.grocery")
        XCTAssertFalse(result.isSensitive)
        XCTAssertTrue(result.shouldSearch)
    }

    func testKeywordWinsOverCategory() {
        let result = VisualQueryBuilder.build(title: "Morning run", category: .work)

        XCTAssertEqual(result.query, "fitness workout gym")
    }

    func testDesignReviewMapsToCreativeWorkspace() {
        let result = VisualQueryBuilder.build(title: "Q3 design review", category: .work)

        XCTAssertEqual(result.query, "creative design workspace")
    }

    func testPayingABillMapsToPaperwork() {
        let result = VisualQueryBuilder.build(title: "Pay electricity bill", category: nil)

        XCTAssertEqual(result.query, "calculator paperwork desk")
    }

    func testMatchingIsWholeWordSoCardDoesNotMatchCar() {
        let result = VisualQueryBuilder.build(title: "Buy birthday card envelope", category: nil)

        // "birthday" legitimately matches; the point is `car` did not win via "card".
        XCTAssertEqual(result.matchedRuleID, "keyword.celebration")
        XCTAssertNotEqual(VisualQueryBuilder.build(title: "Order a card", category: nil).matchedRuleID, "keyword.car")
    }

    func testMarketingIsNotGroceryMarket() {
        let result = VisualQueryBuilder.build(title: "Marketing plan", category: .work)

        XCTAssertEqual(result.matchedRuleID, "category.work")
    }

    func testPunctuationAndCaseAreNormalized() {
        let result = VisualQueryBuilder.build(title: "  GROCERIES!!!  ", category: nil)

        XCTAssertEqual(result.query, "grocery shopping vegetables")
    }

    // MARK: - Category fallback (FRD §3.4)

    func testVagueWorkTitleFallsBackToOfficeDesk() {
        let result = VisualQueryBuilder.build(title: "Sort it out", category: .work)

        XCTAssertEqual(result.query, "office desk workspace")
        XCTAssertEqual(result.matchedRuleID, "category.work")
    }

    func testEveryCategoryHasAFallback() {
        XCTAssertEqual(VisualQueryBuilder.build(title: "Sort it out", category: .home).query, "home interior living")
        XCTAssertEqual(VisualQueryBuilder.build(title: "Sort it out", category: .random).query, "everyday lifestyle still life")
        XCTAssertEqual(VisualQueryBuilder.build(title: "Call mom", category: nil).query, "checklist notebook desk")
    }

    // MARK: - Empty title

    func testEmptyTitleIsNeverSearched() {
        for title in ["", "   ", "\n\t"] {
            let result = VisualQueryBuilder.build(title: title, category: .home)
            XCTAssertFalse(result.shouldSearch, "title: \(title.debugDescription)")
            XCTAssertEqual(result.query, "")
            XCTAssertFalse(result.isSensitive)
        }
    }

    // MARK: - Privacy

    func testMedicationTitleIsBlockedWithNoQuery() {
        let result = VisualQueryBuilder.build(title: "Discuss medication with my doctor", category: .random)

        XCTAssertTrue(result.isSensitive)
        XCTAssertEqual(result.query, "")
        XCTAssertFalse(result.shouldSearch)
    }

    func testMedicalWordingNeverProducesAClinicQuery() {
        for title in ["Dentist appointment", "Book doctor visit", "Therapy session", "Clinic checkup"] {
            let result = VisualQueryBuilder.build(title: title, category: .home)
            XCTAssertTrue(result.isSensitive, title)
            XCTAssertFalse(result.query.contains("clinic"), title)
        }
    }

    func testSensitiveTitlesAreBlocked() {
        let titles = [
            "Reset my password",
            "Share OTP with bank",
            "Send bank account number",
            "Meet my lawyer",
            "Court hearing Monday",
            "Sign the NDA",
            "Confidential client pitch",
            "Divorce paperwork",
            "Email sam@example.com",
            "Call 555 123 4567",
            "Visit 221 Baker Street",
            "Tinder date",
        ]
        for title in titles {
            XCTAssertTrue(VisualPrivacyGuard.isSensitive(title), "should block: \(title)")
            XCTAssertFalse(VisualQueryBuilder.build(title: title, category: .home).shouldSearch, "should not search: \(title)")
        }
    }

    func testOrdinaryTitlesAreNotBlocked() {
        let titles = [
            "Buy groceries for dinner",
            "Q3 design review",
            "Morning run",
            "Pay electricity bill",
            "Call mom",
            "Plan 2026 budget",
            "Water the plants",
        ]
        for title in titles {
            XCTAssertFalse(VisualPrivacyGuard.isSensitive(title), "should allow: \(title)")
        }
    }

    func testSensitiveRuleIDNeverContainsTheTitle() {
        let title = "Discuss medication with Zorblax"
        let ruleID = VisualPrivacyGuard.sensitiveRuleID(for: title) ?? ""

        XCTAssertFalse(ruleID.isEmpty)
        XCTAssertFalse(ruleID.lowercased().contains("zorblax"))
    }

    func testRawTitleNeverAppearsInTheQuery() {
        let title = "Buy groceries for dinner at Zorblax Market"
        let result = VisualQueryBuilder.build(title: title, category: .home)

        XCTAssertFalse(result.query.lowercased().contains("zorblax"))
    }

    // MARK: - Query shape (FRD §5.1 rule 6)

    func testEveryProducedQueryIsTwoToFiveWordsAsciiLetters() {
        var queries = VisualQueryBuilder.keywordRules.map(\.query)
        queries += [nil, .work, .home, .random].map { VisualQueryBuilder.categoryFallback(for: $0).query }

        for query in queries {
            XCTAssertTrue(VisualQueryBuilder.isValidQuery(query), "invalid query: \(query)")
        }
    }

    func testIsValidQueryRejectsBadShapes() {
        XCTAssertFalse(VisualQueryBuilder.isValidQuery(""))
        XCTAssertFalse(VisualQueryBuilder.isValidQuery("groceries"))
        XCTAssertFalse(VisualQueryBuilder.isValidQuery("one two three four five six"))
        XCTAssertFalse(VisualQueryBuilder.isValidQuery("Buy groceries"))
        XCTAssertFalse(VisualQueryBuilder.isValidQuery("buy, groceries"))
        XCTAssertFalse(VisualQueryBuilder.isValidQuery("cafe\u{301} table"))
        XCTAssertTrue(VisualQueryBuilder.isValidQuery("grocery shopping vegetables"))
    }

    func testKeywordRuleIDsAreUnique() {
        let ids = VisualQueryBuilder.keywordRules.map(\.id)
        XCTAssertEqual(ids.count, Set(ids).count)
    }

    func testBuildIsDeterministic() {
        let first = VisualQueryBuilder.build(title: "Sort it out", category: .work)
        let second = VisualQueryBuilder.build(title: "Sort it out", category: .work)

        XCTAssertEqual(first, second)
    }
}
