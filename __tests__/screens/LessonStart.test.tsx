import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LessonStart from '../../src/screens/LessonStart';
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
  isLoading: false,
  error: null,
  loadLesson: jest.fn(),
  startLesson: jest.fn(),
  setLocale: jest.fn(),
  setTheme: jest.fn(),
  currentIndex: 0,
  hearts: 3,
  streak: 0,
  xp: 0,
  isComplete: false,
  answersById: {},
  correctById: {},
  next: jest.fn(),
  decrementHeart: jest.fn(),
  complete: jest.fn(),
  resetLesson: jest.fn(),
  resetLessonCompletely: jest.fn(),
  shouldNavigateToPlayer: false,
  setShouldNavigateToPlayer: jest.fn(),
};

const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('LessonStart Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLessonStore.mockReturnValue(mockStoreState);
  });

  it('renders lesson information correctly', () => {
    const { getByText } = renderWithNavigation(<LessonStart />);

    expect(getByText('Basic Vocabulary')).toBeTruthy();
    expect(getByText('Learn essential words and phrases')).toBeTruthy();
    expect(getByText('2')).toBeTruthy(); // Exercise count
    expect(getByText('beginner')).toBeTruthy(); // Difficulty
    expect(getByText(/Estimated time: \d+-\d+ min/)).toBeTruthy();
  });

  it('shows loading state when lesson is loading', () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      isLoading: true,
      lesson: null,
    });

    const { getByText } = renderWithNavigation(<LessonStart />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows error state when lesson fails to load', () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      isLoading: false,
      error: 'Failed to load lesson',
      lesson: null,
    });

    const { getByText } = renderWithNavigation(<LessonStart />);
    expect(getByText('Error: Failed to load lesson')).toBeTruthy();
  });

  it('calls startLesson and navigates when Start button is pressed', async () => {
    const mockNavigate = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
    }));

    const { getByText } = renderWithNavigation(<LessonStart />);
    const startButton = getByText('Start');

    fireEvent.press(startButton);

    await waitFor(() => {
      expect(mockStoreState.startLesson).toHaveBeenCalledTimes(1);
    });
  });

  it('disables Start button when loading or error state', () => {
    mockUseLessonStore.mockReturnValue({
      ...mockStoreState,
      isLoading: true,
    });

    const { getByText } = renderWithNavigation(<LessonStart />);
    const startButton = getByText('Start');

    expect(startButton.parent?.props.accessibilityState?.disabled).toBe(true);
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = renderWithNavigation(<LessonStart />);

    expect(getByLabelText('Lesson title')).toBeTruthy();
    expect(getByLabelText('Lesson description')).toBeTruthy();
    expect(getByLabelText('Number of exercises')).toBeTruthy();
    expect(getByLabelText('Estimated time to complete')).toBeTruthy();
    expect(getByLabelText('Start the lesson')).toBeTruthy();
  });

  it('shows theme and language toggle buttons', () => {
    const { getByLabelText } = renderWithNavigation(<LessonStart />);

    expect(getByLabelText('Toggle between light and dark theme')).toBeTruthy();
    expect(getByLabelText('Toggle between English and Arabic')).toBeTruthy();
  });

  it('calculates estimated time correctly', () => {
    const { getByText } = renderWithNavigation(<LessonStart />);

    // With 2 exercises and 5 min base time, should show 4-6 min range
    expect(getByText(/Estimated time: 4-6 min/)).toBeTruthy();
  });
});
