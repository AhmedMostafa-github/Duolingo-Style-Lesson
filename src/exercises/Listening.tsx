import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import Video from 'react-native-video';

interface ListeningProps {
  question: string;
  audioUrl: string;
  correctAnswer: string;
  onAnswer: (text: string) => void;
  showResult?: boolean;
  tolerance?: number;
}

const Listening: React.FC<ListeningProps> = ({
  question,
  audioUrl,
  onAnswer,
  showResult = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current?.seek(0);
      setIsPlaying(false);
    } else {
      videoRef.current?.seek(0);
      setIsPlaying(true);
    }
  };

  const onPlaybackEnd = () => {
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      onAnswer(userAnswer.trim());
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
    },
    hiddenVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      opacity: 0,
    },
    question: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    instruction: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    audioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    playButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.round,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 120,
    },
    playButtonText: {
      color: theme.colors.white,
      ...theme.typography.body,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    input: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputFocused: {
      borderColor: theme.colors.primary,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.surface,
    },
    submitButtonText: {
      color: theme.colors.white,
      ...theme.typography.body,
      fontWeight: '600',
    },
    submitButtonTextDisabled: {
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.instruction}>
        {t('exercises.listening.instruction')}
      </Text>

      {/* Hidden video component for audio playback */}
      <Video
        ref={videoRef}
        source={require('../../hola.mp3')}
        style={styles.hiddenVideo}
        paused={!isPlaying}
        onEnd={onPlaybackEnd}
        audioOnly={true}
        repeat={false}
      />

      <View style={styles.audioContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
          disabled={showResult}
          accessibilityLabel={
            isPlaying
              ? t('exercises.listening.stopAudio')
              : t('exercises.listening.playAudio')
          }
          accessibilityRole="button"
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸️' : '▶️'}{' '}
            {isPlaying
              ? t('exercises.listening.stop')
              : t('exercises.listening.play')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, showResult && styles.inputFocused]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder={t('exercises.listening.placeholder')}
          placeholderTextColor={theme.colors.textSecondary}
          editable={!showResult}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t('exercises.listening.inputLabel')}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!userAnswer.trim() || showResult) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!userAnswer.trim() || showResult}
        accessibilityLabel={t('exercises.listening.submit')}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.submitButtonText,
            (!userAnswer.trim() || showResult) &&
              styles.submitButtonTextDisabled,
          ]}
        >
          {t('exercises.listening.submit')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Listening;
