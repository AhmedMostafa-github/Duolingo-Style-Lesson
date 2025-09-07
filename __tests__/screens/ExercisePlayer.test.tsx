import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ExercisePlayer from '../../src/screens/ExercisePlayer';
import { useLessonStore } from '../../src/state/lessonStore';

// Mock the lesson store
jest.mock('../../src/state/lessonStore');
const mockUseLessonStore = useLessonStore as jest.MockedFunction<
  typeof useLessonStore
>;

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

const mockStoreState = {
  lesson: mockLesson,
  hearts: 3,
  streak: 0,
  xp: 0,
  isComplete: false,
  currentIndex: 0,
  answersById: {},
  correctById: {},
  submitAnswer: jest.fn(),
  next: jest.fn(),
  decrementHeart: jest.fn(),
  complete: jest.fn(),
  loadLesson: jest.fn(),
  startLesson: jest.fn(),
  setLocale: jest.fn(),
  setTheme: jest.fn(),
  resetLesson: jest.fn(),
  resetLessonCompletely: jest.fn(),
  shouldNavigateToPlayer: false,
  setShouldNavigateToPlayer: jest.fn(),
  isLoading: false,
  error: null,
};

const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('ExercisePlayer Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLessonStore.mockReturnValue(mockStoreState);
  });

  it('renders current exercise correctly', () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);

    expect(getByText('What is the capital of France?')).toBeTruthy();
    expect(getByText('London')).toBeTruthy();
    expect(getByText('Paris')).toBeTruthy();
    expect(getByText('Berlin')).toBeTruthy();
    expect(getByText('Madrid')).toBeTruthy();
  });

  it('shows progress bar and streak hearts', () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);

    expect(getByText('Progress: 1 / 2')).toBeTruthy();
    // Progress bar and streak hearts should be rendered
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Streak')).toBeTruthy();
  });

  it('handles correct answer submission', async () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    await waitFor(() => {
      expect(mockStoreState.submitAnswer).toHaveBeenCalledWith('ex1', {
        type: 'mcq',
        selectedIndex: 1,
      });
    });
  });

  it('handles incorrect answer and decrements hearts', async () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const londonOption = getByText('London');

    fireEvent.press(londonOption);

    await waitFor(() => {
      expect(mockStoreState.submitAnswer).toHaveBeenCalledWith('ex1', {
        type: 'mcq',
        selectedIndex: 0,
      });
      expect(mockStoreState.decrementHeart).toHaveBeenCalled();
    });
  });

  it('shows feedback after answer submission', async () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    await waitFor(() => {
      // Feedback banner should appear
      expect(getByText('Paris is the capital of France.')).toBeTruthy();
    });
  });

  it('enables Next button after feedback is shown', async () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    await waitFor(() => {
      const nextButton = getByText('Next');
      expect(nextButton.parent?.props.accessibilityState?.disabled).toBe(false);
    });
  });

  it('calls next() when Next button is pressed', async () => {
    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    await waitFor(() => {
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      expect(mockStoreState.next).toHaveBeenCalled();
    });
  });

  it('shows Finish button on last exercise', () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      currentIndex: 1, // Last exercise
    });

    const { getByText } = renderWithNavigation(<ExercisePlayer />);

    expect(getByText('Finish')).toBeTruthy();
  });

  it('calls complete() when Finish button is pressed', async () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      currentIndex: 1, // Last exercise
    });

    const { getByText } = renderWithNavigation(<ExercisePlayer />);
    const finishButton = getByText('Finish');

    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(mockStoreState.complete).toHaveBeenCalled();
    });
  });

  it('navigates to Completion when lesson is complete', async () => {
    const mockNavigate = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
    }));

    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      isComplete: true,
      xp: 20,
      streak: 2,
    });

    renderWithNavigation(<ExercisePlayer />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Completion', {
        score: 20,
        streak: 2,
      });
    });
  });

  it('renders TypeAnswer exercise correctly', () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      currentIndex: 1, // Second exercise is TypeAnswer
    });

    const { getByText, getByPlaceholderText } = renderWithNavigation(
      <ExercisePlayer />,
    );

    expect(getByText('Type "hello" in English')).toBeTruthy();
    expect(getByPlaceholderText('Enter your answer here...')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = renderWithNavigation(<ExercisePlayer />);

    expect(getByLabelText('Question 1 of 2')).toBeTruthy();
    expect(getByLabelText('Go to next question')).toBeTruthy();
  });

  it('shows correct accessibility labels for feedback', async () => {
    const { getByText, getByLabelText } = renderWithNavigation(
      <ExercisePlayer />,
    );
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    await waitFor(() => {
      expect(getByLabelText(/Correct!/)).toBeTruthy();
    });
  });

  it('handles keyboard avoiding view', () => {
    const { getByPlaceholderText } = renderWithNavigation(<ExercisePlayer />);

    // TypeAnswer input should be present for keyboard testing
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      currentIndex: 1,
    });

    expect(getByPlaceholderText('Enter your answer here...')).toBeTruthy();
  });

  it('shows unsupported exercise type message', () => {
    const unsupportedLesson = {
      ...mockLesson,
      exercises: [
        {
          id: 'ex1',
          type: 'unsupported' as any,
          question: 'Test question',
          correctAnswer: 'test',
          explanation: 'Test explanation',
        },
      ],
    };

    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      lesson: unsupportedLesson,
    });

    const { getByText } = renderWithNavigation(<ExercisePlayer />);

    expect(getByText('Unsupported exercise type: unsupported')).toBeTruthy();
  });
});
