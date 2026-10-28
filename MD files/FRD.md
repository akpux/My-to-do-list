# Functional Requirements Document — My To-do List

**Status:** Living document  
**Last updated:** 2026-10-07  
**Audience:** Product owner + coding agents (Cursor)  
**Scope of this revision:** Capture the **as-built MVP**, then make **task visuals via Unsplash** normative v1 scope (query → search → pick → download ping → persist → render). Task visuals are now **built**; see the “Implementation status” note in §4. Provider changed from Pexels to Unsplash on 2026-10-07 because the free Pexels API is no longer available.

This file is the product/context companion to `AGENTS.md` (pixel → SwiftUI / HIG rules). When they conflict on **UI construction**, `AGENTS.md` wins. When they conflict on **what the product should do**, this FRD wins.

`task-visuals-feature-implementation.md` (same folder) is a **non-binding reference** from the original planning discussion. It describes a web stack and Pexels. This FRD supersedes it wherever they differ.

---

## 1. Purpose

My To-do List is a native iOS app that helps one person capture, organize, complete, and restore personal tasks on a single device.

**Next advancement (v1 scope of §4–§9):** each task can show a **relevant stock photograph** derived from the task title and type. Relevance is **not** a single “AI understands the task” API. It is a **small pipeline we design**:

1. App logic turns `title` + `category` into a short visual search query.
2. Unsplash ranks photos for that query.
3. App logic picks one photo from the ranked list in a **deterministic, user-friendly** way, pings Unsplash’s download endpoint once, then stores the photo’s URLs and attribution on the task.

**Unsplash is the v1 provider.** Pexels is documented only as a possible future failover (§11); its free API is currently unavailable.

---

## 2. Product principles

1. **On-device first.** Tasks and profile live in SwiftData. There is no account, sync, or backend in the current product.
2. **HIG-native UI.** Lists, forms, navigation, system fonts/colors. Brand purple via `AppTheme` only.
3. **Local intelligence over vendor magic.** Unsplash never sees our domain model. We send a 2–5 word visual query.
4. **Stable visuals.** Same task + same query → same image (memory and debugging). Different tasks may share a query but should not all get photo `[0]`.
5. **Fail softly.** Network, empty results, missing API key, exhausted quota, or sensitive titles never block creating or editing a task. Fall back to the existing category SF Symbol / empty chrome.
6. **Privacy by construction.** Task titles stay on device except as a **sanitized query string** sent to Unsplash. Do not send full titles, names, addresses, or health content as the search string.
7. **Provider guidelines are product requirements.** Unsplash’s attribution, hotlinking, and download-tracking rules (§5.4, §8.2) are not nice-to-haves. A build that skips them is not done.

---

## 3. Current product (as-built)

### 3.1 Platform

| Item | Value |
|---|---|
| Platform | iOS 17+ |
| UI | SwiftUI |
| Persistence | SwiftData on device |
| Identity | Local `UserProfile.displayName` only |
| Backend | None |
| Analytics | None |
| Auth in launch flow | None (Sign Up / Forgot Password are parked UI) |

Repo map: see `AGENTS.md` §3.

### 3.2 Launch flow

1. If no `UserProfile` exists → `WelcomeView` (name only) → persist profile.
2. If profile exists → `TaskListView`.
3. Root tint: `AppTheme.accent`.

Parked (not in launch): `SignUpView`, forgot-password UI in `AuthViews.swift`. Passwords on those screens are never stored.

### 3.3 Task domain model (`TodoTask`)

| Field | Required | Notes |
|---|---|---|
| `id` | yes | UUID, unique |
| `title` | yes | Non-empty after trim |
| `dueDate` | no | Date + time when set |
| `category` | no | `Work` / `Home` / `Random` |
| `priority` | no | `High` / `Medium` / `Low` |
| `isCompleted` | yes | Default false |
| `createdAt` | yes | |
| `completedAt` | no | Set when completed; cleared when incomplete |
| `visual*` | no | Task visual fields, see §7 (implemented 2026-10-07) |

**Missed:** `dueDate != nil` AND `dueDate < now` AND not completed.

There is **no** list/project entity. “The list” is the user’s full set of tasks, filtered by Pending / Completed.

### 3.4 Task type (category)

