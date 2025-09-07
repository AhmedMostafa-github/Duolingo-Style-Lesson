// Simple test to verify the Zustand store is working correctly
import { useLessonStore } from '../state/lessonStore';

export const testStore = () => {
  console.log('🧪 Testing Zustand store...');

  // Test store state
  const state = useLessonStore.getState();
  console.log('📊 Initial store state:', {
    hasLesson: !!state.lesson,
    currentIndex: state.currentIndex,
    hearts: state.hearts,
    streak: state.streak,
    xp: state.xp,
    isComplete: state.isComplete,
  });

  // Test loading lesson
  state
    .loadLesson()
    .then(() => {
      const newState = useLessonStore.getState();
      console.log('✅ Lesson loaded successfully:', {
        title: newState.lesson?.title,
        exercises: newState.lesson?.exercises.length,
      });
    })
    .catch(error => {
      console.error('❌ Failed to load lesson:', error);
    });
};

// Export for use in development
export default testStore;
