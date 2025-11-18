.PHONY: build build-android build-android-host build-ios run-android run-ios start-metro dev-android dev-ios clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make build              - Build Android APK on host (Docker build bypassed)"
	@echo "  make build-android-host - Build Android APK on host Mac"
	@echo "  make build-ios          - Build iOS app (requires macOS host, not Docker)"
	@echo "  make start-metro        - Start Metro bundler in Docker container"
	@echo "  make dev-android        - Full dev workflow: Metro (Docker) + Build + Run Android"
	@echo "  make dev-ios            - Full dev workflow: Metro (Docker) + Build + Run iOS"
	@echo "  make run-android        - Install and run APK on connected Android device/emulator"
	@echo "  make run-ios            - Install and run iOS app on simulator"
	@echo "  make clean              - Clean build artifacts and Docker cache"

# Build Android APK - BYPASSED in Docker, build on host instead
build: build-android-host

build-android:
	@echo "⚠️  Android build in Docker is bypassed. Use 'make build-android-host' to build on your Mac."
	@echo "🐳 Setting up Docker environment for dependencies only..."
	@mkdir -p output
	@docker-compose build
	@echo "✅ Docker environment ready. Run 'make build-android-host' to build APK on your Mac."

# Build Android APK on host (not in Docker)
build-android-host:
	@echo "🔨 Building Android APK on host (not in Docker)..."
	@mkdir -p output
	@cd android && ./gradlew clean assembleDebug
	@cp android/app/build/outputs/apk/debug/app-debug.apk ./output/carplaytest20-debug.apk
	@echo "✅ Build complete! APK available at: ./output/carplaytest20-debug.apk"

# Build iOS app (must run on macOS host, not in Docker)
build-ios:
	@echo "🍎 Building iOS app (requires macOS host)..."
	@echo "⚠️  iOS builds cannot run in Docker - using local Xcode"
	@cd ios && \
		xcodebuild -workspace carplaytest20.xcworkspace \
		-scheme carplaytest20 \
		-configuration Debug \
		-sdk iphonesimulator \
		-derivedDataPath build \
		-quiet || echo "Build failed - check Xcode setup"

# Run Android APK on connected device/emulator
run-android:
	@if [ ! -f "./output/carplaytest20-debug.apk" ]; then \
		echo "❌ APK not found. Run 'make build' first."; \
		exit 1; \
	fi
	@echo "📱 Installing APK on Android device/emulator..."
	@adb devices
	@adb install -r ./output/carplaytest20-debug.apk
	@adb shell am start -n com.carplaytest20/.MainActivity
	@echo "✅ App launched!"

# Run iOS app on simulator
run-ios:
	@echo "🍎 Installing iOS app on simulator..."
	@bash -c '\
		BOOTED=$$(xcrun simctl list devices | grep -i "iPhone" | grep -i "Booted" | head -1); \
		if [ -z "$$BOOTED" ]; then \
			SIM_DEVICE=$$(xcrun simctl list devices available | grep -i "iPhone" | head -1 | sed "s/.*(\([^)]*\)).*/\1/" | xargs); \
			if [ -z "$$SIM_DEVICE" ]; then \
				echo "❌ No iPhone simulator found"; \
				exit 1; \
			fi; \
			echo "Booting simulator: $$SIM_DEVICE"; \
			xcrun simctl boot $$SIM_DEVICE 2>/dev/null || true; \
			sleep 2; \
		fi'
	@xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/carplaytest20.app
	@xcrun simctl launch booted org.reactjs.native.example.carplaytest20
	@echo "✅ App launched on simulator!"

# Start Metro bundler in Docker container
start-metro:
	@echo "🚀 Starting Metro bundler in Docker container..."
	@docker-compose up -d
	@docker-compose exec -d build npm start
	@echo "✅ Metro bundler running! Access at http://localhost:8081"
	@echo "💡 To view logs: docker-compose logs -f build"

# Full development workflow for Android
dev-android: start-metro
	@echo "📱 Building and running Android app..."
	@echo "⏳ Waiting for Metro to be ready..."
	@sleep 5
	@cd android && ./gradlew installDebug
	@adb shell am start -n com.carplaytest20/.MainActivity
	@echo "✅ Android app running! Metro bundler is in Docker."

# Full development workflow for iOS
dev-ios: start-metro
	@echo "🍎 Building and running iOS app..."
	@echo "⏳ Waiting for Metro to be ready..."
	@sleep 5
	@echo "📱 Ensuring iOS simulator is booted..."
	@bash -c '\
		BOOTED=$$(xcrun simctl list devices | grep -i "iPhone" | grep -i "Booted" | head -1); \
		if [ -z "$$BOOTED" ]; then \
			echo "Opening Simulator app..."; \
			open -a Simulator 2>/dev/null || true; \
			echo "Waiting for simulator to boot..."; \
			for i in {1..60}; do \
				BOOTED=$$(xcrun simctl list devices | grep -i "iPhone" | grep -i "Booted" | head -1); \
				if [ -n "$$BOOTED" ]; then \
					echo "✅ Simulator is ready!"; \
					break; \
				fi; \
				if [ $$i -eq 60 ]; then \
					echo "⚠️  Simulator taking too long to boot, continuing anyway..."; \
				fi; \
				sleep 1; \
			done; \
		else \
			echo "✅ Simulator already booted"; \
		fi'
	@echo "🔨 Building iOS app..."
	@cd ios && xcodebuild -workspace carplaytest20.xcworkspace \
		-scheme carplaytest20 \
		-configuration Debug \
		-sdk iphonesimulator \
		-derivedDataPath build || (echo "Build failed - check Xcode setup" && exit 1)
	@cd ..
	@echo "📲 Installing app on simulator..."
	@BOOTED_UUID=$$(xcrun simctl list devices | grep -i "iPhone" | grep -i "Booted" | sed "s/.*(\([^)]*\)).*/\1/" | head -1 | xargs) && \
	if [ -z "$$BOOTED_UUID" ]; then \
		echo "❌ No booted simulator found. Please boot a simulator manually."; \
		exit 1; \
	fi && \
	xcrun simctl install $$BOOTED_UUID ios/build/Build/Products/Debug-iphonesimulator/carplaytest20.app && \
	xcrun simctl launch $$BOOTED_UUID org.reactjs.native.example.carplaytest20 && \
	echo "✅ iOS app running! Metro bundler is in Docker."

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf output/
	@rm -rf android/app/build/
	@rm -rf android/.gradle/
	@rm -rf ios/build/
	@docker-compose down
	@docker system prune -f
	@echo "✅ Clean complete!"
