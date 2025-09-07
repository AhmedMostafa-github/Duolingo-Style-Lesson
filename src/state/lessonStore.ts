import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { safeAsyncStorage } from '../utils/asyncStorageWrapper';

// Types based on lesson.json structure
export type ExerciseType =
  | 'mcq'
  | 'typeAnswer'
  | 'wordBank'
  | 'matchPairs'
  | 'listening';

export interface MatchPair {
  left: string;
  right: string;
}

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation: string;
}

export interface MCQExercise extends BaseExercise {
  type: 'mcq';
  options: string[];
  correctAnswer: number;
}

export interface TypeAnswerExercise extends BaseExercise {
  type: 'typeAnswer';
  correctAnswer: string;
  tolerance?: number; // For fuzzy matching
}

export interface WordBankExercise extends BaseExercise {
  type: 'wordBank';
  words: string[];
  correctAnswer: string;
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'matchPairs';
  pairs: MatchPair[];
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioUrl: string;
  correctAnswer: string;
  tolerance?: number;
}

export type Exercise =
  | MCQExercise
  | TypeAnswerExercise
  | WordBankExercise
  | MatchPairsExercise
  | ListeningExercise;

export interface NextLesson {
  id: string;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  streak_increment?: number;
  exercises: Exercise[];
  completionMessage: string;
  nextLesson?: NextLesson;
}

// Answer payload types for different exercise types
export type MCQAnswer = {
  type: 'mcq';
  selectedIndex: number;
};

export type TypeAnswerAnswer = {
  type: 'typeAnswer';
  text: string;
};

export type WordBankAnswer = {
  type: 'wordBank';
  selectedWord: string;
};

export type MatchPairsAnswer = {
  type: 'matchPairs';
  matches: { [key: string]: string };
};

export type ListeningAnswer = {
  type: 'listening';
  text: string;
};

export type AnswerPayload =
  | MCQAnswer
  | TypeAnswerAnswer
  | WordBankAnswer
  | MatchPairsAnswer
  | ListeningAnswer;

// Store state interface
export interface LessonState {
  // Lesson data
  lesson: Lesson | null;
  isLoading: boolean;
  error: string | null;

  // Progress tracking
  currentIndex: number;
  answersById: Record<string, AnswerPayload>;
  correctById: Record<string, boolean>;

  // Game state
  hearts: number;
  streak: number;
  xp: number;
  isComplete: boolean;
  isGameOver: boolean;

  // Settings
  locale: string;
  theme: 'light' | 'dark';

  // Navigation state
  shouldNavigateToPlayer: boolean;

  // Hydration state
  _hasHydrated: boolean;
}

// Store actions interface
export interface LessonActions {
  // Lesson management
  loadLesson: () => Promise<void>;
  startLesson: () => void;
  resetLesson: () => void;
  complete: () => void;

  // Exercise navigation
  next: () => void;

  // Answer handling
  submitAnswer: (exerciseId: string, payload: AnswerPayload) => void;

  // Game mechanics
  decrementHeart: () => void;
  gameOver: () => void;

