# Task Visuals: Stock Image Intelligence Feature

> **Status: non-binding reference (updated 2026-10-07).** This document records the original planning discussion. It is **not** the spec. The normative spec is `FRD.md` §4–§9, with UI rules in `AGENTS.md`. Where this file and the FRD differ, the FRD wins.
>
> **What is superseded**
>
> - **Provider:** this file assumes **Pexels**. The free Pexels API is no longer available, so v1 uses **Unsplash** (`Authorization: Client-ID <access key>`, `GET /search/photos`, no `size` param, `content_filter=high`). Wherever this file says Pexels, read Unsplash. Field names differ: `photo.src.*` becomes `urls.*`, `photographer` becomes `user.name`, `alt` becomes `alt_description`.
> - **New provider obligations not covered below:** mandatory attribution (`Photo by {name} on Unsplash`, UTM-tagged links), a required download ping to `links.download_location` after selection, and hotlink-only image loading. See FRD §5.4, §5.5, §8.2.
> - **Stack:** this file describes a web app (TypeScript types, `/api/tasks/:id/visual` REST routes, React `TaskVisual.tsx`, CSS `object-fit`, CSP). This app is native iOS (SwiftUI + SwiftData) with no backend. The pipeline runs **on the device**, triggered from the editor save path. Ignore the route, folder-structure, and React sections.
> - **Task types:** the `TaskType` enum here (`work`, `errand`, `health`, …) is not the app’s model. The app’s categories are `Work` / `Home` / `Random` / none (FRD §3.4).
> - **Task detail / refresh / remove:** there is no task-detail screen, and refresh/remove are not v1 (FRD §4.3).
> - **Analytics and LLM:** the app has no analytics; the LLM upgrade is deferred (FRD §11).
>
> **What still carries over, in spirit:** the pipeline order (normalize → privacy guard → query → search → filter → deterministic pick → persist), the 2–5 word query rule, the privacy-first principle (never send the raw title), stable selection by task ID + query, non-blocking failures, and the “image is an ambient cue, never required” product principle. The FRD adopts these.

## 1. Feature Summary

Build a task-visual system for the to-do app.

When a user creates or edits a task, the system should use the task title and task type to generate a short visual search query, fetch relevant stock-photo candidates from a provider such as Pexels, select one image, save its metadata, and render it in the task UI.

The image is an ambient recognition cue. It must never be required for task creation, completion, navigation, or understanding the task title.

## 2. Product Goals

- Help users scan and recognize tasks with less cognitive effort.
- Make task categories visually distinguishable.
- Keep task creation fast and uninterrupted.
- Make image selection stable, relevant, privacy-aware, and replaceable.
- Preserve a useful fallback when the provider is unavailable or no image is suitable.
- Keep provider credentials server-side.

## 3. Non-goals for MVP

- AI-generated images.
- User-uploaded images.
- A full image-browsing marketplace.
- Multiple stock providers in the first release.
- Re-fetching images every time a list opens.
- Sending sensitive task text verbatim to a third-party API.
- Automatic image changes after an image has been selected.

## 4. User Experience

### 4.1 Task creation

1. User enters a task title.
2. User selects a task type, or the app applies a default type.
3. The task is saved immediately.
4. Visual resolution runs asynchronously.
5. The task row initially shows a type icon or loading placeholder.
6. The selected image replaces the placeholder without causing layout shift.

### 4.2 Task row

- Compact thumbnail: 56 x 56 px, rounded corners.
- Fixed dimensions to prevent layout shift.
- Task title remains the primary content.
- Completion checkbox and controls remain fully accessible.
- Thumbnail must not communicate completion, urgency, or type by itself.
- Use `object-fit: cover`.
- Lazy-load images outside the initial viewport.

### 4.3 Task detail

- Show a larger image when appropriate.
- Show provider attribution where required.
- Provide actions:
  - Refresh visual
  - Remove visual
  - Use type icon instead
- Preserve the prior image while a refresh is loading.

### 4.4 Empty, error, and privacy states

- `pending`: type icon or skeleton.
- `failed`: type icon and retry action in detail view.
- `removed`: type icon only.
- `privacy_blocked`: neutral local visual; never call the external provider.
- `no_results`: type icon fallback.

