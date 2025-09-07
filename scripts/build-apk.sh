#!/bin/bash

# Build Debug APK Script for DuoMiniLesson
# This script builds an installable debug APK

echo "🔨 Building Debug APK for DuoMiniLesson..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Build debug APK
echo "📦 Building debug APK..."
./gradlew assembleDebug

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Debug APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "To install on device/emulator:"
    echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "APK size:"
    ls -lh android/app/build/outputs/apk/debug/app-debug.apk
else
    echo "❌ Build failed!"
    exit 1
fi
