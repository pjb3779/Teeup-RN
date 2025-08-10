import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../Chat/ChatScreen';
import RoomsListScreen from '../Chat/RoomsListScreen';

const Stack = createStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="RoomsListScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RoomsListScreen" component={RoomsListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
