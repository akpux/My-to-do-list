import Foundation

/// The photo credit Unsplash requires for every photo we show (FRD §8.2):
/// `Photo by {name} on Unsplash`, with both links tagged for referral tracking.
/// Pure and offline so the exact string and URLs are unit tested.
struct VisualAttribution: Equatable {
    static let utmSource = "my_to_do_list"
    static let utmMedium = "referral"
    static let unsplashHome = "https://unsplash.com"

    let photographerName: String
    /// Nil when the provider gave no profile link; the name is then shown without a link.
    let photographerURL: URL?
    let unsplashURL: URL

    /// The exact required wording.
    var text: String { "Photo by \(photographerName) on Unsplash" }

    /// The same wording with the photographer and Unsplash as tappable links.
    var attributedText: AttributedString {
        var result = AttributedString("Photo by ")

        var name = AttributedString(photographerName)
        if let photographerURL { name.link = photographerURL }
        result += name

        result += AttributedString(" on ")

        var unsplash = AttributedString("Unsplash")
        unsplash.link = unsplashURL
        result += unsplash
        return result
    }

    init?(photographerName: String?, photographerURL: String?) {
        let name = (photographerName ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty, let unsplash = Self.tagged(Self.unsplashHome) else { return nil }
        self.photographerName = name
        self.photographerURL = photographerURL.flatMap(Self.tagged)
        self.unsplashURL = unsplash
    }

    /// Nil unless the task has a photo that is actually shown. Never credit a non-`ready` state.
    init?(task: TodoTask) {
        guard task.hasReadyVisual else { return nil }
        self.init(photographerName: task.visualPhotographerName, photographerURL: task.visualPhotographerURL)
    }

    /// Adds `utm_source` / `utm_medium`, keeping any existing query items (joined with `&`) and
    /// replacing stale UTM values. Only `https` links are accepted because the input comes from the
    /// network and is stored on disk.
    static func tagged(_ string: String) -> URL? {
        guard var components = URLComponents(string: string),
              components.scheme == "https",
              components.host?.isEmpty == false else { return nil }

        if components.path.isEmpty { components.path = "/" }
        var items = (components.queryItems ?? []).filter { $0.name != "utm_source" && $0.name != "utm_medium" }
        items.append(URLQueryItem(name: "utm_source", value: utmSource))
        items.append(URLQueryItem(name: "utm_medium", value: utmMedium))
        components.queryItems = items
        return components.url
    }
}
