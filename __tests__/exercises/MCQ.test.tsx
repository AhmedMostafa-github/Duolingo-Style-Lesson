import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MCQ from '../../src/exercises/MCQ';

// Mock the theme provider
jest.mock('../../src/theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#007AFF',
        surface: '#F2F2F7',
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
  question: 'What is the capital of France?',
  options: ['London', 'Paris', 'Berlin', 'Madrid'],
  correctAnswer: 1, // Paris
  onAnswer: jest.fn(),
};

describe('MCQ Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question and options correctly', () => {
    const { getByText } = render(<MCQ {...mockProps} />);

    expect(getByText('What is the capital of France?')).toBeTruthy();
    expect(getByText('London')).toBeTruthy();
    expect(getByText('Paris')).toBeTruthy();
    expect(getByText('Berlin')).toBeTruthy();
    expect(getByText('Madrid')).toBeTruthy();
  });

  it('calls onAnswer when an option is selected', () => {
    const { getByText } = render(<MCQ {...mockProps} />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);

    expect(mockProps.onAnswer).toHaveBeenCalledWith(1);
  });

  it('shows selected state when an option is selected', () => {
    const { getByText } = render(<MCQ {...mockProps} selectedAnswer={1} />);
    const parisOption = getByText('Paris');

    // Check if the option has the selected accessibility state
    expect(parisOption.parent?.props.accessibilityState?.selected).toBe(true);
  });

  it('shows correct answer when showResult is true', () => {
    const { getByText } = render(
      <MCQ {...mockProps} showResult={true} selectedAnswer={1} />,
    );

    const parisOption = getByText('Paris');
    expect(parisOption.parent?.props.accessibilityLabel).toContain(
      'correct answer',
    );
  });

  it('shows incorrect answer when wrong option is selected', () => {
    const { getByText } = render(
      <MCQ {...mockProps} showResult={true} selectedAnswer={0} />,
    );

    const londonOption = getByText('London');
    expect(londonOption.parent?.props.accessibilityLabel).toContain(
      'incorrect answer',
    );
  });

  it('disables options when showResult is true', () => {
    const { getByText } = render(<MCQ {...mockProps} showResult={true} />);
    const parisOption = getByText('Paris');

    fireEvent.press(parisOption);
    expect(mockProps.onAnswer).not.toHaveBeenCalled();
  });

  it('has proper accessibility labels for options', () => {
    const { getByText } = render(<MCQ {...mockProps} />);
    const parisOption = getByText('Paris');

    expect(parisOption.parent?.props.accessibilityLabel).toContain(
      'Select option 2: Paris',
    );
  });

  it('shows visual indicators (✓) for correct answers', () => {
    const { getByText } = render(
      <MCQ {...mockProps} showResult={true} selectedAnswer={1} />,
    );

    // Should show checkmark for correct answer
    expect(getByText('✓')).toBeTruthy();
  });

  it('shows visual indicators (✗) for incorrect answers', () => {
    const { getByText } = render(
      <MCQ {...mockProps} showResult={true} selectedAnswer={0} />,
    );

    // Should show X for incorrect answer
    expect(getByText('✗')).toBeTruthy();
  });

  it('has proper accessibility roles', () => {
    const { getByText } = render(<MCQ {...mockProps} />);
    const parisOption = getByText('Paris');

    expect(parisOption.parent?.props.accessibilityRole).toBe('radio');
  });
});