Current enum — **use these names in code and FRD**, not the example type `errand` from research notes:

| Category | SF Symbol | Visual-query fallback (§5.1) |
|---|---|---|
| Work | `briefcase` | `office desk workspace` |
| Home | `house` | `home interior living` |
| Random | `sparkles` | `everyday lifestyle still life` |
| None | — | `checklist notebook desk` |

### 3.5 User-facing capabilities (MVP)

| ID | Capability | Behavior |
|---|---|---|
| FR-L1 | See pending / completed | Segmented control; counts in labels |
| FR-L2 | Sort | Recently added, Deadline, Task type, Missed, Priority |
| FR-L3 | Group in list | By due calendar day: Today, Yesterday, date, or “No deadline” |
| FR-L4 | Add task | Bottom-bar Add → full-screen `TaskEditorView` |
| FR-L5 | Edit task | **Pending and completed cards:** Edit footer opens existing `TaskEditorView` cover (form UI unchanged). |
| FR-L6 | Complete / uncomplete | Trailing custom checkbox on the card (`TaskCheckbox`) |
| FR-L7 | Delete | Swipe-to-delete on **completed** `List` rows |
| FR-L8 | Reinstate missed completed | Tap completed row with a deadline → sheet: reschedule (opens editor) or remove deadline |
| FR-L9 | Greeting | Large title `Hey, {displayName}` + subtitle “Let’s organise your day”; sort is trailing funnel `Menu` |

Figma frames (Console): pending empty `105:1810`, pending filled `105:1818`, completed **empty** `105:1836`, homepage icons `105:1808`. `TaskRow` component set `82:1370`: `State=pending` / `State=missed` / `State=completed`.

**Completed tab (`105:1836`):** same chrome as pending empty. Segmented control **Selected=2** (Completed). Empty copy: title “No Tasks Here”, description **“Completed tasks will appear here”**. Add Task still present. There is **no filled completed list frame**; filled completed chrome is the `TaskRow` variant `State=completed` (`82:1371`): checked checkbox, dimmed thumbnail, Edit still shown. Missed pending uses footer “Missed” in red (`97:985`).

### 3.6 Explicit non-goals of the current MVP

- Cloud sync, multi-device, multi-user
- Accounts, OAuth, email/password storage
- Recurring tasks, subtasks, attachments, tags beyond category
- Widgets, Watch, iPad-specific layout (iPhone-first; iPad not specified)
- LLM on device or in cloud
- User-uploaded or AI-generated images (stock photos are in scope; see §4)

---

## 4. Advancement: task visuals (Unsplash)

### Implementation status (2026-10-07)

Built and covered by unit tests (no live network in tests): `VisualQueryBuilder` + `VisualPrivacyGuard`, `PhotoSelector`, `UnsplashClient`, `TaskVisualService`, `VisualAttribution`, the `visual*` fields on `TodoTask`, the `TaskRow` photo thumbnail, the row context-menu credit, and the editor credit line. The key is delivered through `.env` → `scripts/sync-secrets.sh` → gitignored `Config/Secrets.xcconfig` → `Config/App-Info.plist` (`UnsplashAccessKey`). Not built (deliberately, see §4.3): refresh/remove controls, `blur_hash` decoding, a proxy, a second provider.

Needs a human in Xcode: confirm the `ready` / fallback / completed thumbnail states in the “Photo ready / fallback / completed” preview in `TaskRow.swift`, and the long-press credit menu on a device or simulator.

### 4.1 Goal

When a user creates or meaningfully updates a task, the app attaches **one landscape stock photo** that illustrates the *visual concept* of the task (not a literal screenshot of the title). That photo appears on the task row / card. Attribution and download tracking follow the Unsplash API Guidelines (§5.4, §8.2).

The photo is an **ambient recognition cue**. It is never required to create, complete, navigate, or understand a task. The title stays the primary content.

### 4.2 User stories

1. As a user, when I add “Buy groceries for dinner” as **Home**, I see a grocery/food photo on that task, not a generic office photo.
2. As a user, if I reopen the app offline, I still see the photo I already got. The stored image URL is loaded through the system URL cache; the app does not keep its own copy of the file (§7, hotlinking).
3. As a user, if photos fail, my task still saves and shows the existing row (symbol + text).
4. As a user, two different grocery tasks do not always show the identical first Unsplash result.
5. As a user, I am not surprised by offensive or highly personal imagery derived from a private title.
6. As a user, I can find out who took a task’s photo and open their Unsplash profile.

