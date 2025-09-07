import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useLessonStore } from '../state/lessonStore';

type CompletionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Completion'
>;

type CompletionRouteProp = RouteProp<RootStackParamList, 'Completion'>;

const Completion: React.FC = () => {
  const navigation = useNavigation<CompletionNavigationProp>();
  const route = useRoute<CompletionRouteProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Store
  const { lesson, xp, streak, resetLessonCompletely } = useLessonStore();

  const { score = 0, streak: routeStreak = 0 } = route.params;

  // Animation values
  const [celebrationVisible, setCelebrationVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const confettiAnim = new Animated.Value(0);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Start celebration animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide confetti after animation
    setTimeout(() => {
      setCelebrationVisible(false);
    }, 3000);
  }, []);

  const handleRestartLesson = () => {
    resetLessonCompletely();
    navigation.navigate('LessonStart');
  };

  const handleNextLesson = () => {
    resetLessonCompletely();
    navigation.navigate('LessonStart');
  };

  // Simple confetti component
  const Confetti = () => {
    if (!celebrationVisible) return null;

    const confettiPieces = Array.from({ length: 20 }, (_, i) => {
      const left = Math.random() * screenWidth;
      const delay = Math.random() * 1000;
      const duration = 2000 + Math.random() * 1000;

      return (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left,
              backgroundColor: [
                theme.colors.primary,
                theme.colors.secondary,
                theme.colors.success,
                theme.colors.warning,
                theme.colors.error,
              ][Math.floor(Math.random() * 5)],
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, screenHeight + 50],
                  }),
                },
                {
                  rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      );
    });

    return <>{confettiPieces}</>;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    confettiContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    confettiPiece: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    congratulations: {
      ...theme.typography.h3,
      color: theme.colors.success,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    statsContainer: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: theme.spacing.xxl,
    },
    statItem: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      minWidth: 120,
      ...theme.shadows.sm,
    },
    statValue: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    statLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    buttonsContainer: {
      width: '100%',
      gap: theme.spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    primaryButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: 'center',
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    secondaryButtonText: {
      ...theme.typography.button,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti Animation */}
      <View style={styles.confettiContainer}>
        <Confetti />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={t('a11y.lessonComplete')}
        >
          {t('completion.title')}
        </Text>
        <Text
          style={styles.congratulations}
          accessibilityLabel={t('completion.congratulations')}
        >
          {t('completion.congratulations')}
        </Text>

        <View style={styles.statsContainer}>
          <View
            style={styles.statItem}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={t('a11y.xpEarned', { xp: xp || score })}
          >
            <Text style={styles.statValue}>{xp || score}</Text>
            <Text style={styles.statLabel}>{t('completion.xp')}</Text>
          </View>
          <View
            style={styles.statItem}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={t('a11y.streakIncrement', {
              streak: streak || routeStreak,
            })}
          >
            <Text style={styles.statValue}>{streak || routeStreak}</Text>
            <Text style={styles.statLabel}>{t('completion.streak')}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRestartLesson}
            accessibilityLabel={t('a11y.restartLesson')}
            accessibilityRole="button"
            accessibilityHint={t('a11y.restartLesson')}
          >
            <Text style={styles.primaryButtonText}>
              {t('completion.restartLesson')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleNextLesson}
            accessibilityLabel={t('completion.nextLesson')}
            accessibilityRole="button"
            accessibilityHint={t('completion.nextLesson')}
          >
            <Text style={styles.secondaryButtonText}>
              {t('completion.nextLesson')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Completion;
