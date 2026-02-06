import React, { useEffect } from 'react';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlaceSelectorScreen from "./screens/PlaceSelector";
import SignInScreen from "./screens/SignIn";
import SignUpScreen from "./screens/SignUp";
import ReviewsUnauthScreen from "./screens/ReviewsUnauth";
import HomeScreen from "./screens/Home";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen
          name="PlaceSelector"
          component={PlaceSelectorScreen}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
        />
        <Stack.Screen
          name="ReviewsUnauth"
          component={ReviewsUnauthScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