### 4.3 Out of scope for v1 visuals

- Pexels (or any second provider) failover — documented in §11 only
- LLM query generation
- User picking from a gallery of 8 photos
- User refresh / remove / “use type icon instead” controls (the status model leaves room for them later)
- Per-list / cover image for the whole app (there is no list entity)
- Collections, random-photo, or topic endpoints
- Face detection / NSFW ML classifiers (we rely on our sensitivity gate plus Unsplash `content_filter=high`)
- Persisting downloaded image files on disk (Unsplash requires hotlinking)
- Analytics (the app has none)
- Regenerating images on every list scroll

### 4.4 Success criteria

- Create/edit with a non-sensitive title results in a stored visual **or** a terminal fallback state, without blocking save.
- Query strings are 2–5 words, visual, and category-aware.
- Selection uses **Option B** (stable index), not `photos[0]` only and not `random()`.
- UI never crashes on missing image; uses category symbol fallback.
- Every `ready` visual can show `Photo by {name} on Unsplash` with UTM-tagged links (§8.2).
- The download ping (§5.4) fires exactly once per photo selection.
- `UNSPLASH_ACCESS_KEY` is not committed to git, and `.env` is gitignored.
- The Unsplash **secret** key is never copied into the app build.
- Unit tests cover query mapping, stable index, and attribution strings without hitting the network.

---

## 5. Intelligence pipeline (normative)

Unsplash does **not** know this is a to-do app, or what Work vs Home means. It only sees `query`.

```
title + category
        │
        ▼
┌───────────────────────┐
│ 1. VisualQueryBuilder │  heuristics → query string + sensitivity flag
└───────────┬───────────┘
            │ skip if sensitive / empty
            ▼
┌───────────────────────┐
│ 2. UnsplashClient     │  GET /search/photos  (ranking owned by Unsplash)
└───────────┬───────────┘
            │ photos[0..<N]
            ▼
┌───────────────────────┐
│ 3. PhotoSelector      │  filter, then stableIndex(taskId + query, N)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ 3.5 Download ping     │  GET links.download_location (event only)
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ 4. VisualStore        │  persist URLs + attribution on TodoTask
└───────────┬───────────┘
            ▼
      TaskRow / card
```

### 5.1 Layer 1 — Visual query builder (our intelligence)

**Inputs**

- `title: String`
- `category: TaskCategory?`
- (v1 does not use priority, deadline, or completion)

**Outputs**

```swift
struct VisualQuery {
    var query: String           // 2–5 words, English, stock-photo vocabulary
    var isSensitive: Bool       // if true, do not call Unsplash
    var matchedRuleID: String   // for debug / tests, e.g. "keyword.grocery"
}
```

**Rules (apply in order, first match wins for keywords; then always apply category as tie-break / suffix as specified)**

1. **Normalize:** lowercase, trim, collapse whitespace, strip punctuation except spaces.
2. **Sensitivity gate:** if title matches sensitive patterns → `isSensitive = true`, **do not search**. Patterns (v1, extendable):
   - Health / medical / therapy / diagnosis / medication / doctor / dentist / clinic
   - Sexual / dating / explicit
   - Self-harm / suicide / violence
   - Legal / court / police / lawyer (avoid mugshot-like results)
   - Credentials and financial identifiers: password, passcode, OTP, bank account, card number, CVV
   - Confidential work markers: confidential, NDA, internal only
   - Proper-looking personal data: emails, long digit runs (phones), street-like `*\d+ *street|ave|road*`
   - Names of people as the whole title is **not** blocked in v1 (too noisy); do not put the raw title into the query if it looks like an address.
