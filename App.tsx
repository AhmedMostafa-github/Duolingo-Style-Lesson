/**
 * DuoMiniLesson - React Native App with TypeScript
 * Features: Light/Dark themes, i18n (EN/AR with RTL), Navigation
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import HydrationProvider from './src/components/HydrationProvider';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n'; // Initialize i18n

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HydrationProvider>
          <AppContent />
        </HydrationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </>
  );
}

export default App;
