import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { changeLanguage } from '../i18n';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    settingLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    languageButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginLeft: theme.spacing.sm,
    },
    languageButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    languageButtonText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
    },
    languageButtonTextActive: {
      color: theme.colors.white,
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {isDark ? t('settings.darkTheme') : t('settings.lightTheme')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.surfaceVariant,
                true: theme.colors.primary,
              }}
              thumbColor={isDark ? theme.colors.white : theme.colors.primary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t('settings.language')}</Text>
            <View style={styles.languageContainer}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  i18n.language === 'en' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    i18n.language === 'en' && styles.languageButtonTextActive,
                  ]}
                >
                  {t('settings.english')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageButton,
                  i18n.language === 'ar' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('ar')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    i18n.language === 'ar' && styles.languageButtonTextActive,
                  ]}
                >
                  {t('settings.arabic')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
