// Safe wrapper for AsyncStorage to handle linking issues
let AsyncStorage: any = null;

// Try to import AsyncStorage safely
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('AsyncStorage import failed:', error);
  AsyncStorage = null;
}

// Check if AsyncStorage is available
const isAsyncStorageAvailable = () => {
  try {
    return AsyncStorage && typeof AsyncStorage.getItem === 'function';
  } catch (error) {
    console.warn('AsyncStorage not available:', error);
    return false;
  }
};

// Safe AsyncStorage wrapper
export const safeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (!isAsyncStorageAvailable()) {
      console.warn('AsyncStorage not available, returning null for key:', key);
      return null;
    }

    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (!isAsyncStorageAvailable()) {
      console.warn(
        'AsyncStorage not available, skipping setItem for key:',
        key,
      );
      return;
    }

    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    if (!isAsyncStorageAvailable()) {
      console.warn(
        'AsyncStorage not available, skipping removeItem for key:',
        key,
      );
      return;
    }

    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  },

  clear: async (): Promise<void> => {
    if (!isAsyncStorageAvailable()) {
      console.warn('AsyncStorage not available, skipping clear');
      return;
    }

    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },
};
