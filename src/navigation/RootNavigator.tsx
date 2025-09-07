import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

import LessonStart from '../screens/LessonStart';
import ExercisePlayer from '../screens/ExercisePlayer';
import Completion from '../screens/Completion';
import NavigationHandler from '../components/NavigationHandler';

export type RootStackParamList = {
  LessonStart: undefined;
  ExercisePlayer: { exerciseId?: string };
  Completion: { score?: number; streak?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LessonStart"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="LessonStart"
          component={LessonStart}
          options={{
            title: 'Lesson Start',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ExercisePlayer"
          component={ExercisePlayer}
          options={{
            title: 'Exercise',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Completion"
          component={Completion}
          options={{
            title: 'Completion',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
      <NavigationHandler />
    </NavigationContainer>
  );
};

export default RootNavigator;