  // Settings
  setLocale: (locale: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Utility functions
  isMidLesson: () => boolean;
  resetLessonCompletely: () => void;

  // Navigation state
  shouldNavigateToPlayer: boolean;
  setShouldNavigateToPlayer: (should: boolean) => void;

  // Hydration state
  setHasHydrated: (hydrated: boolean) => void;
}

// Combined store type
export type LessonStore = LessonState & LessonActions;

// Initial state
const initialState: LessonState = {
  lesson: null,
  isLoading: false,
  error: null,
  currentIndex: 0,
  answersById: {},
  correctById: {},
  hearts: 3,
  streak: 0,
  xp: 0,
  isComplete: false,
  isGameOver: false,
  locale: 'en',
  theme: 'light',
  shouldNavigateToPlayer: false,
  _hasHydrated: false,
};

// Helper function to check if answer is correct
const isAnswerCorrect = (
  exercise: Exercise,
  payload: AnswerPayload,
): boolean => {
  switch (exercise.type) {
    case 'mcq':
      if (payload.type === 'mcq') {
        return payload.selectedIndex === exercise.correctAnswer;
      }
      return false;

    case 'typeAnswer':
      if (payload.type === 'typeAnswer') {
        const tolerance = exercise.tolerance || 0;
        const userAnswer = payload.text.toLowerCase().trim();
        const correctAnswer = exercise.correctAnswer.toLowerCase().trim();

        if (tolerance === 0) {
          return userAnswer === correctAnswer;
        }

        // Simple fuzzy matching based on tolerance
        const distance = levenshteinDistance(userAnswer, correctAnswer);
        return distance <= tolerance;
      }
      return false;

    case 'wordBank':
      if (payload.type === 'wordBank') {
        return payload.selectedWord === exercise.correctAnswer;
      }
      return false;

    case 'matchPairs':
      if (payload.type === 'matchPairs') {
        // Check if all pairs match correctly
        return exercise.pairs.every(
          pair => payload.matches[pair.left] === pair.right,
        );
      }
      return false;

    case 'listening':
      if (payload.type === 'listening') {
        const tolerance = exercise.tolerance || 0;
        const userAnswer = payload.text.toLowerCase().trim();
        const correctAnswer = exercise.correctAnswer.toLowerCase().trim();

        if (tolerance === 0) {
          return userAnswer === correctAnswer;
        }

        const distance = levenshteinDistance(userAnswer, correctAnswer);
        return distance <= tolerance;
      }
      return false;

    default:
      return false;
  }
};

// Simple Levenshtein distance implementation for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }

  return matrix[str2.length][str1.length];
};

