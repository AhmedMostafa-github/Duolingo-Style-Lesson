#!/bin/bash

# Script to fix AsyncStorage linking issues
echo "🔧 Fixing AsyncStorage linking issues..."

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📦 Installing pods..."
cd ios && pod install && cd ..

echo "🧹 Cleaning build cache..."
npx react-native start --reset-cache &
METRO_PID=$!

# Wait a moment for Metro to start
sleep 3

echo "🏗️ Building iOS app..."
npx react-native run-ios --simulator="iPhone 15"

# Kill Metro if it's still running
kill $METRO_PID 2>/dev/null || true

echo "✅ AsyncStorage fix complete!"