## 5. Recommended MVP Provider

Use Pexels as the first provider behind a server-side adapter.

Required provider capabilities:

- Search photos by query.
- Return multiple candidate photos.
- Return thumbnail and larger image URLs.
- Return photo ID, source URL, photographer name, photographer URL, dimensions, and alt text where available.

Do not expose the provider API key in browser or mobile client code.

Provider abstraction:

```ts
interface ImageProvider {
  searchPhotos(input: ImageSearchInput): Promise<ImageCandidate[]>;
}

type ImageSearchInput = {
  query: string;
  orientation?: "landscape" | "portrait" | "square";
  perPage?: number;
  excludePhotoIds?: string[];
};

type ImageCandidate = {
  provider: "pexels" | "unsplash";
  providerPhotoId: string;
  sourceUrl: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  altText: string | null;
  photographerName: string | null;
  photographerUrl: string | null;
};
```

This allows the app to replace Pexels later without changing product UI or task data contracts.

## 6. Intelligence Pipeline

```text
Task title + task type
        ↓
Normalize title
        ↓
Privacy and sensitive-content guard
        ↓
Intent classification
        ↓
Visual concept extraction
        ↓
Query generation
        ↓
Provider search
        ↓
Candidate filtering
        ↓
Candidate ranking and deterministic selection
        ↓
Save visual metadata
        ↓
Render thumbnail and attribution
```

### 6.1 Input example

```json
{
  "title": "Buy groceries for dinner",
  "type": "errand"
}
```

### 6.2 Generated output

```json
{
  "query": "grocery shopping vegetables",
  "privacyStatus": "safe",
  "visualMode": "stock_photo"
}
```

### 6.3 Vague task example

```json
{
  "title": "Sort it out",
  "type": "work"
}
```

Generated output:

```json
{
  "query": "organized workspace notebook",
  "privacyStatus": "safe",
  "visualMode": "stock_photo"
}
```

### 6.4 Sensitive task example

```json
{
  "title": "Discuss medication with my doctor",
  "type": "health"
}
```

Generated output:

```json
{
  "query": null,
  "privacyStatus": "blocked",
  "visualMode": "local_fallback"
}
```

Never send the original sensitive title to the external provider.

## 7. Task Types

Use a controlled type enum:

```ts
type TaskType =
  | "work"
  | "personal"
  | "errand"
  | "health"
  | "finance"
  | "learning"
  | "home"
  | "travel"
  | "habit"
  | "other";
```

Type fallbacks:

```ts
const TASK_TYPE_FALLBACKS: Record<TaskType, string[]> = {
  work: [
    "organized workspace notebook",
    "team presentation workspace",
    "professional desk planning"
  ],
  personal: [
    "daily planning notebook",
    "calm home lifestyle"
  ],
  errand: [
    "shopping checklist",
    "city errand"
  ],
  health: [
    "wellness routine",
    "healthy lifestyle"
  ],
  finance: [
    "budget planning calculator",
    "personal finance documents"
  ],
  learning: [
    "studying books desk",
    "online learning workspace"
  ],
  home: [
    "home organization",
    "clean home interior"
  ],
  travel: [
    "travel planning map",
    "suitcase travel"
  ],
  habit: [
    "daily routine",
    "healthy habit"
  ],
  other: [
    "organized planning notebook"
  ]
};
```

## 8. Query Generation

Start with deterministic rules. Add an LLM only after the rules-based version is measured and working.

### 8.1 Query requirements

- 2–5 words.
- Concrete and visually searchable.
- Do not include private details.
- Avoid complete sentences.
- Avoid dates, names, account numbers, addresses, medical details, and company-confidential content.
- Prefer objects, activities, environments, and visual contexts.

### 8.2 Keyword map

