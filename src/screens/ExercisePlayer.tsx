import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  AccessibilityInfo,
  Platform,
  Vibration,
  KeyboardAvoidingView,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { RootStackParamList } from '../navigation/RootNavigator';
import ProgressBar from '../components/ProgressBar';
import StreakHearts from '../components/StreakHearts';
import FeedbackBanner from '../components/FeedbackBanner';
import MCQ from '../exercises/MCQ';
import TypeAnswer from '../exercises/TypeAnswer';
import WordBank from '../exercises/WordBank';
import MatchPairs from '../exercises/MatchPairs';
import Listening from '../exercises/Listening';
import { useLessonStore, AnswerPayload } from '../state/lessonStore';

type ExercisePlayerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ExercisePlayer'
>;

const ExercisePlayer: React.FC = () => {
  const navigation = useNavigation<ExercisePlayerNavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Zustand store - use single call to prevent multiple re-renders
  const storeState = useLessonStore();

  // Destructure from store state
  const {
    lesson,
    hearts,
    streak,
    xp,
    isComplete,
    isGameOver,
    currentIndex,
    submitAnswer,
    next,
    decrementHeart,
    complete,
  } = storeState;

  // Derived values - calculate these from the store state
  const currentExercise =
    lesson && currentIndex < lesson.exercises.length
      ? lesson.exercises[currentIndex]
      : null;

  const progress = lesson
    ? {
        current: currentIndex + 1,
        total: lesson.exercises.length,
        percentage: ((currentIndex + 1) / lesson.exercises.length) * 100,
      }
    : { current: 0, total: 0, percentage: 0 };

  const isLastExercise = lesson
    ? currentIndex >= lesson.exercises.length - 1
    : false;

  // Local state for UI feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    'correct' | 'incorrect' | 'hint'
  >('correct');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerPayload | null>(
    null,
  );

  // Refs for focus management
  const hasNavigatedRef = useRef(false);
  const feedbackBannerRef = useRef<View>(null);

  // Screen dimensions for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 400;

  // Navigate to completion when lesson is complete
  useEffect(() => {
    if (isComplete && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigation.navigate('Completion', {
        score: xp,
        streak: streak,
      });
    }
  }, [isComplete, xp, streak, navigation]);

  // Reset navigation ref when component mounts or lesson changes
  useEffect(() => {
    hasNavigatedRef.current = false;
  }, [lesson?.id]);

  // Reset feedback state when exercise changes
  useEffect(() => {
    setShowFeedback(false);
    setSelectedAnswer(null);
  }, [currentExercise?.id]);

  // Handle game over - navigate back to lesson start
  useEffect(() => {
    if (isGameOver) {
      console.log('💀 Game Over detected, navigating back to lesson start');
      navigation.navigate('LessonStart');
    }
  }, [isGameOver, navigation]);

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'success' | 'error') => {
    if (Platform.OS === 'ios') {
      // iOS haptic feedback
      const { HapticFeedback } = require('react-native');
      if (HapticFeedback) {
        HapticFeedback.trigger(
          type === 'success' ? 'impactLight' : 'notificationError',
        );
      }
    } else if (Platform.OS === 'android') {
      // Android vibration
      Vibration.vibrate(type === 'success' ? 50 : 100);
    }
  };

  // Normalize answer for comparison
  const normalizeAnswer = (answer: string): string => {
    return answer
      .trim()
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, ''); // Remove accent marks
  };

  // Check if answer is correct
  const isAnswerCorrect = (exercise: any, payload: AnswerPayload): boolean => {
    switch (exercise.type) {
      case 'mcq':
        if (payload.type === 'mcq') {
          return payload.selectedIndex === exercise.correctAnswer;
        }
        return false;

      case 'typeAnswer':
        if (payload.type === 'typeAnswer') {
          const normalizedUserAnswer = normalizeAnswer(payload.text);
          const normalizedCorrectAnswer = normalizeAnswer(
            exercise.correctAnswer,
          );
          return normalizedUserAnswer === normalizedCorrectAnswer;
        }
        return false;

      case 'wordBank':
        if (payload.type === 'wordBank') {
          return payload.selectedWord === exercise.correctAnswer;
        }
        return false;

      case 'matchPairs':
        if (payload.type === 'matchPairs') {
          // Check if all pairs are correctly matched
          const exercisePairs = exercise.pairs || [];
          const userMatches = payload.matches || {};

          // Debug logging
          if (__DEV__) {
            console.log('🔍 ExercisePlayer MatchPairs Debug:');
            console.log('Exercise pairs:', exercisePairs);
            console.log('User matches:', userMatches);
            exercisePairs.forEach((pair: { left: string; right: string }) => {
              const userMatch = userMatches[pair.left];
              const isCorrect = userMatch === pair.right;
              console.log(
                `${pair.left} -> ${userMatch} (correct: ${pair.right}) = ${isCorrect}`,
              );
            });
          }

          return exercisePairs.every(
            (pair: { left: string; right: string }) =>
              userMatches[pair.left] === pair.right,
          );
        }
        return false;

      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isLastExercise) {
      complete();
    } else {
      next();
      setShowFeedback(false);
      setSelectedAnswer(null);
    }
  };

  const handleAnswer = (payload: AnswerPayload) => {
    if (!currentExercise) return;

    setSelectedAnswer(payload);
    const isCorrect = isAnswerCorrect(currentExercise, payload);

    // Submit answer to store
    submitAnswer(currentExercise.id, payload);

    // Set feedback
    if (isCorrect) {
      setFeedbackType('correct');
      triggerHapticFeedback('success');
      AccessibilityInfo.announceForAccessibility(
        t('components.feedbackBanner.correct'),
      );
    } else {
      setFeedbackType('incorrect');
      decrementHeart();
      triggerHapticFeedback('error');
      AccessibilityInfo.announceForAccessibility(
        t('components.feedbackBanner.incorrect'),
      );
    }

    // Set feedback message
    setFeedbackMessage(currentExercise.explanation || '');
    setShowFeedback(true);

    // Focus on feedback banner after a short delay
    setTimeout(() => {
      if (feedbackBannerRef.current) {
        feedbackBannerRef.current.focus();
      }
    }, 100);
  };

  // Render exercise component based on type
  const renderExercise = () => {
    if (!currentExercise) return null;

    const commonProps = {
      showResult: showFeedback,
    };

    switch (currentExercise.type) {
      case 'mcq':
        return (
          <MCQ
            question={currentExercise.question}
            options={currentExercise.options}
            correctAnswer={currentExercise.correctAnswer}
            onAnswer={selectedIndex =>
              handleAnswer({ type: 'mcq', selectedIndex })
            }
            selectedAnswer={
              selectedAnswer?.type === 'mcq'
                ? selectedAnswer.selectedIndex
                : undefined
            }
            {...commonProps}
          />
        );

      case 'typeAnswer':
        return (
          <TypeAnswer
            question={currentExercise.question}
            correctAnswer={currentExercise.correctAnswer}
            onAnswer={text => handleAnswer({ type: 'typeAnswer', text })}
            placeholder={t('exercises.typeAnswer.placeholder')}
            {...commonProps}
          />
        );

      case 'wordBank':
        return (
          <WordBank
            question={currentExercise.question}
            words={currentExercise.words}
            correctAnswer={currentExercise.correctAnswer}
            onAnswer={selectedWord =>
              handleAnswer({ type: 'wordBank', selectedWord })
            }
            {...commonProps}
          />
        );

      case 'matchPairs':
        return (
          <MatchPairs
            question={currentExercise.question}
            pairs={currentExercise.pairs}
            onAnswer={matches => handleAnswer({ type: 'matchPairs', matches })}
            {...commonProps}
          />
        );

      case 'listening':
        return (
          <Listening
            question={currentExercise.question}
            audioUrl={currentExercise.audioUrl}
            correctAnswer={currentExercise.correctAnswer}
            onAnswer={text => handleAnswer({ type: 'listening', text })}
            tolerance={currentExercise.tolerance}
            {...commonProps}
          />
        );

      default:
        return (
          <View style={styles.unsupportedContainer}>
            <Text style={styles.unsupportedText}>
              Unsupported exercise type: {(currentExercise as any).type}
            </Text>
          </View>
        );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    progressContainer: {
      flex: 1,
      marginRight: I18nManager.isRTL ? 0 : theme.spacing.md,
      marginLeft: I18nManager.isRTL ? theme.spacing.md : 0,
    },
    streakContainer: {
      marginLeft: I18nManager.isRTL ? 0 : theme.spacing.md,
      marginRight: I18nManager.isRTL ? theme.spacing.md : 0,
    },
    content: {
      flex: 1,
      padding: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
    },
    questionContainer: {
      backgroundColor: theme.colors.surface,
      padding: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    questionText: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    progressText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
    exerciseContainer: {
      backgroundColor: theme.colors.surface,
      padding: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    unsupportedContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    unsupportedText: {
      ...theme.typography.body,
      color: theme.colors.error,
      textAlign: 'center',
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignSelf: 'center',
      minWidth: 120,
      minHeight: 48, // Minimum touch target size
      ...theme.shadows.md,
    },
    nextButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: 'center',
    },
    nextButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
      ...theme.shadows.sm,
    },
    bottomContainer: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress.percentage}
            current={progress.current}
            total={progress.total}
          />
        </View>
        <View style={styles.streakContainer}>
          <StreakHearts streak={streak} hearts={hearts} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionContainer}>
            <Text
              style={styles.questionText}
              accessibilityLabel={t('a11y.questionNumber', {
                current: progress.current,
                total: progress.total,
              })}
            >
              {currentExercise ? currentExercise.question : t('common.loading')}
            </Text>
            <Text style={styles.progressText}>
              {t('exercisePlayer.progress')}: {progress.current} /{' '}
              {progress.total}
            </Text>
          </View>

          <View style={styles.exerciseContainer}>{renderExercise()}</View>

          {showFeedback && (
            <View
              ref={feedbackBannerRef}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={
                feedbackType === 'correct'
                  ? t('a11y.feedbackCorrect', { message: feedbackMessage })
                  : t('a11y.feedbackIncorrect', { message: feedbackMessage })
              }
            >
              <FeedbackBanner type={feedbackType} message={feedbackMessage} />
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !showFeedback && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!showFeedback}
            accessibilityLabel={
              isLastExercise ? t('a11y.finishLesson') : t('a11y.nextQuestion')
            }
            accessibilityRole="button"
            accessibilityState={{ disabled: !showFeedback }}
          >
            <Text style={styles.nextButtonText}>
              {isLastExercise ? t('common.finish') : t('common.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ExercisePlayer;
