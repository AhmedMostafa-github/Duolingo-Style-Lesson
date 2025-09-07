import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { useLessonStore } from '../../src/state/lessonStore';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

// Mock lesson data
const mockLesson = {
  id: 'lesson-001',
  title: 'Basic Vocabulary',
  description: 'Learn essential words and phrases',
  estimatedTime: 5,
  difficulty: 'beginner',
  streak_increment: 1,
  exercises: [
    {
      id: 'ex1',
      type: 'mcq' as const,
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 1,
      explanation: 'Paris is the capital of France.',
    },
    {
      id: 'ex2',
      type: 'typeAnswer' as const,
      question: 'Type "hello" in English',
      correctAnswer: 'hello',
      explanation: 'Hello is a common greeting.',
    },
  ],
};

describe('LessonStore Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  it('loads lesson data correctly', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
    });

    expect(result.current.lesson).toEqual(mockLesson);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('starts lesson and resets progress', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hearts).toBe(3);
    expect(result.current.streak).toBe(0);
    expect(result.current.xp).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.answersById).toEqual({});
    expect(result.current.correctById).toEqual({});
  });

  it('submits correct answer and updates progress', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();

      // Submit correct answer for first exercise
      result.current.submitAnswer('ex1', { type: 'mcq', selectedIndex: 1 });
    });

    expect(result.current.answersById['ex1']).toEqual({
      type: 'mcq',
      selectedIndex: 1,
    });
    expect(result.current.correctById['ex1']).toBe(true);
    expect(result.current.xp).toBeGreaterThan(0);
    expect(result.current.streak).toBeGreaterThan(0);
  });

  it('submits incorrect answer and decrements hearts', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();

      // Submit incorrect answer for first exercise
      result.current.submitAnswer('ex1', { type: 'mcq', selectedIndex: 0 });
    });

    expect(result.current.answersById['ex1']).toEqual({
      type: 'mcq',
      selectedIndex: 0,
    });
    expect(result.current.correctById['ex1']).toBe(false);
    expect(result.current.hearts).toBe(2); // Decremented from 3
    expect(result.current.streak).toBe(0);
  });

  it('persists progress to AsyncStorage', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();
      result.current.submitAnswer('ex1', { type: 'mcq', selectedIndex: 1 });
    });

    // Verify that setItem was called with the expected data
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'lesson-store',
      expect.stringContaining('"currentIndex":0'),
    );
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'lesson-store',
      expect.stringContaining('"hearts":3'),
    );
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'lesson-store',
      expect.stringContaining('"xp":'),
    );
  });

  it('restores progress from AsyncStorage on resume', async () => {
    const persistedState = JSON.stringify({
      currentIndex: 1,
      hearts: 2,
      streak: 1,
      xp: 10,
      answersById: { ex1: { type: 'mcq', selectedIndex: 1 } },
      correctById: { ex1: true },
      isComplete: false,
      locale: 'en',
      theme: 'light',
    });

    mockAsyncStorage.getItem.mockResolvedValue(persistedState);

    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.hearts).toBe(2);
    expect(result.current.streak).toBe(1);
    expect(result.current.xp).toBe(10);
    expect(result.current.answersById).toEqual({
      ex1: { type: 'mcq', selectedIndex: 1 },
    });
    expect(result.current.correctById).toEqual({ ex1: true });
  });

  it('detects mid-lesson state correctly', async () => {
    const persistedState = JSON.stringify({
      currentIndex: 1,
      hearts: 2,
      streak: 1,
      xp: 10,
      answersById: { ex1: { type: 'mcq', selectedIndex: 1 } },
      correctById: { ex1: true },
      isComplete: false,
      locale: 'en',
      theme: 'light',
    });

    mockAsyncStorage.getItem.mockResolvedValue(persistedState);

    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
    });

    expect(result.current.isMidLesson()).toBe(true);
  });

  it('completes lesson and applies streak increment', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();

      // Complete all exercises
      result.current.submitAnswer('ex1', { type: 'mcq', selectedIndex: 1 });
      result.current.next();
      result.current.submitAnswer('ex2', { type: 'typeAnswer', text: 'hello' });
      result.current.complete();
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.streak).toBe(2); // 1 from correct answers + 1 from lesson completion
  });

  it('resets lesson completely', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();
      result.current.submitAnswer('ex1', { type: 'mcq', selectedIndex: 1 });
      result.current.resetLessonCompletely();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hearts).toBe(3);
    expect(result.current.streak).toBe(0);
    expect(result.current.xp).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.answersById).toEqual({});
    expect(result.current.correctById).toEqual({});
  });

  it('handles AsyncStorage errors gracefully', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
    });

    // Should fall back to simple store without crashing
    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('validates TypeAnswer with trimming and case normalization', async () => {
    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();

      // Test with whitespace and different case
      result.current.submitAnswer('ex2', {
        type: 'typeAnswer',
        text: '  HELLO  ',
      });
    });

    expect(result.current.correctById['ex2']).toBe(true);
  });

  it('validates WordBank with exact match', async () => {
    const wordBankExercise = {
      id: 'ex3',
      type: 'wordBank' as const,
      question: 'Select the correct word',
      words: ['Hello', 'world', 'beautiful'],
      correctAnswer: 'Hello',
      explanation: 'Hello is the correct word.',
    };

    const { result } = renderHook(() => useLessonStore());

    await act(async () => {
      await result.current.loadLesson();
      result.current.startLesson();

      result.current.submitAnswer('ex3', {
        type: 'wordBank',
        selectedWord: 'Hello',
      });
    });

    expect(result.current.correctById['ex3']).toBe(true);
  });
});