// Create the store with persistence
const createLessonStore = () => {
  return create<LessonStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,

          // Load lesson from JSON file
          loadLesson: async () => {
            console.log('🔄 loadLesson called');
            set({ isLoading: true, error: null });

            try {
              // In a real app, you might load this from a remote API
              // For now, we'll import the lesson data directly
              const lessonData = require('../assets/lesson.json') as Lesson;

              // Get current state to check if we have persisted progress
              const currentState = get();
              const hasExistingProgress =
                currentState.currentIndex > 0 ||
                Object.keys(currentState.answersById).length > 0 ||
                currentState.hearts < 3 ||
                currentState.xp > 0 ||
                currentState.streak > 0;

              set({
                lesson: lessonData,
                isLoading: false,
                // Only reset progress if we don't have existing progress
                ...(hasExistingProgress
                  ? {}
                  : {
                      currentIndex: 0,
                      answersById: {},
                      correctById: {},
                      hearts: 3,
                      streak: 0,
                      xp: 0,
                      isComplete: false,
                    }),
              });

              console.log('🎯 Lesson loaded:', {
                title: lessonData.title,
                exercises: lessonData.exercises.length,
                difficulty: lessonData.difficulty,
                hasExistingProgress,
                currentIndex: currentState.currentIndex,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Failed to load lesson',
                isLoading: false,
              });
              console.error('Failed to load lesson:', error);
            }
          },

          // Start a new lesson
          startLesson: () => {
            console.log('🔄 startLesson called');
            const { lesson } = get();
            if (!lesson) return;

            set({
              currentIndex: 0,
              answersById: {},
              correctById: {},
              hearts: 3,
              streak: 0,
              xp: 0,
              isComplete: false,
              isGameOver: false,
            });

            console.log('🚀 Lesson started:', {
              title: lesson.title,
              totalExercises: lesson.exercises.length,
            });
          },

          // Reset lesson to initial state
          resetLesson: () => {
            set({
              currentIndex: 0,
              answersById: {},
              correctById: {},
              hearts: 3,
              streak: 0,
              xp: 0,
              isComplete: false,
            });

            console.log('Lesson reset');
          },

          // Submit an answer for an exercise
          submitAnswer: (exerciseId: string, payload: AnswerPayload) => {
            const { lesson, answersById, correctById, streak, xp } = get();
            if (!lesson) return;

            const exercise = lesson.exercises.find(ex => ex.id === exerciseId);
            if (!exercise) return;

            const isCorrect = isAnswerCorrect(exercise, payload);
            const newAnswersById = { ...answersById, [exerciseId]: payload };
            const newCorrectById = { ...correctById, [exerciseId]: isCorrect };

            let newStreak = streak;
            let newXp = xp;

            if (isCorrect) {
              newStreak += 1;
              newXp += 10; // Base XP for correct answer

              // Bonus XP for streak
              if (newStreak >= 3) {
                newXp += 5;
              }
              if (newStreak >= 5) {
                newXp += 10;
              }
            } else {
              newStreak = 0;
            }

            set({
              answersById: newAnswersById,
              correctById: newCorrectById,
              streak: newStreak,
              xp: newXp,
            });

            console.log(`📝 Answer submitted for ${exerciseId}:`, {
              type: payload.type,
              isCorrect,
              streak: newStreak,
              xp: newXp,
              totalXp: newXp,
            });
          },

          // Move to next exercise
          next: () => {
            const { lesson, currentIndex } = get();
            if (!lesson) return;

            const nextIndex = currentIndex + 1;
            const isLastExercise = nextIndex >= lesson.exercises.length;

            if (isLastExercise) {
              get().complete();
            } else {
              set({ currentIndex: nextIndex });
              console.log(
                `➡️ Moved to exercise ${nextIndex + 1}/${
                  lesson.exercises.length
                }`,
              );
            }
          },

          // Decrement hearts (for wrong answers)
          decrementHeart: () => {
            const { hearts } = get();
            if (hearts > 0) {
              const newHearts = hearts - 1;
              set({ hearts: newHearts });
              console.log(`💔 Heart lost. Remaining hearts: ${newHearts}`);

              // Check for game over
              if (newHearts === 0) {
                console.log('💀 Game Over! No hearts remaining.');
                get().gameOver();
              }
            }
          },

          // Game over - reset progress and end lesson
          gameOver: () => {
            console.log('💀 Game Over! Resetting lesson progress.');
            set({
              isGameOver: true,
              isComplete: false,
              currentIndex: 0,
              answersById: {},
              correctById: {},
              hearts: 3, // Reset hearts for next attempt
              streak: 0,
              xp: 0,
              shouldNavigateToPlayer: false,
            });
          },

          // Complete the lesson
          complete: () => {
            const { lesson, xp, streak } = get();
            if (!lesson) return;

            const streakIncrement = lesson.streak_increment || 1;
            set({
              isComplete: true,
              streak: streak + streakIncrement,
            });
            console.log('🎉 Lesson completed!', {
              lesson: lesson.title,
              totalXp: xp,
              finalStreak: streak + streakIncrement,
              streakIncrement,
            });
          },

          // Set locale
          setLocale: (locale: string) => {
            set({ locale });
            console.log('🌍 Locale changed to:', locale);
          },

          // Set theme
          setTheme: (theme: 'light' | 'dark') => {
            set({ theme });
            console.log('🎨 Theme changed to:', theme);
          },

          // Check if we're in the middle of a lesson
          isMidLesson: () => {
            const { lesson, currentIndex, isComplete } = get();
            return Boolean(lesson && currentIndex > 0 && !isComplete);
          },

          // Reset lesson completely (for restart)
          resetLessonCompletely: () => {
            set({
              currentIndex: 0,
              answersById: {},
              correctById: {},
              hearts: 3,
              streak: 0,
              xp: 0,
              isComplete: false,
            });
            console.log('🔄 Lesson completely reset');
          },

          // Set navigation state
          setShouldNavigateToPlayer: (should: boolean) => {
            set({ shouldNavigateToPlayer: should });
            console.log('🧭 Navigation state set:', should);
          },

          // Set hydration state
          setHasHydrated: (hydrated: boolean) => {
            set({ _hasHydrated: hydrated });
            console.log('💧 Hydration state set:', hydrated);
          },
        }),
        {
          name: 'lesson-store',
          storage: {
            getItem: async (name: string) => {
              try {
                const value = await safeAsyncStorage.getItem(name);
                return value ? JSON.parse(value) : null;
              } catch (error) {
                console.error('Error loading from AsyncStorage:', error);
                return null;
              }
            },
            setItem: async (name: string, value: any) => {
              try {
                await safeAsyncStorage.setItem(name, JSON.stringify(value));
              } catch (error) {
                console.error('Error saving to AsyncStorage:', error);
              }
            },
            removeItem: async (name: string) => {
              try {
                await safeAsyncStorage.removeItem(name);
              } catch (error) {
                console.error('Error removing from AsyncStorage:', error);
              }
            },
          },
          partialize: state => ({
            currentIndex: state.currentIndex,
            answersById: state.answersById,
            correctById: state.correctById,
            hearts: state.hearts,
            xp: state.xp,
            streak: state.streak,
            locale: state.locale,
            theme: state.theme,
            isComplete: state.isComplete,
          }),
          onRehydrateStorage: () => state => {
            if (state) {
              state.setHasHydrated(true);
              console.log('💧 Store rehydrated from AsyncStorage');
            }
          },
        },
      ),
      {
        name: 'lesson-store',
      },
    ),
  );
};

