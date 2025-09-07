import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface TypeAnswerProps {
  question: string;
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  placeholder?: string;
}

const TypeAnswer: React.FC<TypeAnswerProps> = ({
  question,
  correctAnswer,
  onAnswer,
  showResult = false,
  placeholder,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Focus input when component mounts
  useEffect(() => {
    if (!showResult) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showResult]);

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
    }
  };

  const handleSubmitEditing = () => {
    handleSubmit();
  };

  const isCorrect =
    showResult && answer.trim().toLowerCase() === correctAnswer.toLowerCase();

  const getInputStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 2,
    };

    if (!showResult) {
      return baseStyle;
    }

    return {
      ...baseStyle,
      backgroundColor: isCorrect
        ? theme.colors.successBackground
        : theme.colors.errorBackground,
      borderColor: isCorrect ? theme.colors.success : theme.colors.error,
      borderWidth: 3, // Thicker border for result state
    };
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
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    input: {
      ...theme.typography.body,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      textAlign: 'center',
      minHeight: 48, // Minimum touch target size
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignSelf: 'center',
      minHeight: 48, // Minimum touch target size
      ...theme.shadows.sm,
    },
    submitButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.instruction}>
        {t('exercises.typeAnswer.typeAnswer')}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, getInputStyle()]}
          value={answer}
          onChangeText={setAnswer}
          placeholder={placeholder || t('exercises.typeAnswer.placeholder')}
          placeholderTextColor={theme.colors.textTertiary}
          editable={!showResult}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmitEditing}
          accessibilityLabel={t('a11y.typeAnswer')}
          accessibilityHint={t('exercises.typeAnswer.placeholder')}
          accessibilityRole="text"
        />
      </View>

      {!showResult && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            !answer.trim() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!answer.trim()}
          accessibilityLabel={t('a11y.submitAnswer')}
          accessibilityRole="button"
          accessibilityState={{ disabled: !answer.trim() }}
        >
          <Text style={styles.submitButtonText}>
            {t('exercisePlayer.check')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TypeAnswer;
