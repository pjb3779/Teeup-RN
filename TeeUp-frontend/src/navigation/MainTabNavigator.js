import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import ChatStackNavigator  from '../screens/main/Chat/ChatStackNavigator';
import CommunityStackNavigator from './CommunityStackNavigator'; 
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Community" component={CommunityStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}