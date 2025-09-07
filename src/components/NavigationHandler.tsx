import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLessonStore } from '../state/lessonStore';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationHandlerNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const NavigationHandler: React.FC = () => {
  const navigation = useNavigation<NavigationHandlerNavigationProp>();
  const { shouldNavigateToPlayer, setShouldNavigateToPlayer } =
    useLessonStore();

  useEffect(() => {
    if (shouldNavigateToPlayer) {
      console.log('🔄 Navigating to ExercisePlayer (mid-lesson detected)');
      navigation.navigate('ExercisePlayer');
      // Reset the navigation flag
      setShouldNavigateToPlayer(false);
    }
  }, [shouldNavigateToPlayer, navigation, setShouldNavigateToPlayer]);

  // This component doesn't render anything
  return null;
};

export default NavigationHandler;
