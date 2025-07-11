import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import ChatStackNavigator from '../screens/main/Chat/ChatStackNavigator';
import CommunityStackNavigator from './CommunityStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: { height: 100 },
        tabBarActiveTintColor: '#1D7C3E',
        tabBarInactiveTintColor: '#888',
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          marginBottom: 3,
        },
        tabBarIcon: ({ color, size }) => {
          let name = '';
          if (route.name === 'Home') name = 'home';
          else if (route.name === 'Chat') name = 'chatbubble-outline';
          else if (route.name === 'Community') name = 'globe-outline';
          else if (route.name === 'Profile') name = 'person-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
      />    
      </Tab.Navigator>
  );
}
