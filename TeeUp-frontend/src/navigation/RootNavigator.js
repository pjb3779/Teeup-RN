import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen'; // 로그인, 회원가입 화면 포함
import LoginScreen from '../screens/auth/LoginScreen'; // 로그인 화면
import SignUpScreen from '../screens/auth/SignUpScreen'; // 회원가입 화면
import MainTabNavigator from './MainTabNavigator'; // 로그인 후 메인 화면
import EditProfileScreen from '../screens/main/EditProfileScreen';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isLoggedIn ? (
      <>
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </>
    ) : (
      <>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      </>
    )}
  </Stack.Navigator>
  );
}
