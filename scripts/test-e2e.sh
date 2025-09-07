#!/bin/bash

# E2E Test Script for DuoMiniLesson
# This script runs end-to-end tests using Maestro

echo "🧪 Running E2E Tests for DuoMiniLesson..."

# Check if Maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro is not installed. Please install it first:"
    echo "   curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    echo "   export PATH=\"\$PATH:\$HOME/.maestro/bin\""
    exit 1
fi

# Check if Android emulator is running
if ! adb devices | grep -q "emulator"; then
    echo "❌ No Android emulator found. Please start an emulator first."
    exit 1
fi

# Install the app if not already installed
echo "📱 Installing app on emulator..."
npx react-native run-android --variant=debug

# Wait for app to be ready
echo "⏳ Waiting for app to be ready..."
sleep 10

# Run Maestro tests
echo "🚀 Running Maestro E2E tests..."
maestro test maestro.yaml

if [ $? -eq 0 ]; then
    echo "✅ E2E tests passed!"
else
    echo "❌ E2E tests failed!"
    exit 1
fi
