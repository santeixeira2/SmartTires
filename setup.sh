#!/bin/bash

# Simple setup for boss - React Native CarPlay App
# This is MUCH simpler than Docker

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 SmartTire CarPlay App - Simple Setup"
echo "======================================"

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

if ! command -v xcodebuild &> /dev/null; then
    print_error "Xcode is not installed. Please install Xcode from App Store."
    exit 1
fi

print_success "Prerequisites OK!"

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install --legacy-peer-deps

print_success "Dependencies installed!"

# Install iOS CocoaPods dependencies
print_status "Installing iOS CocoaPods dependencies..."
cd ios
if command -v bundle &> /dev/null; then
    print_status "Installing CocoaPods via Bundler..."
    bundle install
    bundle exec pod install
else
    print_status "Installing CocoaPods directly..."
    if ! command -v pod &> /dev/null; then
        print_status "Installing CocoaPods..."
        sudo gem install cocoapods
    fi
    pod install
fi
cd ..

print_success "iOS dependencies installed!"

# Start Metro bundler
print_status "Starting Metro bundler..."
npm start &
METRO_PID=$!

# Wait a moment for Metro to start
sleep 3

print_status "Starting iOS app with CarPlay support..."
npx react-native run-ios --simulator="iPhone 16 Pro"

print_success "App is running!"
echo ""
echo "🎉 Your SmartTire CarPlay app is now running!"
echo "📱 iOS Simulator: Running"
echo "🌐 Metro Bundler: Running"
echo ""
echo "🚗 To test CarPlay:"
echo "   1. In iOS Simulator, go to Settings > General > CarPlay"
echo "   2. Or use Hardware > External Displays > CarPlay"
echo "   3. Your app should appear in the CarPlay interface"
echo ""
echo "Press Ctrl+C to stop Metro bundler"

# Wait for Metro to be interrupted
wait $METRO_PID