```ts
const KEYWORD_MAP = [
  { pattern: /grocer|supermarket|vegetable|market/i, query: "grocery shopping vegetables" },
  { pattern: /cook|cooking|recipe|dinner|meal/i, query: "cooking healthy meal" },
  { pattern: /gym|workout|exercise|run|running|yoga/i, query: "fitness workout outdoors" },
  { pattern: /dentist|doctor|medical|medicine|health check/i, query: "healthcare appointment" },
  { pattern: /invoice|tax|budget|bill|payment|expense/i, query: "personal finance calculator" },
  { pattern: /flight|hotel|passport|visa|trip|travel/i, query: "travel planning documents" },
  { pattern: /presentation|review|meeting|workshop|strategy/i, query: "team presentation workspace" },
  { pattern: /read|book|course|study|learn|research/i, query: "studying books desk" },
  { pattern: /clean|laundry|repair|organize|declutter/i, query: "home organization" },
  { pattern: /write|design|prototype|figma|wireframe/i, query: "creative design workspace" }
];
```

### 8.3 Generator contract

```ts
type VisualIntent = {
  query: string | null;
  visualMode: "stock_photo" | "local_fallback";
  privacyStatus: "safe" | "blocked";
  intentKey: string;
  queryVersion: number;
};
```

### 8.4 Example implementation

```ts
export function generateVisualIntent(
  title: string,
  type: TaskType
): VisualIntent {
  const normalizedTitle = title.trim().replace(/\\s+/g, " ");

  if (containsSensitiveContent(normalizedTitle, type)) {
    return {
      query: null,
      visualMode: "local_fallback",
      privacyStatus: "blocked",
      intentKey: `${type}:private`,
      queryVersion: 1
    };
  }

  const match = KEYWORD_MAP.find(({ pattern }) => pattern.test(normalizedTitle));

  if (match) {
    return {
      query: match.query,
      visualMode: "stock_photo",
      privacyStatus: "safe",
      intentKey: match.query,
      queryVersion: 1
    };
  }

  const fallbackList = TASK_TYPE_FALLBACKS[type] ?? TASK_TYPE_FALLBACKS.other;
  const query = fallbackList[stableIndex(normalizedTitle, fallbackList.length)];

  return {
    query,
    visualMode: "stock_photo",
    privacyStatus: "safe",
    intentKey: `${type}:${query}`,
    queryVersion: 1
  };
}
```

## 9. Privacy Guard

Use both task-type rules and keyword rules.

```ts
const SENSITIVE_PATTERNS = [
  /password|passcode|otp|one[- ]time/i,
  /bank account|account number|card number|cvv/i,
  /medication|diagnosis|symptom|therapy|psychiat/i,
  /lawyer|legal case|court|police/i,
  /divorce|breakup|relationship conflict/i,
  /confidential|nda|client name|internal only/i
];

function containsSensitiveContent(title: string, type: TaskType): boolean {
  if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(title))) return true;

  return type === "health" && title.length > 0 &&
    /medication|diagnosis|symptom|treatment/i.test(title);
}
```

For blocked tasks:

- Do not call Pexels.
- Save `status: "privacy_blocked"` or equivalent.
- Render a neutral local icon or illustration.
- Do not log the raw title in analytics.

## 10. Database Model

Add an optional visual object to the existing task schema.

```ts
type TaskVisual = {
  provider: "pexels" | "unsplash" | "none";
  providerPhotoId: string | null;
  query: string | null;
  queryVersion: number;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  photographerName: string | null;
  photographerUrl: string | null;
  sourceUrl: string | null;
  status: "pending" | "ready" | "failed" | "removed" | "privacy_blocked" | "no_results";
  selectedAt: string | null;
};
```

Backward compatibility requirements:

- Existing tasks must render correctly with no visual object.
- A failed visual must not fail task creation.
- Image URLs should be nullable.
- Provider metadata should be retained for attribution and refresh.
- Store `queryVersion` so query-generation changes can be managed later.

## 11. Provider Adapter

Create a server-only provider module.

Suggested structure:

```text
src/
  features/
    task-visuals/
      domain/
        types.ts
        query-generator.ts
        privacy-guard.ts
        candidate-ranking.ts
        fallback.ts
      providers/
        image-provider.ts
        pexels-provider.ts
      services/
        resolve-task-visual.ts
      api/
        create-task-visual.ts
        refresh-task-visual.ts
      components/
        TaskVisual.tsx
        TaskVisualAttribution.tsx
      tests/
        query-generator.test.ts
        privacy-guard.test.ts
        candidate-ranking.test.ts
        resolve-task-visual.test.ts
```

Adapt the paths to the repository’s existing architecture rather than creating a duplicate structure.

