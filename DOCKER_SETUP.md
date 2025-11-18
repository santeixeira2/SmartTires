# Docker Build Setup for React Native CarPlay App

This setup allows you to build your React Native app in a Docker container, then run it on your local Mac simulator/emulator.

## 🎯 What This Does

- ✅ **Builds Android APK** inside Docker (isolated environment)
- ✅ **Extracts APK** to `./output/` directory
- ✅ **Runs app** on your local Android emulator or iOS simulator
- ❌ **Does NOT** run emulators inside Docker (they run on your Mac)

## 📋 Prerequisites

1. **Docker Desktop** installed on your Mac
2. **Android Studio** (for Android emulator) OR **Xcode** (for iOS simulator)
3. **ADB** (Android Debug Bridge) - comes with Android Studio

## 🚀 Quick Start

### Build Android APK

```bash
make build
# or
make build-android
```

This will:
1. Build a Docker image with all dependencies
2. Build your Android APK inside the container
3. Copy the APK to `./output/carplaytest20-debug.apk`

### Run on Android Emulator/Device

```bash
# Start your Android emulator first, then:
make run-android
```

Or manually:
```bash
adb install -r ./output/carplaytest20-debug.apk
adb shell am start -n com.carplaytest20/.MainActivity
```

### Build iOS App (macOS Host Only)

**⚠️ Important:** iOS builds **cannot** run in Docker (they require macOS). Use your local Mac:

```bash
make build-ios
# or manually:
cd ios && xcodebuild -workspace carplaytest20.xcworkspace -scheme carplaytest20 -configuration Debug -sdk iphonesimulator
```

### Run on iOS Simulator

```bash
make run-ios
```

Or manually:
```bash
xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/carplaytest20.app
xcrun simctl launch booted com.carplaytest20
```

## 🐳 Docker Commands (Alternative)

If you prefer using Docker directly:

```bash
# Build the image
docker build -t carplay-build .

# Build APK and extract it
docker run --rm -v $(pwd)/output:/output carplay-build \
  bash -c "cd android && ./gradlew assembleDebug && cp app/build/outputs/apk/debug/app-debug.apk /output/"

# Or use docker-compose
docker-compose build
docker-compose run --rm build
```

## 📁 Output

Built artifacts will be in:
- **Android APK**: `./output/carplaytest20-debug.apk`
- **iOS App**: `ios/build/Build/Products/Debug-iphonesimulator/carplaytest20.app`

## 🔧 Troubleshooting

### Android Build Issues

1. **AAPT2/Rosetta errors on Apple Silicon**: The Docker build uses x86_64 emulation (`--platform linux/amd64`) for Android build tools compatibility. This is slower but necessary.
2. **Gradle build fails**: Check if all dependencies are in `package.json`
3. **NDK errors**: The Dockerfile installs NDK 27.1.12297006 - adjust if needed
4. **Permission errors**: Make sure Docker has proper permissions
5. **Slow builds on Apple Silicon**: This is expected due to x86_64 emulation. Consider building directly on your Mac for faster builds.

### iOS Build Issues

- iOS builds **must** run on macOS host (not in Docker)
- Ensure Xcode and command-line tools are installed: `xcode-select --install`
- Check that CocoaPods are installed: `cd ios && pod install`

## 🧹 Clean Up

```bash
make clean
```

This removes:
- Build artifacts
- Docker containers/images
- Output directory

## 📝 Notes

- **Node modules** are installed fresh in Docker each time (for consistency)
- **Android SDK** is downloaded during image build (first build takes longer)
- **iOS builds** require macOS and cannot be containerized
- The Docker image includes all build tools, so you don't need them locally

## 🎓 For Your Boss

Your boss can now build and run the app with just:

```bash
make build        # Build APK in Docker
make run-android  # Run on Android emulator
```

No need to install:
- ❌ Node.js
- ❌ React Native CLI
- ❌ Android Studio (just for emulator)
- ❌ Gradle
- ❌ Java JDK

Just Docker Desktop + Android Studio (for emulator) or Xcode (for simulator)!