3. **Keyword map** (substring / regex on normalized title). Suggested starter set — agents may extend, but keep queries visual and short:

   | Match (examples) | Query |
   |---|---|
   | grocer, supermarket, market, vegetable, fruit | `grocery shopping vegetables` |
   | dinner, cook, meal, recipe, kitchen | `home cooking kitchen` |
   | gym, workout, run, yoga, fitness | `fitness workout gym` |
   | meeting, standup, presentation, slides | `team meeting office` |
   | email, inbox, slack, message | `laptop workspace desk` |
   | laundry, dishes, clean, chores | `home chores housework` |
   | school, homework, study, exam | `study desk books` |
   | travel, flight, airport, pack | `travel suitcase airport` |
   | bill, rent, tax, budget | `calculator paperwork desk` |
   | birthday, party, gift | `celebration gift wrapping` |
   | plant, garden, water plants | `indoor plants garden` |
   | dog, cat, vet, pet | `pet dog cat home` |
   | car, fuel, parking | `car city street` |
   | design, wireframe, prototype, figma | `creative design workspace` |

   Medical wording (doctor, dentist, appointment with medical context) is **blocked by the sensitivity gate in step 2**. It never reaches the keyword map and never produces a “clinic” query. `bank` is also removed from the finance row: it overlaps with `bank account`, which is blocked.

4. **Category fallback:** if no keyword matches:
   - Use the fallback table in §3.4.
5. **Keyword + category:** if a keyword matched, **do not** append the category word unless the keyword query is overly generic (`work`, `home`). Prefer the keyword query alone.
6. **Hard constraints on `query`:** 2–5 words; no first-person (“I need to”); no full original title; no punctuation; ASCII letters/spaces only.

**Example**

- Title: `Buy groceries for dinner` + Home → keyword grocery wins → `grocery shopping vegetables`.
- Title: `Q3 design review` + Work → `design` matches the creative-workspace row → `creative design workspace`.
- Title: `Sort it out` + Work → no keyword → category fallback `office desk workspace`.
- Title: `Call mom` + none → no keyword → `checklist notebook desk`.
- Title: `Discuss medication with my doctor` + any → sensitive → no query, no network call.

### 5.2 Layer 2 — Unsplash relevance (vendor)

**Endpoint (v1)**

```
GET https://api.unsplash.com/search/photos
  ?query={urlencoded query}
  &orientation=landscape
  &per_page=8
  &page=1
  &order_by=relevant
  &content_filter=high
```

Headers:

```
Authorization: Client-ID {UNSPLASH_ACCESS_KEY}
Accept-Version: v1
```

Search is a **public action**. It needs only the **access key** via `Client-ID`. The **secret key is for OAuth user authorization, which this app does not do, and must never be embedded in the app.**

There is **no `size` parameter** on this endpoint (unlike Pexels). Image size is chosen by which `urls.*` field we store.

**We control:** query, orientation (`landscape`), per_page (`8`), page, `order_by` (`relevant`, the default, stated explicitly), `content_filter` (`high`).  
**We do not control:** Unsplash’s ranking. Treat result order as relevance order.

`content_filter=high` is a second line of defence behind our own sensitivity gate. Unsplash notes it cannot guarantee all unsuitable content is removed, so it does not replace §5.1.

**Response fields we use**

| Unsplash field | Stored as | Used for |
|---|---|---|
| `id` | `visualPhotoID` | Identity, future exclude-on-refresh |
| `urls.small` (400px wide) | `visualImageURL` | 60pt row thumbnail |
| `urls.regular` (1080px wide) | not stored in v1 | Reserved for any later large presentation |
| `links.html` | `visualSourceURL` | Human-facing photo page |
| `links.download_location` | `visualDownloadLocation` | The one-time download ping (§5.4) |
| `user.name` | `visualPhotographerName` | Attribution |
| `user.links.html` | `visualPhotographerURL` | Attribution link |
| `alt_description` (fall back to `description`) | `visualAlt` | VoiceOver |
| `blur_hash` | `visualBlurHash` | Placeholder while the image loads |
| `width`, `height` | filter only | Reject too-small candidates |

**Rate limits.** Demo mode is **50 requests per hour** (confirmed against the live key: `x-ratelimit-limit: 50`). Production approval raises it to 1000 per hour. v1 does **one search per task create or per title/category change**, never per row appear. The ping in §5.4 is a second request per selection, so budget **2 requests per resolved task**, roughly 25 task resolutions per hour in demo mode.

### 5.3 Layer 3 — Selection (our intelligence)

**v1: Option B — deterministic variety**