## 12. Pexels API Request

Server-side request:

```ts
export async function searchPexelsPhotos(
  input: ImageSearchInput
): Promise<ImageCandidate[]> {
  const params = new URLSearchParams({
    query: input.query,
    orientation: input.orientation ?? "landscape",
    size: "small",
    per_page: String(input.perPage ?? 8)
  });

  const response = await fetch(
    `https://api.pexels.com/v1/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: process.env.PEXELS_API_KEY ?? ""
      },
      signal: AbortSignal.timeout(7000)
    }
  );

  if (!response.ok) {
    throw new Error(`Image provider error: ${response.status}`);
  }

  const data = await response.json();

  return data.photos.map((photo: any) => ({
    provider: "pexels",
    providerPhotoId: String(photo.id),
    sourceUrl: photo.url,
    imageUrl: photo.src.large,
    thumbnailUrl: photo.src.medium,
    width: photo.width,
    height: photo.height,
    altText: photo.alt ?? null,
    photographerName: photo.photographer ?? null,
    photographerUrl: photo.photographer_url ?? null
  }));
}
```

Important:

- The API key must be available only in server runtime.
- Add a timeout.
- Do not log the key or full authorization header.
- Treat provider failure as a non-blocking visual failure.
- Normalize provider responses into your own `ImageCandidate` type.

## 13. Candidate Filtering

Before selection, filter candidates.

```ts
function filterCandidates(
  candidates: ImageCandidate[],
  excludedPhotoIds: string[] = []
): ImageCandidate[] {
  const excluded = new Set(excludedPhotoIds);

  return candidates.filter((candidate) => {
    if (excluded.has(candidate.providerPhotoId)) return false;
    if (!candidate.thumbnailUrl || !candidate.imageUrl) return false;
    if (candidate.width < 600 || candidate.height < 400) return false;
    if (containsUnsafeMetadata(candidate.altText)) return false;
    return true;
  });
}
```

Start with metadata filtering only. Do not build computer-vision moderation into the MVP unless testing shows it is necessary.

## 14. Candidate Selection

The provider returns multiple candidates. Select one deterministically so the same task does not change image whenever the list is reopened.

```ts
function stableIndex(seed: string, length: number): number {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  return Math.abs(hash) % length;
}

function chooseCandidate(
  taskId: string,
  query: string,
  candidates: ImageCandidate[]
): ImageCandidate | null {
  if (candidates.length === 0) return null;

  const index = stableIndex(`${taskId}:${query}`, candidates.length);
  return candidates[index];
}
```

Refresh behavior:

- Pass the current provider photo ID as excluded.
- Use the next candidate or a new page.
- Save the new selection only after a successful response.
- Never silently replace an existing image during ordinary list loading.

## 15. Resolver Service

```ts
export async function resolveTaskVisual(input: {
  taskId: string;
  title: string;
  type: TaskType;
  currentPhotoId?: string | null;
  forceRefresh?: boolean;
}): Promise<TaskVisual> {
  const intent = generateVisualIntent(input.title, input.type);

  if (intent.visualMode === "local_fallback" || !intent.query) {
    return createPrivacyFallback(input.type, intent);
  }

  const candidates = await searchPexelsPhotos({
    query: intent.query,
    orientation: "landscape",
    perPage: 8,
    excludePhotoIds: input.currentPhotoId ? [input.currentPhotoId] : []
  });

  const filtered = filterCandidates(candidates, input.currentPhotoId ? [input.currentPhotoId] : []);
  const selected = chooseCandidate(input.taskId, intent.query, filtered);

  if (!selected) {
    return createNoResultsFallback(input.type, intent);
  }

  return {
    provider: selected.provider,
    providerPhotoId: selected.providerPhotoId,
    query: intent.query,
    queryVersion: intent.queryVersion,
    imageUrl: selected.imageUrl,
    thumbnailUrl: selected.thumbnailUrl,
    width: selected.width,
    height: selected.height,
    altText: selected.altText,
    photographerName: selected.photographerName,
    photographerUrl: selected.photographerUrl,
    sourceUrl: selected.sourceUrl,
    status: "ready",
    selectedAt: new Date().toISOString()
  };
}
```

Wrap provider calls in error handling at the API boundary. A provider outage must not make task creation fail.

## 16. API Routes

### Generate initial visual

```text
POST /api/tasks/:taskId/visual
```

Request:

```json
{
  "title": "Buy groceries for dinner",
  "type": "errand"
}
```

Behavior:

1. Validate task ownership and input.
2. Save task first if this is part of task creation.
3. Generate visual intent.
4. Return local fallback immediately for privacy-blocked tasks.
5. Search provider for safe tasks.
6. Filter and select a candidate.
7. Persist normalized visual metadata.
8. Return the visual object.

### Refresh visual

```text
POST /api/tasks/:taskId/visual/refresh
```

Behavior:

1. Validate task ownership.
2. Apply refresh rate limit.
3. Generate intent again from current title/type.
4. Exclude the current provider photo ID.
5. Fetch candidates.
6. Select a different candidate.
7. Save only after success.

### Remove visual

```text
DELETE /api/tasks/:taskId/visual
```

Behavior:

- Set status to `removed`.
- Keep the task intact.
- Do not delete the task.
- Do not re-fetch automatically.

## 17. Client Component Contract

```tsx
<TaskVisual
  visual={task.visual}
  taskType={task.type}
  taskTitle={task.title}
  size="compact"
  onRefresh={() => refreshVisual(task.id)}
  onRemove={() => removeVisual(task.id)}
