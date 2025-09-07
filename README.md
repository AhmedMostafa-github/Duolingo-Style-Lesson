# DuoMiniLesson - Language Learning App

A React Native language learning app with comprehensive testing, accessibility features, and persistent progress tracking.

## 🚀 Features

### Core Functionality

- **Multiple Exercise Types**: MCQ, TypeAnswer, and WordBank exercises
- **Progress Tracking**: Hearts system, XP points, and streak counters
- **Persistent State**: Automatic save/restore with AsyncStorage
- **Internationalization**: English and Arabic support with RTL layout
- **Theme Support**: Light and dark themes
- **Accessibility**: Full screen reader support and WCAG AA compliance

### Exercise Types

1. **Multiple Choice (MCQ)**: Select correct answer from options
2. **Type Answer**: Type text with case-insensitive validation
3. **Word Bank**: Select words in correct sequence

### User Experience

- **Responsive Design**: Optimized for 360×800 screens and larger
- **Keyboard Handling**: Proper input focus and submission
- **Visual Feedback**: Immediate correct/incorrect indicators
- **Haptic Feedback**: Success/failure vibrations
- **Smooth Navigation**: Seamless screen transitions

## 📱 Installation

### Prerequisites

- Node.js 20+
- React Native CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd DuoMiniLesson
npm install

# iOS setup
cd ios && pod install && cd ..

# Android setup (if needed)
cd android && ./gradlew clean && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🧪 Testing

### Test Coverage

- **Unit Tests**: 70+ test cases covering all components
- **Integration Tests**: State management and persistence
- **Accessibility Tests**: Screen reader and keyboard navigation
- **E2E Tests**: Complete user journey validation

### Running Tests

```bash
# Unit tests
npm test

# Tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# E2E tests (requires Maestro)
./scripts/test-e2e.sh
```

### Test Structure

```
__tests__/
├── components/          # Component tests
├── screens/            # Screen tests
├── exercises/          # Exercise component tests
├── state/              # State management tests
└── e2e/                # End-to-end tests
```

## 🏗️ Building

### Debug APK

```bash
# Build Android debug APK
npm run build:android

# Or use the build script
./scripts/build-apk.sh
```

The debug APK will be available at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build

```bash
# Build Android release APK
npm run build:android-release
```

## 🎯 Key Components

### State Management

- **Zustand Store**: Centralized state with persistence
- **AsyncStorage**: Automatic save/restore functionality
- **Fallback Handling**: Graceful degradation if storage fails

### Navigation

- **React Navigation**: Stack-based navigation
- **Auto-routing**: Resume mid-lesson on app restart
- **Deep Linking**: Support for exercise-specific URLs

### Accessibility

- **Screen Reader**: Full VoiceOver/TalkBack support
- **Keyboard Navigation**: Tab order and focus management
- **High Contrast**: WCAG AA compliant color schemes
- **Touch Targets**: Minimum 44dp touch areas

### Internationalization

- **Multi-language**: English and Arabic support
- **RTL Layout**: Proper right-to-left text direction
- **Localized Content**: All UI text and messages

## 📊 Architecture

### File Structure

```
src/
├── components/         # Reusable UI components
├── exercises/          # Exercise type implementations
├── screens/           # Main app screens
├── state/             # Zustand store and types
├── theme/             # Light/dark theme definitions
├── i18n/              # Internationalization files
├── navigation/        # Navigation configuration
└── utils/             # Utility functions
```

### State Flow

1. **App Start**: Load lesson data and check for mid-lesson state
2. **Exercise Flow**: Present exercises, collect answers, update progress
3. **Persistence**: Auto-save after each answer submission
4. **Completion**: Show results, update streak, allow restart

### Data Flow

```
Lesson JSON → Store → Components → User Input → Store → Persistence
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Custom lesson data path
LESSON_DATA_PATH=./src/assets/lesson.json

# Optional: Storage key prefix
STORAGE_KEY_PREFIX=duo-lesson
```

### Theme Customization

Edit `src/theme/light.ts` and `src/theme/dark.ts` to customize colors, spacing, and typography.

### Adding New Exercise Types

1. Create component in `src/exercises/`
2. Add type to `Exercise` union in `src/state/lessonStore.ts`
3. Update `renderExercise()` in `ExercisePlayer.tsx`
4. Add tests in `__tests__/exercises/`

## 🐛 Troubleshooting

### Common Issues

#### AsyncStorage Not Working

```bash
# Clear Metro cache
npx react-native start --reset-cache

# Reinstall pods (iOS)
cd ios && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

#### Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Check Jest configuration
npm test -- --verbose
```

#### Build Issues

```bash
# Clean all builds
npm run clean

# Reset Metro cache
npx react-native start --reset-cache
```

## 📈 Performance

### Optimizations

- **Selective Re-renders**: Zustand selectors prevent unnecessary updates
- **Lazy Loading**: Components loaded only when needed
- **Memory Management**: Proper cleanup of timers and listeners
- **Image Optimization**: Efficient asset loading

### Metrics

- **Bundle Size**: ~2.5MB (debug), ~1.8MB (release)
- **Startup Time**: <2 seconds on modern devices
- **Memory Usage**: <50MB typical usage

## 🔒 Security

### Data Protection

- **Local Storage Only**: No external data transmission
- **Input Sanitization**: All user inputs validated
- **Error Boundaries**: Graceful error handling

### Privacy

- **No Analytics**: No user tracking or data collection
- **Offline First**: Works without internet connection
- **Data Control**: Users control their own progress data

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run the test suite
5. Submit a pull request

### Code Style

- **ESLint**: Enforced code formatting
- **Prettier**: Consistent code style
- **TypeScript**: Strict type checking
- **Testing**: 70% minimum coverage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Native**: Mobile app framework
- **Zustand**: State management
- **React Navigation**: Navigation library
- **React i18next**: Internationalization
- **Testing Library**: Testing utilities

---

**Built with ❤️ for language learners everywhere**