```
seed = "\(taskID.uuidString):\(query)"
index = abs(djb2-or-java-style-31-hash(seed)) % photos.count
photo = photos[index]
```

Run the candidate filter first, then index into the filtered list.

**Candidate filter (metadata only):**

- Drop candidates with no `urls.small`, no `links.download_location`, or no `user.name`. A photo we cannot attribute or track is not usable.
- Drop candidates with `width < 600` or `height < 400`.
- Drop candidates whose `alt_description` contains unsafe keywords (small deny-list, extendable).
- Drop an excluded photo ID when one is passed (reserved for the later refresh feature).

Requirements:

- Same seed + same list length → same index.
- Empty list → `noResults`, no crash.
- Do **not** use `Int.random`.

**v1.1 (optional, not required to ship v1):** light scoring inside top 8 — prefer width ≥ 1200, demote empty/very short `alt`. Still pick among scored set with stable index if several pass, or pick highest score then break ties with hash. Do not block v1 on this.

**Not v1:** Option A (`photos[0]` only) as the product default — allowed only as a debug override.

### 5.4 Layer 3.5 — Download ping (provider requirement)

Unsplash’s guidelines require a `GET` to the photo’s `links.download_location` when the app uses a photo. This is an **event ping only**: it increments the photographer’s download counter.

- Fire it **once**, immediately after a photo is selected for a task, with the same `Client-ID` header.
- Never use its response to embed, display, or save the image. Embed from `urls.small`.
- Never fire it from list rendering, scrolling, or app launch.
- A failed ping must not block persisting the visual. Log in debug only.
- Do not fire it again when the app merely reloads the stored visual.

### 5.5 Hotlinking (provider requirement)

Unsplash requires that images be loaded **directly from the returned `images.unsplash.com` URLs**, so views are attributed to the photographer. Therefore:

- Store the URL string; render with `AsyncImage` / `URLCache`.
- Do not download, re-host, or write image files to disk.
- Do not strip the query parameters from the stored URL (they carry tracking context).

---

## 6. Where the pipeline runs

**Decision for v1:** run **on the device**.

| Option | Pros | Cons |
|---|---|---|
| **A. On-device (chosen)** | Matches current architecture; no server; fastest to ship | Access key ships in the app and is extractable from any binary; 50/hr demo quota is per key, not per user |
| B. Tiny proxy later | Hides key; pools quota; can add LLM later | New backend, cost, accounts — contradicts current MVP |

**Accepted trade-off.** This is a personal, single-device app. An extractable Client-ID is acceptable because it only grants public search, and the secret key is never shipped. The practical reason to revisit Option B is the quota, not secrecy: if the app is distributed to many users, they all share one key’s hourly limit.

v1 implementation sketch (names illustrative):

- `Services/VisualQueryBuilder.swift`
- `API/ImageSearching.swift` (provider protocol + `ImageCandidate`)
- `API/Unsplash/UnsplashClient.swift`, `API/Unsplash/UnsplashModels.swift`
- `Services/TaskVisualService.swift` (orchestrates fetch + ping + persist)
- Call from `TaskRepository` / editor save path, not from `TaskRow.body`

**API key delivery (decided).**

- `.env` at the repo root is the human-facing source of truth and is **gitignored**. It holds `UNSPLASH_ACCESS_KEY` and `UNSPLASH_SECRET_KEY`.
- A build step derives **only** `UNSPLASH_ACCESS_KEY` into a **gitignored** `Secrets.xcconfig`, surfaced through `Info.plist` and read with `Bundle.main.object(forInfoDictionaryKey:)`.
- A committed `Secrets.xcconfig.example` documents the shape with a placeholder.
- An iOS target cannot read `.env` at runtime; it is never bundled.
- If the key is missing or empty: skip the network, set `skippedNoKey`, show fallback UI.

---

## 7. Data model (proposed)

Extend `TodoTask` (SwiftData migration required; every new field is optional or defaulted so existing tasks stay valid as `idle`). Do not invent a parallel UI model.

