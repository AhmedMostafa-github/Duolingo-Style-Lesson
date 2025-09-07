import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useLessonStore } from '../state/lessonStore';

type LessonStartNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LessonStart'
>;

const LessonStart: React.FC = () => {
  const navigation = useNavigation<LessonStartNavigationProp>();
  const { t, i18n } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();

  // Zustand store
  const {
    lesson,
    isLoading,
    error,
    loadLesson,
    startLesson,
    setLocale,
    setTheme: setStoreTheme,
    isMidLesson,
    isGameOver,
    currentIndex,
    hearts,
    xp,
    streak,
  } = useLessonStore();

  // Get screen dimensions for responsive layout
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 360;

  // Load lesson data on component mount
  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  // Sync theme with store
  useEffect(() => {
    setStoreTheme(isDark ? 'dark' : 'light');
  }, [isDark, setStoreTheme]);

  // Sync locale with store
  useEffect(() => {
    setLocale(i18n.language);
  }, [i18n.language, setLocale]);

  // Compute ETA based on lesson data
  const estimatedTime = useMemo(() => {
    if (!lesson) return t('lessonStart.estimatedTimeValue', { min: 4, max: 6 });

    const baseTime = lesson.estimatedTime || 5;
    const exerciseCount = lesson.exercises.length;
    const timePerExercise = Math.max(1, Math.ceil(baseTime / exerciseCount));
    const totalTime = exerciseCount * timePerExercise;

    // Return range format (e.g., "6-8 min" or "6-8 دقيقة")
    const minTime = Math.max(1, totalTime - 2);
    const maxTime = totalTime + 2;

    return t('lessonStart.estimatedTimeValue', { min: minTime, max: maxTime });
  }, [lesson, t]);

  const handleStartLesson = () => {
    startLesson(); // This will clear progress and start fresh
    navigation.navigate('ExercisePlayer', {});
  };

  const handleContinueLesson = () => {
    // Navigate directly to ExercisePlayer without clearing progress
    navigation.navigate('ExercisePlayer', {});
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      minWidth: 360, // Ensure minimum width for responsive layout
    },
    header: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    settingsContainer: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      gap: theme.spacing.sm,
    },
    settingsButton: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 44, // Minimum touch target size
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    settingsButtonText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontSize: isSmallScreen ? 14 : 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lessonCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      width: '100%',
      maxWidth: 400,
      ...theme.shadows.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontSize: isSmallScreen ? 28 : 32,
    },
    subtitle: {
      ...theme.typography.h3,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      fontSize: isSmallScreen ? 20 : 24,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 24,
    },
    lessonInfo: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    infoItem: {
      alignItems: 'center',
      flex: 1,
    },
    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    estimatedTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginBottom: theme.spacing.xxl,
      fontSize: isSmallScreen ? 12 : 14,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xxl,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      minHeight: 56, // Minimum touch target size
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
    },
    startButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
      ...theme.shadows.sm,
    },
    startButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: 'center',
      fontSize: isSmallScreen ? 16 : 18,
    },
    progressInfo: {
      backgroundColor: theme.colors.infoBackground,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.info,
    },
    progressText: {
      ...theme.typography.caption,
      color: theme.colors.info,
      textAlign: 'center',
    },
    gameOverInfo: {
      backgroundColor: theme.colors.errorBackground,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    gameOverText: {
      ...theme.typography.caption,
      color: theme.colors.error,
      textAlign: 'center',
      fontWeight: '600',
    },
    continueButton: {
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: theme.spacing.xxl,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      minHeight: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      ...theme.shadows.md,
    },
    continueButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
      ...theme.shadows.sm,
    },
    continueButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: 'center',
      fontSize: isSmallScreen ? 16 : 18,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    errorText: {
      ...theme.typography.body,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    retryButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t('common.error')}: {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLesson}
            accessibilityLabel={t('common.retry')}
          >
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (lesson) {
      return (
        <View style={styles.content}>
          <View style={styles.lessonCard}>
            <Text
              style={styles.title}
              accessibilityLabel={t('a11y.lessonTitle')}
              accessibilityRole="header"
            >
              {lesson.title}
            </Text>

            <Text
              style={styles.subtitle}
              accessibilityLabel={t('a11y.lessonDescription')}
            >
              {lesson.description}
            </Text>

            <View style={styles.lessonInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('ui.exercises')}</Text>
                <Text
                  style={styles.infoValue}
                  accessibilityLabel={t('a11y.exerciseCount')}
                >
                  {lesson.exercises.length}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('ui.difficulty')}</Text>
                <Text style={styles.infoValue}>
                  {t(`ui.${lesson.difficulty}`)}
                </Text>
              </View>
            </View>

            <Text
              style={styles.estimatedTime}
              accessibilityLabel={t('a11y.estimatedTime')}
            >
              {t('lessonStart.estimatedTime')}: {estimatedTime}
            </Text>

            {/* Show progress info if mid-lesson */}
            {isMidLesson() && (
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {t('lessonStart.progressInfo', {
                    current: currentIndex + 1,
                    total: lesson.exercises.length,
                    hearts,
                    xp,
                    streak,
                  })}
                </Text>
              </View>
            )}

            {/* Show game over message */}
            {isGameOver && (
              <View style={styles.gameOverInfo}>
                <Text style={styles.gameOverText}>
                  {t('a11y.gameOver')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                (isLoading || !!error) && styles.startButtonDisabled,
              ]}
              onPress={handleStartLesson}
              disabled={isLoading || !!error}
              accessibilityLabel={t('a11y.startLesson')}
              accessibilityRole="button"
              accessibilityHint={t('a11y.startLesson')}
            >
              <Text style={styles.startButtonText}>{t('common.start')}</Text>
            </TouchableOpacity>

            {/* Show Continue button if mid-lesson */}
            {isMidLesson() && (
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (isLoading || !!error) && styles.continueButtonDisabled,
                ]}
                onPress={handleContinueLesson}
                disabled={isLoading || !!error}
                accessibilityLabel={t('a11y.continueLesson')}
                accessibilityRole="button"
                accessibilityHint={t('a11y.continueLesson')}
              >
                <Text style={styles.continueButtonText}>
                  {t('common.continue')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // Fallback content when no lesson is loaded
    return (
      <View style={styles.content}>
        <View style={styles.lessonCard}>
          <Text style={styles.title}>{t('lessonStart.title')}</Text>
          <Text style={styles.subtitle}>{t('lessonStart.subtitle')}</Text>
          <Text style={styles.description}>{t('lessonStart.description')}</Text>
          <Text style={styles.estimatedTime}>
            {t('lessonStart.estimatedTime')}
          </Text>

          <TouchableOpacity
            style={[
              styles.startButton,
              (isLoading || !!error) && styles.startButtonDisabled,
            ]}
            onPress={handleStartLesson}
            disabled={isLoading || !!error}
            accessibilityLabel={t('a11y.startLesson')}
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText}>{t('common.start')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleToggleTheme}
            accessibilityLabel={t('a11y.toggleTheme')}
            accessibilityRole="button"
            accessibilityHint={t('a11y.toggleTheme')}
          >
            <Text style={styles.settingsButtonText}>
              {isDark ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleToggleLanguage}
            accessibilityLabel={t('a11y.toggleLanguage')}
            accessibilityRole="button"
            accessibilityHint={t('a11y.toggleLanguage')}
          >
            <Text style={styles.settingsButtonText}>
              {i18n.language === 'en' ? 'ع' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

export default LessonStart;
