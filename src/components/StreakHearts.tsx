import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface StreakHeartsProps {
  streak: number;
  maxStreak?: number;
  hearts?: number; // Game hearts/lives
  maxHearts?: number;
}

const StreakHearts: React.FC<StreakHeartsProps> = ({
  streak,
  maxStreak = 5,
  hearts,
  maxHearts = 3,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const renderStreakHearts = () => {
    const streakHearts = [];
    for (let i = 0; i < maxStreak; i++) {
      const isActive = i < streak;
      streakHearts.push(
        <Image
          key={i}
          source={
            isActive
              ? require('../../fire_filled.png')
              : require('../../fire.png')
          }
          style={styles.heart}
          resizeMode="contain"
        />,
      );
    }
    return streakHearts;
  };

  const renderGameHearts = () => {
    if (hearts === undefined) return null;

    const gameHearts = [];
    for (let i = 0; i < maxHearts; i++) {
      const isActive = i < hearts;
      gameHearts.push(
        <Image
          key={i}
          source={
            isActive ? require('../../filled.png') : require('../../heart.png')
          }
          style={styles.heart}
          resizeMode="contain"
        />,
      );
    }
    return gameHearts;
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    heartsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    heart: {
      width: 16,
      height: 16,
    },
    streakText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });

  const accessibilityLabel =
    hearts !== undefined
      ? t('a11y.heartsCounter', { hearts }) +
        ', ' +
        t('a11y.streakCounter', { streak })
      : t('a11y.streakCounter', { streak });

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {hearts !== undefined && (
        <>
          <Text style={styles.label}>
            {t('components.streakHearts.hearts')}
          </Text>
          <View style={styles.heartsContainer}>{renderGameHearts()}</View>
        </>
      )}
      <Text style={styles.label}>{t('components.streakHearts.streak')}</Text>
      <View style={styles.heartsContainer}>{renderStreakHearts()}</View>
      <Text style={styles.streakText}>{streak}</Text>
    </View>
  );
};

export default StreakHearts;
