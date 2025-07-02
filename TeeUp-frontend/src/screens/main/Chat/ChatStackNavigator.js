import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Chatting from './Chatting';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chatting" component={Chatting} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
