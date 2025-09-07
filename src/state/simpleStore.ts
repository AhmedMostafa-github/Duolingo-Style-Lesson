// Simple non-persistent store that doesn't use AsyncStorage at all
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LessonStore, initialState } from './lessonStore';

// Create a simple non-persistent store
export const createSimpleStore = () => {
  return create<LessonStore>()(
    devtools(
      (set, get) => ({
        ...initialState,

        // Load lesson from JSON file
        loadLesson: async () => {
          console.log('🔄 loadLesson called (simple mode)');
          set({ isLoading: true, error: null });

          try {
            const lessonData = require('../assets/lesson.json') as any;

            set({
              lesson: lessonData,
              isLoading: false,
              currentIndex: 0,
              answersById: {},
              correctById: {},
              hearts: 3,
              streak: 0,
              xp: 0,
              isComplete: false,
            });

            console.log('🎯 Lesson loaded (simple mode):', {
              title: lessonData.title,
              exercises: lessonData.exercises.length,
              difficulty: lessonData.difficulty,
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
          console.log('🔄 startLesson called (simple mode)');
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
          });

          console.log('🚀 Lesson started (simple mode):', {
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

          console.log('Lesson reset (simple mode)');
        },

        // Submit an answer for an exercise
        submitAnswer: (exerciseId: string, payload: any) => {
          const { lesson, answersById, correctById, streak, xp } = get();
          if (!lesson) return;

          const exercise = lesson.exercises.find(
            (ex: any) => ex.id === exerciseId,
          );
          if (!exercise) return;

          // Simple correctness check
          let isCorrect = false;
          if (payload.type === 'mcq') {
            isCorrect = payload.selectedIndex === exercise.correctAnswer;
          } else if (payload.type === 'typeAnswer') {
            isCorrect =
              payload.text.toLowerCase().trim() ===
              exercise.correctAnswer.toLowerCase().trim();
          } else if (payload.type === 'wordBank') {
            isCorrect = payload.selectedWord === exercise.correctAnswer;
          }

          const newAnswersById = { ...answersById, [exerciseId]: payload };
          const newCorrectById = { ...correctById, [exerciseId]: isCorrect };

          let newStreak = streak;
          let newXp = xp;

          if (isCorrect) {
            newStreak += 1;
            newXp += 10;

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

          console.log(`📝 Answer submitted for ${exerciseId} (simple mode):`, {
            type: payload.type,
            isCorrect,
            streak: newStreak,
            xp: newXp,
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
              } (simple mode)`,
            );
          }
        },

        // Decrement hearts (for wrong answers)
        decrementHeart: () => {
          const { hearts } = get();
          if (hearts > 0) {
            set({ hearts: hearts - 1 });
            console.log(
              `💔 Heart lost. Remaining hearts: ${hearts - 1} (simple mode)`,
            );
          }
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
          console.log('🎉 Lesson completed! (simple mode)', {
            lesson: lesson.title,
            totalXp: xp,
            finalStreak: streak + streakIncrement,
            streakIncrement,
          });
        },

        // Set locale
        setLocale: (locale: string) => {
          set({ locale });
          console.log('🌍 Locale changed to:', locale, '(simple mode)');
        },

        // Set theme
        setTheme: (theme: 'light' | 'dark') => {
          set({ theme });
          console.log('🎨 Theme changed to:', theme, '(simple mode)');
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
          console.log('🔄 Lesson completely reset (simple mode)');
        },

        // Set navigation state
        setShouldNavigateToPlayer: (should: boolean) => {
          set({ shouldNavigateToPlayer: should });
          console.log('🧭 Navigation state set (simple mode):', should);
        },
      }),
      {
        name: 'lesson-store-simple',
      },
    ),
  );
};
