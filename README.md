
# My To-do List

Native iOS 17+ MVP built with SwiftUI and SwiftData.

## Requirements

- Xcode 15 or later
- iOS 17 or later simulator/device

## Run

1. Open `MyToDoList.xcodeproj` in Xcode.
2. Select the `MyToDoList` scheme and an iOS 17+ simulator.
3. Build and run.

The MVP is offline-first. Tasks and the local profile are persisted with SwiftData and are restored when the app reopens. They remain on the device until the app is deleted or its local data is reset.

No backend, account provider, sync, analytics, or remote image dependency is included. The account screens are local demo flows and deliberately never store passwords.
