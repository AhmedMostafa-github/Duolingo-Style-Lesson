export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    primaryDark: '#0056CC',
    secondary: '#30D158',
    secondaryDark: '#28A745',
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5', // Improved contrast from #8E8E93
    textTertiary: '#8E8E93',
    border: '#38383A',
    borderLight: '#2C2C2E',
    error: '#FF6961', // Improved contrast from #FF453A
    errorBackground: '#2D1B1B',
    success: '#30D158',
    successBackground: '#1B2D1B',
    warning: '#FFCC02', // Improved contrast from #FF9F0A
    warningBackground: '#2D241B',
    info: '#0A84FF',
    infoBackground: '#1B2A2D',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    // Accessibility indicators
    focus: '#0A84FF',
    focusRing: '#0A84FF',
    selected: '#0A84FF',
    selectedBackground: '#1B2A2D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
