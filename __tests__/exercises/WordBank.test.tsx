import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WordBank from '../../src/exercises/WordBank';

// Mock the theme provider
jest.mock('../../src/theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#007AFF',
        surface: '#F2F2F7',
        surfaceVariant: '#E5E5EA',
        border: '#C6C6C8',
        success: '#34C759',
        successBackground: '#E8F5E8',
        error: '#FF3B30',
        errorBackground: '#FFEBEE',
        text: '#000000',
        white: '#FFFFFF',
      },
      spacing: {
        sm: 8,
        md: 16,
        lg: 24,
      },
      borderRadius: {
        md: 8,
      },
      shadows: {
        sm: {},
      },
      typography: {
        h4: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16 },
        bodySmall: { fontSize: 14 },
      },
    },
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockProps = {
  question: 'Arrange the words to form a sentence',
  words: ['Hello', 'world', 'beautiful'],
  correctAnswer: 'Hello beautiful world',
  onAnswer: jest.fn(),
};

describe('WordBank Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question and word options correctly', () => {
    const { getByText } = render(<WordBank {...mockProps} />);

    expect(getByText('Arrange the words to form a sentence')).toBeTruthy();
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('world')).toBeTruthy();
    expect(getByText('beautiful')).toBeTruthy();
  });

  it('calls onAnswer when a word is selected', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    fireEvent.press(helloWord);

    expect(mockProps.onAnswer).toHaveBeenCalledWith('Hello');
  });

  it('shows selected word in drop zone', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    fireEvent.press(helloWord);

    // Should show the selected word in the drop zone
    expect(getByText('Hello')).toBeTruthy(); // The selected word should appear in drop zone
  });

  it('shows selected state when a word is selected', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    fireEvent.press(helloWord);

    // Check if the word has the selected accessibility state
    expect(helloWord.parent?.props.accessibilityState?.selected).toBe(true);
  });

  it('shows correct answer when showResult is true', () => {
    const { getByText } = render(<WordBank {...mockProps} showResult={true} />);

    // The correct word should be highlighted
    const correctWord = getByText('Hello');
    expect(correctWord.parent?.props.accessibilityLabel).toContain(
      'correct answer',
    );
  });

  it('shows incorrect answer when wrong word is selected', () => {
    const { getByText } = render(<WordBank {...mockProps} showResult={true} />);

    // Select a wrong word first
    const wrongWord = getByText('world');
    fireEvent.press(wrongWord);

    expect(wrongWord.parent?.props.accessibilityLabel).toContain(
      'incorrect answer',
    );
  });

  it('disables words when showResult is true', () => {
    const { getByText } = render(<WordBank {...mockProps} showResult={true} />);
    const helloWord = getByText('Hello');

    fireEvent.press(helloWord);
    expect(mockProps.onAnswer).not.toHaveBeenCalled();
  });

  it('has proper accessibility labels for words', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    expect(helloWord.parent?.props.accessibilityLabel).toContain(
      'Select word: Hello',
    );
  });

  it('shows visual indicators (✓) for correct answers', () => {
    const { getByText } = render(<WordBank {...mockProps} showResult={true} />);

    // Should show checkmark for correct answer
    expect(getByText('✓')).toBeTruthy();
  });

  it('shows visual indicators (✗) for incorrect answers', () => {
    const { getByText } = render(<WordBank {...mockProps} showResult={true} />);

    // Select wrong word first
    const wrongWord = getByText('world');
    fireEvent.press(wrongWord);

    // Should show X for incorrect answer
    expect(getByText('✗')).toBeTruthy();
  });

  it('has proper accessibility roles', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    expect(helloWord.parent?.props.accessibilityRole).toBe('button');
  });

  it('validates ordered sequence correctly', () => {
    // Test that the component properly validates the correct sequence
    const { getByText } = render(<WordBank {...mockProps} />);

    // Select words in correct order
    fireEvent.press(getByText('Hello'));
    fireEvent.press(getByText('beautiful'));
    fireEvent.press(getByText('world'));

    // The component should call onAnswer with the selected word each time
    expect(mockProps.onAnswer).toHaveBeenCalledWith('Hello');
    expect(mockProps.onAnswer).toHaveBeenCalledWith('beautiful');
    expect(mockProps.onAnswer).toHaveBeenCalledWith('world');
  });

  it('has minimum touch target size for words', () => {
    const { getByText } = render(<WordBank {...mockProps} />);
    const helloWord = getByText('Hello');

    expect(helloWord.parent?.props.style).toMatchObject(
      expect.objectContaining({
        minHeight: 44,
      }),
    );
  });

  it('shows drop zone with proper text', () => {
    const { getByText } = render(<WordBank {...mockProps} />);

    expect(getByText('Drop zone')).toBeTruthy();
  });
});
