// Test utility to verify persistence functionality
import { safeAsyncStorage } from './asyncStorageWrapper';

export const testPersistence = async () => {
  console.log('🧪 Testing persistence functionality...');

  try {
    // Test AsyncStorage
    const testKey = 'test-persistence';
    const testValue = { test: 'data', timestamp: Date.now() };

    await safeAsyncStorage.setItem(testKey, JSON.stringify(testValue));
    console.log('✅ AsyncStorage setItem successful');

    const retrieved = await safeAsyncStorage.getItem(testKey);
    const parsed = retrieved ? JSON.parse(retrieved) : null;
    console.log('✅ AsyncStorage getItem successful:', parsed);

    await safeAsyncStorage.removeItem(testKey);
    console.log('✅ AsyncStorage removeItem successful');

    // Test lesson store persistence
    const lessonStoreKey = 'lesson-store';
    const lessonStoreData = await safeAsyncStorage.getItem(lessonStoreKey);
    console.log(
      '📦 Current lesson store data:',
      lessonStoreData ? 'exists' : 'empty',
    );

    return true;
  } catch (error) {
    console.error('❌ Persistence test failed:', error);
    return false;
  }
};

export const clearAllPersistence = async () => {
  console.log('🧹 Clearing all persistence data...');

  try {
    await safeAsyncStorage.clear();
    console.log('✅ All persistence data cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear persistence data:', error);
    return false;
  }
};
