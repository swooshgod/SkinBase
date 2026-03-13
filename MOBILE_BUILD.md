# SkinBase — Mobile Build Guide

## Prerequisites

- **Node.js** 18+
- **Java 17+** (for Android)
- **Android Studio** (for Android builds)
- **Xcode 15+** (for iOS builds — macOS only)
- **CocoaPods** (`sudo gem install cocoapods` — iOS only)

## First-Time Setup

```bash
# Add native platforms
npx cap add ios
npx cap add android
```

## Build & Sync

```bash
# Build the Next.js static export, then sync to native projects
npm run build:mobile
```

This runs `next build` (static export) and `npx cap sync` to copy web assets into native projects.

## Open in IDE

```bash
# Open iOS project in Xcode
npm run cap:ios

# Open Android project in Android Studio
npm run cap:android
```

## iOS: Submit to App Store

1. Open in Xcode: `npm run cap:ios`
2. Select your signing team under **Signing & Capabilities**
3. Set the target device to "Any iOS Device (arm64)"
4. **Product → Archive**
5. Once archived, click **Distribute App → App Store Connect**
6. Follow the prompts to upload to App Store Connect

## Android: Submit to Google Play

1. Open in Android Studio: `npm run cap:android`
2. **Build → Generate Signed Bundle / APK**
3. Choose **Android App Bundle (.aab)** for Play Store
4. Create or select your keystore
5. Build the release bundle
6. Upload the `.aab` file to the Google Play Console

## Notes

- The web app is exported as static files to the `out/` directory
- Capacitor wraps this static export in a native WebView
- For live reload during development, update `capacitor.config.ts` to point to your dev server URL
