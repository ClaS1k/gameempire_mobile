import React, { useEffect } from 'react';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlaceSelectorScreen from "./screens/PlaceSelector";
import SignInScreen from "./screens/SignIn";
import SignUpScreen from "./screens/SignUp";
import ReviewsUnauthScreen from "./screens/ReviewsUnauth";
import HomeScreen from "./screens/Home";
import NewsScreen from "./screens/News";
import NewsViewerScreen from "./screens/NewsViewer";
import ProfileScreen from "./screens/Profile";
import QrScreen from "./screens/Qr";
import ReservationsScreen from "./screens/Reservations";
import ReviewsAuthScreen from "./screens/ReviewsAuth";
import TopUpScreen from "./screens/TopUp";
import SettingsScreen from "./screens/Settings";

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
        <Stack.Screen
          name="News"
          component={NewsScreen}
        />
        <Stack.Screen
          name="NewsViewer"
          component={NewsViewerScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="Qr"
          component={QrScreen}
        />
        <Stack.Screen
          name="Reservations"
          component={ReservationsScreen}
        />
        <Stack.Screen
          name="ReviewsAuth"
          component={ReviewsAuthScreen}
        />
        <Stack.Screen
          name="TopUp"
          component={TopUpScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
