import { lightTheme } from './light';
import { darkTheme } from './dark';

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export { lightTheme, darkTheme };