/>
```

Rendering rules:

```tsx
function TaskVisual({ visual, taskType, taskTitle }: Props) {
  if (!visual || visual.status !== "ready" || !visual.thumbnailUrl) {
    return (
      <TaskTypeFallback
        type={taskType}
        label={`${taskType} task`}
      />
    );
  }

  return (
    <img
      src={visual.thumbnailUrl}
      alt={visual.altText || ""}
      width={56}
      height={56}
      loading="lazy"
      decoding="async"
      className="task-visual task-visual--compact"
    />
  );
}
```

The task title remains the accessible label. Do not make a thumbnail the only semantic representation of the task.

## 18. Optional LLM Upgrade

Do not require an LLM for the first implementation. If rules-based queries are not relevant enough, add an LLM behind a strict structured-output function.

LLM input:

```json
{
  "title": "Prepare Q3 design review",
  "type": "work"
}
```

LLM output schema:

```json
{
  "query": "team presentation workspace",
  "intentKey": "work_presentation",
  "privacyStatus": "safe",
  "confidence": 0.92
}
```

Prompt:

```text
You generate safe, generic stock-photo search queries for a productivity app.

Rules:
- Return JSON only.
- Query must contain 2 to 5 concrete visual words.
- Describe an object, activity, or environment.
- Do not include names, dates, locations, account details, medical details,
  legal details, confidential information, or the full task sentence.
- If the task contains sensitive personal information, return privacyStatus=blocked
  and query=null.
- Prefer generic visual concepts over abstract words such as important, urgent,
  improve, manage, or sort.
```

Required safeguards:

- Validate the JSON with a schema.
- Reject queries longer than 5 words.
- Run the privacy guard before and after the LLM call.
- Fall back to deterministic rules if the LLM fails.
- Do not log the original title in third-party AI requests unless the product has explicitly approved that privacy behavior.

## 19. Caching and Rate Limits

- Generate once on task creation.
- Do not call the provider when opening a list.
- Save selected image metadata in the task record.
- Cache provider results by normalized query.
- Use a 24-hour or longer cache where appropriate.
- Limit candidates to 8 for the MVP.
- Limit refresh actions per task and per user.
- Add request timeout of approximately 7 seconds.
- Retry at most once for transient provider errors.
- Use the local fallback after failure.

Suggested cache key:

```text
image-search:v1:pexels:landscape:grocery-shopping-vegetables
```

## 20. Attribution

Store attribution metadata even if the initial provider configuration does not require a visible credit in every compact card.

For each selected image, retain:

- Provider.
- Photo ID.
- Source photo URL.
- Photographer name.
- Photographer profile URL.

Display attribution in task detail or an image-information popover according to the provider’s current requirements. Recheck provider terms before production launch.

## 21. Analytics

Track product behavior without storing sensitive task text.

Events:

```text
task_visual_requested
 task_type
 provider
 trigger: create | edit | refresh

 task_visual_resolved
 provider
 status: ready | no_results | failed | privacy_blocked
 query_version
 latency_ms

 task_visual_refreshed
 provider

 task_visual_removed
 provider

 task_visual_fallback_shown
 reason: pending | failed | removed | no_results | privacy_blocked
