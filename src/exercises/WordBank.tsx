import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface WordBankProps {
  question: string;
  words: string[];
  correctAnswer: string;
  onAnswer: (selectedWord: string) => void;
  showResult?: boolean;
}

const WordBank: React.FC<WordBankProps> = ({
  question,
  words,
  correctAnswer,
  onAnswer,
  showResult = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordSelect = (word: string) => {
    if (!showResult) {
      setSelectedWord(word);
      onAnswer(word);
    }
  };

  const getWordStyle = (word: string) => {
    const baseStyle = {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.border,
      borderWidth: 2,
      minWidth: 80,
      minHeight: 48,
    };

    if (!showResult) {
      if (selectedWord === word) {
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          borderWidth: 3,
        };
      }
      return baseStyle;
    }

    if (word === correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.successBackground,
        borderColor: theme.colors.success,
        borderWidth: 3,
      };
    }

    if (selectedWord === word && word !== correctAnswer) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.errorBackground,
        borderColor: theme.colors.error,
        borderWidth: 3,
      };
    }

    return baseStyle;
  };

  const getTextColor = (word: string) => {
    if (!showResult) {
      return selectedWord === word ? theme.colors.white : theme.colors.black;
    }

    if (word === correctAnswer) {
      return theme.colors.success;
    }

    if (selectedWord === word && word !== correctAnswer) {
      return theme.colors.error;
    }

    return theme.colors.black;
  };

  const getAccessibilityLabel = (word: string) => {
    if (!showResult) {
      return selectedWord === word
        ? t('a11y.wordSelected', { word })
        : t('a11y.selectWord', { word });
    }

    if (word === correctAnswer) {
      return t('a11y.correctAnswer', { answer: word });
    }

    if (selectedWord === word && word !== correctAnswer) {
      return t('a11y.incorrectAnswer', { answer: word });
    }

    return word;
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
    wordsContainer: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    word: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.md,
      minHeight: 48,
      minWidth: 80,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wordText: {
      ...theme.typography.body,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    indicator: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
      marginLeft: I18nManager.isRTL ? 0 : theme.spacing.sm,
      marginRight: I18nManager.isRTL ? theme.spacing.sm : 0,
    },
    dropZone: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    dropZoneText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    selectedWord: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.instruction}>
        {t('exercises.wordBank.dragWords')}
      </Text>

      <View style={styles.dropZone}>
        <Text style={styles.dropZoneText}>
          {t('exercises.wordBank.dropZone')}
        </Text>
        {selectedWord && (
          <Text style={styles.selectedWord}>{selectedWord}</Text>
        )}
      </View>

      <View style={styles.wordsContainer}>
        {words.map((word, index) => {
          const getIndicator = () => {
            if (!showResult) {
              return selectedWord === word ? '✓' : '';
            }
            if (word === correctAnswer) {
              return '✓';
            }
            if (selectedWord === word && word !== correctAnswer) {
              return '✗';
            }
            return '';
          };

          return (
            <TouchableOpacity
              key={index}
              style={[styles.word, getWordStyle(word)]}
              onPress={() => handleWordSelect(word)}
              disabled={showResult}
              accessibilityLabel={getAccessibilityLabel(word)}
              accessibilityRole="button"
              accessibilityState={{
                selected: selectedWord === word,
              }}
            >
              <Text style={[styles.wordText, { color: getTextColor(word) }]}>
                {word}
              </Text>
              {getIndicator() && (
                <Text style={[styles.indicator, { color: getTextColor(word) }]}>
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

export default WordBank;
