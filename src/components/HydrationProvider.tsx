import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useLessonStore } from '../state/lessonStore';

interface HydrationProviderProps {
  children: React.ReactNode;
}

const HydrationProvider: React.FC<HydrationProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    loadLesson,
    isMidLesson,
    isLoading,
    error,
    setShouldNavigateToPlayer,
    _hasHydrated,
  } = useLessonStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [loadingStep, setLoadingStep] = useState('initializing');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load lesson data
        await loadLesson();

        // Wait for store to be hydrated from AsyncStorage
        const waitForHydration = () => {
          return new Promise<void>(resolve => {
            const checkHydration = () => {
              if (_hasHydrated) {
                resolve();
              } else {
                setTimeout(checkHydration, 50);
              }
            };
            checkHydration();
          });
        };

        await waitForHydration();

        // Check if we're in the middle of a lesson
        const midLesson = isMidLesson();

        console.log('🔍 Checking mid-lesson state:', {
          midLesson,
          currentIndex: useLessonStore.getState().currentIndex,
          hearts: useLessonStore.getState().hearts,
          xp: useLessonStore.getState().xp,
          streak: useLessonStore.getState().streak,
          hasHydrated: _hasHydrated,
        });

        if (midLesson) {
          setShowResumeToast(true);
          // Don't auto-navigate, let user choose on LessonStart screen
          // setShouldNavigateToPlayer(true);
          // Hide toast after delay
          setTimeout(() => {
            setShowResumeToast(false);
          }, 2000);
        }

        setIsHydrated(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setIsHydrated(true);
      }
    };

    initializeApp();
  }, [_hasHydrated]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    errorContainer: {
      backgroundColor: theme.colors.errorBackground,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.error,
      margin: theme.spacing.lg,
    },
    errorTitle: {
      ...theme.typography.h4,
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    errorMessage: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignSelf: 'center',
    },
    retryButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
    },
    resumeToast: {
      position: 'absolute',
      top: 100,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: theme.colors.infoBackground,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.info,
      zIndex: 1000,
    },
    resumeToastText: {
      ...theme.typography.body,
      color: theme.colors.info,
      textAlign: 'center',
    },
  });

  // Show loading screen while hydrating
  if (!isHydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  // Show error state if lesson loading failed
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t('errors.loadingFailed')}</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.retryButton} onPress={() => loadLesson()}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {children}
      {showResumeToast && (
        <View style={styles.resumeToast}>
          <Text style={styles.resumeToastText}>{t('app.resumingLesson')}</Text>
        </View>
      )}
    </>
  );
};

export default HydrationProvider;
