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

interface Pair {
  left: string;
  right: string;
}

interface MatchPairsProps {
  question: string;
  pairs: Pair[];
  onAnswer: (matches: { [key: string]: string }) => void;
  showResult?: boolean;
}

const MatchPairs: React.FC<MatchPairsProps> = ({
  question,
  pairs,
  onAnswer,
  showResult = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Shuffle left and right words independently
  const [shuffledLeftWords] = useState(() => {
    const leftWords = pairs.map(pair => pair.left);
    const shuffled = [...leftWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const [shuffledRightWords] = useState(() => {
    const rightWords = pairs.map(pair => pair.right);
    const shuffled = [...rightWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const handleLeftSelect = (leftItem: string) => {
    if (showResult) return;

    if (selectedLeft === leftItem) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftItem);
    }
  };

  const handleRightSelect = (rightItem: string) => {
    if (showResult || !selectedLeft) return;

    const newMatches = { ...matches, [selectedLeft]: rightItem };
    setMatches(newMatches);
    setSelectedLeft(null);

    // Check if all pairs are matched (regardless of correctness)
    const allPairsMatched = pairs.every(
      pair => newMatches[pair.left] !== undefined,
    );

    // Debug logging
    if (__DEV__) {
      console.log('🔍 MatchPairs Debug:');
      console.log('Original pairs:', pairs);
      console.log('User matches:', newMatches);
      console.log('All pairs matched:', allPairsMatched);
      pairs.forEach(pair => {
        const userMatch = newMatches[pair.left];
        const isCorrect = userMatch === pair.right;
        console.log(
          `${pair.left} -> ${userMatch} (correct: ${pair.right}) = ${isCorrect}`,
        );
      });
    }

    // Call onAnswer when all pairs are matched (regardless of correctness)
    if (allPairsMatched) {
      onAnswer(newMatches);
    }
  };

  const getLeftItemStyle = (leftItem: string) => {
    if (!showResult) {
      const isMatched = matches[leftItem];
      const userMatch = matches[leftItem];
      const correctMatch = pairs.find(pair => pair.left === leftItem)?.right;
      const isCorrectMatch = userMatch === correctMatch;

      return {
        backgroundColor:
          selectedLeft === leftItem
            ? theme.colors.primary
            : isMatched
            ? isCorrectMatch
              ? theme.colors.successBackground
              : theme.colors.errorBackground
            : theme.colors.surface,
        borderColor:
          selectedLeft === leftItem
            ? theme.colors.primary
            : isMatched
            ? isCorrectMatch
              ? theme.colors.success
              : theme.colors.error
            : theme.colors.border,
        borderWidth: isMatched ? 3 : 2,
      };
    }

    const correctMatch = pairs.find(pair => pair.left === leftItem)?.right;
    const userMatch = matches[leftItem];

    if (userMatch === correctMatch) {
      return {
        backgroundColor: theme.colors.successBackground,
        borderColor: theme.colors.success,
      };
    }

    if (userMatch && userMatch !== correctMatch) {
      return {
        backgroundColor: theme.colors.errorBackground,
        borderColor: theme.colors.error,
      };
    }

    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    };
  };

  const getRightItemStyle = (rightItem: string) => {
    if (!showResult) {
      const isMatched = Object.values(matches).includes(rightItem);
      const userLeft = Object.keys(matches).find(
        key => matches[key] === rightItem,
      );
      const correctLeft = pairs.find(pair => pair.right === rightItem)?.left;
      const isCorrectMatch = userLeft === correctLeft;

      return {
        backgroundColor: isMatched
          ? isCorrectMatch
            ? theme.colors.successBackground
            : theme.colors.errorBackground
          : theme.colors.surface,
        borderColor: isMatched
          ? isCorrectMatch
            ? theme.colors.success
            : theme.colors.error
          : theme.colors.border,
        borderWidth: isMatched ? 3 : 2,
      };
    }

    const correctLeft = pairs.find(pair => pair.right === rightItem)?.left;
    const userLeft = Object.keys(matches).find(
      key => matches[key] === rightItem,
    );

    if (userLeft === correctLeft) {
      return {
        backgroundColor: theme.colors.successBackground,
        borderColor: theme.colors.success,
      };
    }

    if (userLeft && userLeft !== correctLeft) {
      return {
        backgroundColor: theme.colors.errorBackground,
        borderColor: theme.colors.error,
      };
    }

    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    };
  };

  const getTextColor = (item: string, isLeft: boolean) => {
    if (!showResult) {
      if (isLeft && selectedLeft === item) {
        return theme.colors.white;
      }
      if (isLeft && matches[item]) {
        const correctMatch = pairs.find(pair => pair.left === item)?.right;
        const isCorrectMatch = matches[item] === correctMatch;
        return isCorrectMatch ? theme.colors.success : theme.colors.error;
      }
      if (!isLeft && Object.values(matches).includes(item)) {
        const userLeft = Object.keys(matches).find(
          key => matches[key] === item,
        );
        const correctLeft = pairs.find(pair => pair.right === item)?.left;
        const isCorrectMatch = userLeft === correctLeft;
        return isCorrectMatch ? theme.colors.success : theme.colors.error;
      }
      return theme.colors.text;
    }

    if (isLeft) {
      const correctMatch = pairs.find(pair => pair.left === item)?.right;
      const userMatch = matches[item];

      if (userMatch === correctMatch) {
        return theme.colors.success;
      }
      if (userMatch && userMatch !== correctMatch) {
        return theme.colors.error;
      }
    } else {
      const correctLeft = pairs.find(pair => pair.right === item)?.left;
      const userLeft = Object.keys(matches).find(key => matches[key] === item);

      if (userLeft === correctLeft) {
        return theme.colors.success;
      }
      if (userLeft && userLeft !== correctLeft) {
        return theme.colors.error;
      }
    }

    return theme.colors.text;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    question: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    instruction: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    wordsContainer: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.lg,
    },
    leftColumn: {
      flex: 1,
      gap: theme.spacing.md,
    },
    rightColumn: {
      flex: 1,
      gap: theme.spacing.md,
    },
    item: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      ...theme.shadows.sm,
    },
    itemText: {
      ...theme.typography.body,
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    progressText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
  });

  // Calculate progress
  const matchedCount = Object.keys(matches).length;
  const totalPairs = pairs.length;
  const progressText = `${matchedCount}/${totalPairs} ${t(
    'exercises.matchPairs.pairsMatched',
  )}`;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.instruction}>
        {t('exercises.matchPairs.dragToMatch')}
      </Text>
      <Text style={styles.progressText}>{progressText}</Text>

      <View style={styles.wordsContainer}>
        <View style={styles.leftColumn}>
          {shuffledLeftWords.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, getLeftItemStyle(word)]}
              onPress={() => handleLeftSelect(word)}
              disabled={showResult}
            >
              <Text
                style={[styles.itemText, { color: getTextColor(word, true) }]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rightColumn}>
          {shuffledRightWords.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, getRightItemStyle(word)]}
              onPress={() => handleRightSelect(word)}
              disabled={showResult || !selectedLeft}
            >
              <Text
                style={[styles.itemText, { color: getTextColor(word, false) }]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MatchPairs;