| Field | Type | Purpose |
|---|---|---|
| `visualProvider` | `String?` | `"unsplash"` for v1; leaves room for another provider |
| `visualQuery` | `String?` | Query actually sent |
| `visualQueryVersion` | `Int` | Version of the keyword map / rules that produced the query (start at 1) |
| `visualPhotoID` | `String?` | Unsplash photo id |
| `visualImageURL` | `String?` | `urls.small`, hotlinked |
| `visualSourceURL` | `String?` | `links.html`, the photo page |
| `visualDownloadLocation` | `String?` | `links.download_location`, kept so the ping is not repeated |
| `visualPhotographerName` | `String?` | Attribution |
| `visualPhotographerURL` | `String?` | Attribution link |
| `visualAlt` | `String?` | Accessibility |
| `visualBlurHash` | `String?` | Placeholder |
| `visualStatus` | `String` | See enum below; defaults to `idle` |
| `visualFetchedAt` | `Date?` | |

```swift
enum TaskVisualStatus: String {
    case idle            // never attempted (all existing tasks)
    case pending         // fetch in flight (optional if fetch is await-on-save)
    case ready           // URL + attribution stored
    case fallback        // transient failure after retry: offline, timeout, 5xx, quota exhausted
    case skippedNoKey    // access key missing, empty, or rejected (401)
    case privacyBlocked  // sensitivity gate hit; the API was never called
    case noResults       // search succeeded but no usable candidate remained
}
```

**Refetch when:** title or category changes vs the values that produced `visualQuery`, or `visualQueryVersion` is older **and** the task is next edited (never a silent mass refetch).  
**Retry when:** status is `fallback` (transient) and the task is next saved through the editor. `privacyBlocked`, `noResults`, and `skippedNoKey` only re-run when title/category changes (or, for `skippedNoKey`, once a key exists).  
**Do not refetch when:** complete, delete, sort, priority, deadline-only edits, list scroll, app launch.

**A previous `ready` visual is kept** if a later refetch *fails* (offline, timeout, 5xx, quota exhausted, rejected key); it is replaced only after a new selection succeeds. Two cases do **not** keep it, because the old photo no longer matches the title: the new query returns **no usable candidate** (`noResults`, photo cleared), and the new title becomes **sensitive** (`privacyBlocked`, photo cleared, no network).

**Refetch is decided by the derived query, not the raw title.** Re-running `VisualQueryBuilder` on a saved title/category and comparing it with `visualQuery` means cosmetic title edits (“Buy groceries” → “Buy groceries today”) keep the same photo and cost no request. A newer `visualQueryVersion` only causes a refetch when it actually yields a different query.

**Caching:** v1 stores **remote URLs** and lets SwiftUI `AsyncImage` (backed by the system `URLCache`) load pixels. There is **no** on-disk image cache: Unsplash requires hotlinking (§5.5).

---

## 8. UI / UX requirements

Follow `AGENTS.md`: keep a SwiftUI `List`; extend `TaskRow` as a **local card** (do not rebuild HUI segmented control / Add button / nav title).

### 8.1 Task row

- **Container:** 16pt-radius card on a `List` row (clear list chrome, hidden separators, ~12pt gap). Inner divider between body and footer.
- **Thumbnail:** 60pt rounded square (8pt radius). When `visualStatus == ready` and a URL exists: the Unsplash photo, `scaledToFill`, clipped, in the same fixed 60pt frame so a late image cannot shift layout. While `pending` or while `AsyncImage` is still loading a ready URL: a neutral **shimmer skeleton** (`ThumbnailShimmer`) — never an empty hole. Terminal non-photo states (`fallback`, `privacyBlocked`, `noResults`, `skippedNoKey`, `idle`, or hotlink load failure): category SF Symbol on `AppTheme.subtleAccent`. File-local chrome icons (funnel, alarm, edit, checkbox mark, empty glyph) come from Assets / Console export — see `AGENTS.md` §3.1.
- **Body:** title (subheadline semibold); category text · priority text (High `#C77501`, Medium `#BB9500`, Low = primary label). Trailing checkbox.
- **Footer (pending):** alarm + due datetime; **Edit** opens the existing editor cover.
- **Completed:** `TaskRow` `State=completed` — checked checkbox, slightly dimmed thumbnail (0.55 opacity, photo or symbol), strikethrough title, Edit remains. Empty completed tab copy: “Completed tasks will appear here”. Delete via swipe.
- **Interaction unchanged:** the thumbnail is not a control. The checkbox, Edit footer, swipe, and tap-to-reinstate keep working exactly as before.
- **VoiceOver:** the task title stays the accessible label. The thumbnail is decorative unless `visualAlt` exists, and even then must not be the only description of the task. Do not announce the photographer on every row.

