import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}