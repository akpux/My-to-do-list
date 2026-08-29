# My To-do List

Native iOS 17+ MVP built with SwiftUI and SwiftData.

Cursor cannot show SwiftUI Canvas. Use **Xcode** for live previews and to install on your iPhone.

## Requirements

- Xcode 15 or later
- iOS 17 or later simulator or device
- An Apple ID (free Personal Team is enough for on-device testing)

## Live preview (Canvas)

1. Open `MyToDoList.xcodeproj` in Xcode (not only in Cursor).
2. Open a view file that has `#Preview` (for example `RootView.swift` or `TaskListView.swift`).
3. Show the canvas: **Editor → Canvas**, or Option-Command-Return.
4. Choose an **iPhone simulator** in the canvas destination. Canvas does not run against a physical device.

`RootView` has two previews: **Name gate** (first launch) and **Task list** (after a local name is saved). Sign Up and Forgot Password are parked for later and only appear in their own previews in `AuthViews.swift`.

## Run on a simulator

1. Select the `MyToDoList` scheme and an iOS 17+ simulator.
2. Build and run (Command-R).

## Run on your iPhone

1. In Xcode, open the **MyToDoList** target → **Signing & Capabilities**.
2. Enable **Automatically manage signing**.
3. Set **Team** to your Apple ID Personal Team. Leave `DEVELOPMENT_TEAM` empty in git; Xcode stores this locally.
4. If signing fails, change the bundle identifier from `com.example.mytodolist` to something unique (for example `com.yourname.mytodolist`).
5. Plug in the phone, select it as the run destination, then Run.
6. On the device: **Settings → General → VPN & Device Management** and trust your developer certificate.

## What the MVP does

First launch asks only for a **name**, then opens the task list. Tasks and that local profile are stored with SwiftData on the device and come back when you reopen the app. They stay until you delete the app or reset its data.

Sign Up and Forgot Password remain in the project as frontend-only screens for a later phase. They are not in the launch flow. Passwords on those screens are never stored.

There is no backend, account provider, sync, or analytics.