### 8.2 Attribution (required)

Unsplash requires credit for every photo used. This is mandatory, not a minimum.

- **Exact text:** `Photo by {visualPhotographerName} on Unsplash`
- **Links:** “{name}” opens the photographer profile (`visualPhotographerURL`); “Unsplash” opens `https://unsplash.com`. Both URLs carry `?utm_source=my_to_do_list&utm_medium=referral` (append with `&` when the URL already has a query string).
- **Where (both, required):**
  1. **Row context menu** on a `ready` row: a “Photo credit” action that surfaces the text and links.
  2. **Editor:** one quiet line near the bottom of `TaskEditorView` when the task being edited has a `ready` visual.
- Never show attribution for non-`ready` states.
- Removing or hiding this chrome is not a styling decision; it breaks provider terms.
- The attribution string and UTM builder are a pure function with unit tests (§10).

### 8.3 Editor

- Saving remains instantaneous for the user. Visual fetch may complete after dismiss.
- Optional: a quiet progress state on the new row (`pending`).
- No “search images” field in v1.
- No refresh / remove controls in v1.

### 8.4 Performance

- Do not search from `List` `ForEach` appear, `onAppear`, or `TaskRow.body`. A row renders a **persisted URL only**.
- Deduplicate in-flight fetches per `task.id`.
- `per_page=8`, landscape, `urls.small`.

---

## 9. Networking, errors, privacy

| Event | Behavior |
|---|---|
| No network | `fallback`; keep previous ready visual if any |
| Timeout (~7 s) | `fallback`; retry at most once for transient errors |
| HTTP 401 | Access key invalid → `skippedNoKey`; log in debug only; stop calling until the key changes |
| HTTP 403 (quota) | Unsplash returns 403 when the hourly limit is spent. Enter a cooldown (do not search again for the hour). `fallback` if first fetch; keep the previous ready visual if one exists. Never retry in a loop. Check `X-Ratelimit-Remaining` and stop at 0. |
| HTTP 403 (permission) | Treat like 401: `skippedNoKey` |
| HTTP 404 | `fallback` |
| HTTP 429 | Back off; do not tight-loop; `fallback` if first fetch |
| HTTP 500 / 503 | Retry once, then `fallback` |
| Zero results / all filtered out | `noResults` |
| Sensitive title | `privacyBlocked`, never call the API |
| Download ping fails | Persist the visual anyway; do not retry in a loop |
| `pending` | Show the neutral shimmer skeleton, never a blank slot |
| User deletes task | Cancel in-flight request |

The 403 quota case and the 403 permission case share a status code. Distinguish them by `X-Ratelimit-Remaining`: `0` means quota, otherwise permission.

**Privacy:** only the **derived query** leaves the device. The Unsplash secret key never leaves `.env`. Do not log full titles or the `Authorization` header. Do not send `UserProfile.displayName`.

---

## 10. Testing

| Layer | Tests |
|---|---|
| Query builder | Grocery/dinner → grocery query; empty title not searched; Work fallback; sensitive medical title skipped; query is 2–5 words |
| Stable index | Same seed → same index; empty list safe |
| Candidate filter | Drops missing URL / attribution / too small; excluded ID dropped |
| Attribution | Text is `Photo by {name} on Unsplash`; both links contain `utm_source=my_to_do_list&utm_medium=referral`; `&` vs `?` joined correctly |
| Persistence | Save task with visual fields round-trips (SwiftData test); a task with no visual fields reads back as `idle` |
| Download ping | Fired exactly once per selection; not fired for privacy-blocked or empty results; a failing ping still persists the visual |
| Provider failures | 403 quota does not retry in a loop; 429 / 500 still save the task; privacy path makes **zero** client calls |
| UI | Existing identifiers unchanged: `welcome.name`, `welcome.continue`, `task.add`, `task.title`, `task.save` |
| Network | Client mocked; no live Unsplash in CI (50 requests/hour) |