```

Do not send raw task titles to analytics.

Core metrics:

```text
resolution_rate = ready_visuals / eligible_visual_requests
refresh_rate = refresh_actions / ready_visuals
removal_rate = removed_visuals / ready_visuals
failure_rate = failed_requests / total_visual_requests
```

User research metrics:

- Time required to find a target task in a list.
- Accuracy when identifying tasks from a crowded list.
- Whether users understand the image as a cue rather than a status indicator.
- Whether imagery feels distracting or helpful.
- Whether users want images on all tasks or only selected task types.

## 22. Error Handling

Expected errors and behavior:

| Error | Behavior |
|---|---|
| Missing API key | Log configuration error server-side; use fallback. |
| Provider 401/403 | Disable provider call temporarily; use fallback. |
| Provider 429 | Use cached results or fallback; do not aggressively retry. |
| Provider 5xx | Retry once, then fallback. |
| Network timeout | Keep task saved; show pending/failed state. |
| Empty result set | Save `no_results`; show type fallback. |
| Invalid image URL | Show fallback and optionally mark candidate invalid. |
| Sensitive task | Never call provider; show local fallback. |
| User refresh limit reached | Keep current image and show a non-blocking message. |

## 23. Security Requirements

- Keep `PEXELS_API_KEY` server-side.
- Never expose provider keys in public environment variables.
- Validate task ownership on every visual endpoint.
- Rate-limit image generation and refresh.
- Sanitize query input.
- Do not log secrets.
- Avoid logging raw task titles.
- Do not let a user submit arbitrary provider URLs for rendering without validation.
- Use an allow-list of approved providers.
- Add Content Security Policy rules for approved image domains if the app uses CSP.

## 24. Performance Requirements

- Task creation must succeed without waiting for the image API.
- List rendering must not be blocked by image resolution.
- Use thumbnails for compact cards.
- Use fixed dimensions.
- Lazy-load below-the-fold images.
- Add a graceful fade only after the image is loaded.
- Respect `prefers-reduced-motion`.
- Avoid duplicate requests for the same task/query.
- Optimistically preserve the existing image during refresh.

## 25. Testing Plan

### Unit tests

- Keyword mapping generates expected query.
- Task-type fallback works for vague titles.
- Sensitive title is blocked.
- Query output is 2–5 words.
- Stable selection returns the same result for the same seed.
- Refresh excludes the current photo ID.
- Empty candidate list returns fallback.

### Integration tests

- Task creation succeeds when provider returns 200.
- Task creation succeeds when provider returns 429 or 500.
- API key is not present in client bundle.
- Visual metadata is persisted correctly.
- Existing tasks without visuals render correctly.
- Privacy-blocked task makes zero provider requests.

### UI tests

- Pending state does not cause layout shift.
- Failed state renders type icon.
- Refresh action preserves the old image while loading.
- Remove action changes to fallback.
- Thumbnail has correct accessibility behavior.
- Checkbox and task controls remain clickable.
- Attribution appears in task detail where required.

### Manual QA scenarios

1. “Buy groceries for dinner” / Errand.
2. “Prepare Q3 design review” / Work.
3. “Morning run” / Habit.
4. “Pay electricity bill” / Finance.
5. “Sort it out” / Work.
6. “Discuss medication with my doctor” / Health.
7. Empty title validation.
8. Offline network.
9. Provider rate-limit response.
10. Refresh the same task multiple times.
11. Delete and restore a task.
12. Use the app with reduced motion and a screen reader.

## 26. Definition of Done

- [ ] Task creation does not depend on provider availability.
- [ ] A task visual is generated from title and type.
- [ ] Sensitive tasks never send raw content to the provider.
- [ ] Pexels integration is server-side.
- [ ] API key is not exposed to the client.
- [ ] Image metadata is saved with the task.
- [ ] Existing tasks without visuals remain valid.
- [ ] Candidate selection is deterministic.
- [ ] Refresh and remove controls work.
- [ ] Fallback visuals exist for all states.
- [ ] Attribution metadata is stored and rendered appropriately.
- [ ] Rate limits, timeout, and provider errors are handled.
- [ ] Unit, integration, and UI tests pass.
- [ ] Analytics does not include raw task titles.
- [ ] Mobile layout has no image-induced layout shift.

## 27. Cursor Agent Execution Prompt

Use the following prompt in Cursor after reviewing the repository:

```text
You are implementing a production-quality Task Visuals feature in the existing to-do app.

