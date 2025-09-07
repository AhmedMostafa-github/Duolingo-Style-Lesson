import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface FeedbackBannerProps {
  type: 'correct' | 'incorrect' | 'hint';
  message: string;
  onDismiss?: () => void;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type,
  message,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getBannerStyle = () => {
    switch (type) {
      case 'correct':
        return {
          backgroundColor: theme.colors.successBackground,
          borderColor: theme.colors.success,
        };
      case 'incorrect':
        return {
          backgroundColor: theme.colors.errorBackground,
          borderColor: theme.colors.error,
        };
      case 'hint':
        return {
          backgroundColor: theme.colors.infoBackground,
          borderColor: theme.colors.info,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        };
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'correct':
        return theme.colors.success;
      case 'incorrect':
        return theme.colors.error;
      case 'hint':
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'correct':
        return t('components.feedbackBanner.correct');
      case 'incorrect':
        return t('components.feedbackBanner.incorrect');
      case 'hint':
        return t('components.feedbackBanner.hint');
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      marginVertical: theme.spacing.sm,
      ...getBannerStyle(),
    },
    title: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
      color: getTextColor(),
      marginBottom: theme.spacing.xs,
    },
    message: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default FeedbackBanner;