---

## 11. Future (explicitly later)

- Tiny proxy to hide the key and pool quota across users (§6 Option B).
- Production-mode application with Unsplash (raises 50/hr to 1000/hr).
- Pexels as failover provider if its free API returns (`visualProvider` already allows it).
- LLM visual-query generator on a server (`title` + `category` → 2–5 words), with the sensitivity gate run before and after.
- Option C scoring (faces, branding, text-heavy).
- User “shuffle image” control (new seed suffix, current photo ID excluded) plus remove / use-icon controls.
- Decoding `blur_hash` into a real placeholder.
- Shared lists / server sync.

---

## 12. Open questions

Answer these to tighten the next implementation pass. **Recommended defaults are in parentheses** so agents can proceed if unanswered. Items marked **Decided** are settled.

1. **Image placement:** thumbnail on `TaskRow` vs larger card vs list-only hero? (**Row thumbnail, 60pt, leading, as built in `TaskRowThumbnail`.**)
2. **Edit entry:** pending and completed cards use the **Edit** footer. Completed + deadline still uses the reinstatement sheet on row tap.
3. **API key strategy — Decided.** Gitignored `.env` as source, derived gitignored `Secrets.xcconfig` → `Info.plist`. Access key only; secret key never ships. Proxy is a later option (§11).
4. **Locale:** search in user’s language or always English queries? (**English queries v1** — stock tags are stronger.)
5. **Regenerate:** user control to shuffle photo? (**No in v1.**)
6. **Attribution UI — Decided by provider terms.** Row context menu **and** one editor line, both required (§8.2).
7. **Category expansion:** add Errand / Health / Social types? (**Not in v1 visuals; map errand-like titles via keywords onto Home.**)
8. **Download vs hotlink — Decided.** Hotlink only; Unsplash requires it. No on-disk JPEG cache (§5.5).
9. **Dark mode images:** same photo vs prefer darker stock? (**Same photo; system dim on completed only.**)
10. **Kids / Screen Time:** any extra content filter? (**Sensitivity list in §5.1 plus Unsplash `content_filter=high`.**)

---

## 13. Agent implementation checklist

When implementing visuals:

- [ ] Read this FRD + `AGENTS.md`
- [ ] Do not add a backend unless the user explicitly chooses Option B in §6
- [ ] Ensure `.env` is in `.gitignore` before touching keys
- [ ] Put `UNSPLASH_ACCESS_KEY` outside git; never copy `UNSPLASH_SECRET_KEY` into the build
- [ ] Query builder + selector + attribution builder are pure functions with tests
- [ ] Fetch only on create / title / category change (and transient-failure retry on editor save)
- [ ] Fire the download ping once per selection (§5.4)
- [ ] Hotlink `urls.small`; do not persist image files (§5.5)
- [ ] Render `Photo by {name} on Unsplash` with UTM links on the row context menu and in the editor (§8.2)
- [ ] Extend `TodoTask`; migrate SwiftData
- [ ] Extend `TaskRow`; keep `List` + inset grouped
- [ ] No network call from `TaskRow.body`, `onAppear`, or `ForEach`
- [ ] Colors: `AppTheme` + system semantics, no `Color.purple`
- [ ] Fallback never blocks save
- [ ] Human verifies in **Xcode** Canvas / simulator (Cursor has no SwiftUI canvas)

---

## 14. Glossary

| Term | Meaning |
|---|---|
| Visual query | Short stock-photo search string we send to Unsplash |
| Category | App task type: Work, Home, Random |
| Ready visual | Task has a stored image URL and attribution from a successful search |
| Fallback | No Unsplash image; use SF Symbol chrome |
| Stable index | Hash of task id + query modulo result count |
| Access key | Unsplash `Client-ID` credential used for public search; the only key the app uses |
| Secret key | Unsplash OAuth credential; kept in `.env`, never shipped |
| Download ping | `GET links.download_location`; a required event ping, not an image fetch |
| UTM attribution | `?utm_source=my_to_do_list&utm_medium=referral` appended to the Unsplash links in the credit line |
| Hotlinking | Loading the image from the provider’s own `images.unsplash.com` URL instead of a local copy |
| Demo mode | Unsplash’s default app tier: 50 requests per hour |