First inspect the repository. Do not modify code until you identify:
- Framework and package manager.
- Existing task model and persistence layer.
- Task creation and edit flows.
- Task row and task detail components.
- Existing API/server boundaries.
- Existing design tokens and icon components.
- Existing test setup.

Then implement this feature in small, safe steps:

1. Add an optional TaskVisual model and TaskType integration.
2. Add a deterministic, server-side visual-intent generator based on task title and type.
3. Add a privacy guard that blocks sensitive content from external image search.
4. Add a server-only ImageProvider interface and Pexels adapter.
5. Add candidate filtering and deterministic photo selection.
6. Add task visual resolve, refresh, and remove endpoints using the repository’s conventions.
7. Save normalized image metadata to the existing task persistence layer.
8. Add a TaskVisual UI component with ready, pending, failed, no-results, removed, and privacy-blocked states.
9. Add compact thumbnail rendering to the existing task row without changing task interaction behavior.
10. Add task-detail attribution and refresh/remove actions.
11. Add caching, timeout, retry, rate limiting, and graceful fallback.
12. Add tests for query generation, privacy, candidate selection, provider failure, persistence, and UI states.

Product constraints:
- Task creation must complete even if image search fails.
- Do not expose PEXELS_API_KEY to client code.
- Do not send raw sensitive task titles to Pexels or an LLM.
- Do not fetch images on every list render.
- Do not automatically replace a saved image unless the user refreshes it.
- The image must remain secondary to the task title.
- Use existing components, tokens, API patterns, and naming conventions.
- Do not rewrite unrelated files.

Implementation details:
- Pexels search should use a short 2–5 word query.
- Request landscape images, small size, and up to 8 candidates.
- Store provider, provider photo ID, source URL, image URL, thumbnail URL,
  dimensions, alt text, photographer metadata, query, query version, status,
  and selected timestamp.
- Use a stable hash of task ID plus query to choose a candidate.
- Exclude the current photo ID during refresh.
- Use a local task-type icon fallback in every non-ready state.
- Use fixed thumbnail dimensions and lazy loading.
- Keep the previous image visible while refreshing.
- Do not log API keys or raw task titles in analytics.

Before each implementation step:
- State the files you will change.
- Explain how existing behavior will remain compatible.

After each implementation step:
- Run the narrowest relevant tests or type checks.
- Report failures and fix only feature-related issues.
- Summarize the changed files.

At the end, provide:
- Files changed.
- Environment variables required.
- Database migration steps.
- API endpoint summary.
- Test commands.
- Manual QA checklist.
- Known limitations.
```

## 28. Suggested Delivery Phases

### Phase 1: Foundation

- Task type enum.
- Task visual data model.
- Local fallback visuals.
- Query generator.
- Privacy guard.

### Phase 2: Provider integration

- Pexels adapter.
- Server endpoint.
- Candidate normalization.
- Deterministic selection.
- Persistence.

### Phase 3: UI

- Task row thumbnail.
- Loading and fallback states.
- Detail view attribution.
- Refresh and remove actions.

### Phase 4: Reliability

- Caching.
- Rate limiting.
- Retry and timeout.
- Monitoring.
- Test coverage.

### Phase 5: Learning

- Analytics.
- Usability testing.
- Query mapping improvements.
- Optional LLM-based intent generation.
- Optional second provider.

## 29. Final Product Principle

The feature should feel like the app is helping users recognize tasks—not like the app is asking users to browse and manage stock photography.

The correct default behavior is:

```text
Create task quickly → resolve a generic visual safely → save it once →
render it quietly → allow refresh or removal → always preserve the type fallback.
```
