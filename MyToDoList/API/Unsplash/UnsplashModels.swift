import Foundation

/// `GET /search/photos` response decoding and mapping into `ImageCandidate` (FRD §5.2).
extension UnsplashClient {
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
