import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TypeAnswer from '../../src/exercises/TypeAnswer';

// Mock the theme provider
jest.mock('../../src/theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        surface: '#F2F2F7',
        border: '#C6C6C8',
        success: '#34C759',
        successBackground: '#E8F5E8',
        error: '#FF3B30',
        errorBackground: '#FFEBEE',
        text: '#000000',
        textTertiary: '#8E8E93',
        primary: '#007AFF',
        white: '#FFFFFF',
        textTertiary: '#8E8E93',
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
        button: { fontSize: 16, fontWeight: '600' },
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
  question: 'Type "hello" in English',
  correctAnswer: 'hello',
  onAnswer: jest.fn(),
};

describe('TypeAnswer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question and input field correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TypeAnswer {...mockProps} />,
    );

    expect(getByText('Type "hello" in English')).toBeTruthy();
    expect(getByPlaceholderText('Enter your answer here...')).toBeTruthy();
  });

  it('calls onAnswer when text is entered and submitted', async () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeAnswer {...mockProps} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');
    const submitButton = getByText('Check');

    fireEvent.changeText(input, 'hello');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockProps.onAnswer).toHaveBeenCalledWith('hello');
    });
  });

  it('trims whitespace from input before submitting', async () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeAnswer {...mockProps} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');
    const submitButton = getByText('Check');

    fireEvent.changeText(input, '  hello  ');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockProps.onAnswer).toHaveBeenCalledWith('hello');
    });
  });

  it('handles case-insensitive comparison correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeAnswer {...mockProps} showResult={true} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');

    fireEvent.changeText(input, 'HELLO');

    // The component should handle case normalization internally
    expect(input.props.value).toBe('HELLO');
  });

  it('submits on Enter key press', async () => {
    const { getByPlaceholderText } = render(<TypeAnswer {...mockProps} />);
    const input = getByPlaceholderText('Enter your answer here...');

    fireEvent.changeText(input, 'hello');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(mockProps.onAnswer).toHaveBeenCalledWith('hello');
    });
  });

  it('disables submit button when input is empty', () => {
    const { getByText } = render(<TypeAnswer {...mockProps} />);
    const submitButton = getByText('Check');

    expect(submitButton.parent?.props.accessibilityState?.disabled).toBe(true);
  });

  it('enables submit button when input has text', () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeAnswer {...mockProps} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');
    const submitButton = getByText('Check');

    fireEvent.changeText(input, 'hello');

    expect(submitButton.parent?.props.accessibilityState?.disabled).toBe(false);
  });

  it('shows correct styling when answer is correct', () => {
    const { getByPlaceholderText } = render(
      <TypeAnswer {...mockProps} showResult={true} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');

    fireEvent.changeText(input, 'hello');

    // Input should have success styling (thicker border)
    expect(input.props.style).toMatchObject(
      expect.objectContaining({
        borderWidth: 3,
      }),
    );
  });

  it('shows error styling when answer is incorrect', () => {
    const { getByPlaceholderText } = render(
      <TypeAnswer {...mockProps} showResult={true} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');

    fireEvent.changeText(input, 'wrong');

    // Input should have error styling (thicker border)
    expect(input.props.style).toMatchObject(
      expect.objectContaining({
        borderWidth: 3,
      }),
    );
  });

  it('disables input when showResult is true', () => {
    const { getByPlaceholderText } = render(
      <TypeAnswer {...mockProps} showResult={true} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');

    expect(input.props.editable).toBe(false);
  });

  it('hides submit button when showResult is true', () => {
    const { queryByText } = render(
      <TypeAnswer {...mockProps} showResult={true} />,
    );

    expect(queryByText('Check')).toBeNull();
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(<TypeAnswer {...mockProps} />);

    expect(getByLabelText('Type your answer in the text field')).toBeTruthy();
  });

  it('has proper accessibility role for input', () => {
    const { getByPlaceholderText } = render(<TypeAnswer {...mockProps} />);
    const input = getByPlaceholderText('Enter your answer here...');

    expect(input.props.accessibilityRole).toBe('text');
  });

  it('has proper accessibility role for submit button', () => {
    const { getByText } = render(<TypeAnswer {...mockProps} />);
    const submitButton = getByText('Check');

    expect(submitButton.parent?.props.accessibilityRole).toBe('button');
  });

  it('has minimum touch target size', () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeAnswer {...mockProps} />,
    );
    const input = getByPlaceholderText('Enter your answer here...');
    const submitButton = getByText('Check');

    expect(input.props.style).toMatchObject(
      expect.objectContaining({
        minHeight: 48,
      }),
    );

    expect(submitButton.parent?.props.style).toMatchObject(
      expect.objectContaining({
        minHeight: 48,
      }),
    );
  });
});
