export const lightTheme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',
    secondary: '#34C759',
    secondaryDark: '#28A745',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    surfaceVariant: '#E5E5EA',
    text: '#000000',
    textSecondary: '#3C3C43', // Improved contrast from #6D6D70
    textTertiary: '#6D6D70',
    border: '#C6C6C8',
    borderLight: '#E5E5EA',
    error: '#D70015', // Improved contrast from #FF3B30
    errorBackground: '#FFEBEE',
    success: '#248A3D', // Improved contrast from #34C759
    successBackground: '#E8F5E8',
    warning: '#B95000', // Improved contrast from #FF9500
    warningBackground: '#FFF3E0',
    info: '#007AFF',
    infoBackground: '#E3F2FD',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    // Accessibility indicators
    focus: '#007AFF',
    focusRing: '#007AFF',
    selected: '#007AFF',
    selectedBackground: '#E3F2FD',
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
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