// Check if AsyncStorage is available and create appropriate store
let useLessonStore: ReturnType<typeof createLessonStore>;

try {
  // Try to create the persistent store
  useLessonStore = createLessonStore();
  console.log('✅ Created persistent lesson store');
} catch (error) {
  console.warn('⚠️ AsyncStorage not available, using simple store:', error);
  // Import and use simple store
  const { createSimpleStore } = require('./simpleStore');
  useLessonStore = createSimpleStore();
}

export { useLessonStore };

// Selectors for performance optimization
export const selectCurrentExercise = (state: LessonStore) => {
  const { lesson, currentIndex } = state;
  if (!lesson || currentIndex >= lesson.exercises.length) return null;
  return lesson.exercises[currentIndex];
};

export const selectProgress = (state: LessonStore) => {
  const { lesson, currentIndex } = state;
  if (!lesson) return { current: 0, total: 0, percentage: 0 };

  const total = lesson.exercises.length;
  const current = currentIndex + 1;
  const percentage = (current / total) * 100;

  return { current, total, percentage };
};

export const selectAnsweredExercises = (state: LessonStore) => {
  const { answersById } = state;
  return Object.keys(answersById).length;
};

export const selectCorrectAnswers = (state: LessonStore) => {
  const { correctById } = state;
  return Object.values(correctById).filter(Boolean).length;
};

export const selectAccuracy = (state: LessonStore) => {
  const { correctById } = state;
  const total = Object.keys(correctById).length;
  if (total === 0) return 0;

  const correct = Object.values(correctById).filter(Boolean).length;
  return (correct / total) * 100;
};

export const selectIsLastExercise = (state: LessonStore) => {
  const { lesson, currentIndex } = state;
  if (!lesson) return false;
  return currentIndex >= lesson.exercises.length - 1;
};

export const selectCanProceed = (state: LessonStore) => {
  const { lesson, currentIndex, answersById } = state;
  if (!lesson) return false;

  const currentExercise = lesson.exercises[currentIndex];
  return currentExercise && answersById[currentExercise.id] !== undefined;
};

// Hook for using selectors
export const useLessonSelector = <T>(
  selector: (state: LessonStore) => T,
): T => {
  return useLessonStore(selector);
};
