import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityInfo,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface MCQProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (selectedIndex: number) => void;
  selectedAnswer?: number;
  showResult?: boolean;
}

const MCQ: React.FC<MCQProps> = ({
  question,
  options,
  correctAnswer,
  onAnswer,
  selectedAnswer,
  showResult = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getOptionStyle = (index: number) => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 2,
    };

    if (!showResult) {
      if (selectedAnswer === index) {
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          borderWidth: 3, // Thicker border for selected state
        };
      }
      return baseStyle;
    }

    if (index === correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.successBackground,
        borderColor: theme.colors.success,
        borderWidth: 3, // Thicker border for correct answer
      };
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.errorBackground,
        borderColor: theme.colors.error,
        borderWidth: 3, // Thicker border for incorrect answer
      };
    }

    return baseStyle;
  };

  const getTextColor = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? theme.colors.white : theme.colors.text;
    }

    if (index === correctAnswer) {
      return theme.colors.success;
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return theme.colors.error;
    }

    return theme.colors.text;
  };

  const getAccessibilityLabel = (index: number, option: string) => {
    const optionNumber = index + 1;

    if (!showResult) {
      return selectedAnswer === index
        ? t('a11y.optionSelected', { index: optionNumber, option })
        : t('a11y.selectOption', { index: optionNumber, option });
    }

    if (index === correctAnswer) {
      return t('a11y.correctAnswer', { answer: option });
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return t('a11y.incorrectAnswer', { answer: option });
    }

    return option;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    question: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    instruction: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    optionsContainer: {
      gap: theme.spacing.sm,
    },
    option: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionText: {
      ...theme.typography.body,
      textAlign: 'center',
      flex: 1,
    },
    indicator: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
      marginLeft: I18nManager.isRTL ? 0 : theme.spacing.sm,
      marginRight: I18nManager.isRTL ? theme.spacing.sm : 0,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.instruction}>{t('exercises.mcq.selectAnswer')}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const getIndicator = () => {
            if (!showResult) {
              return selectedAnswer === index ? '✓' : '';
            }
            if (index === correctAnswer) {
              return '✓';
            }
            if (selectedAnswer === index && index !== correctAnswer) {
              return '✗';
            }
            return '';
          };

          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, getOptionStyle(index)]}
              onPress={() => onAnswer(index)}
              disabled={showResult}
              accessibilityLabel={getAccessibilityLabel(index, option)}
              accessibilityRole="radio"
              accessibilityState={{
                selected: selectedAnswer === index,
                checked: selectedAnswer === index,
              }}
            >
              <Text style={[styles.optionText, { color: getTextColor(index) }]}>
                {option}
              </Text>
              {getIndicator() && (
                <Text
                  style={[styles.indicator, { color: getTextColor(index) }]}
                >
                  {getIndicator()}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MCQ;
