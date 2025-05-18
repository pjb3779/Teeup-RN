//MainTabbar.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './screens/main/HomeScreen';
import Chat from './screens/main/ChatScreen';
import Reservation from './screens/main/ReservationScreen';
import Profile from './screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabbar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
      headerShown: false,
        
      // 1) 아이콘 위에 라벨을 배치
      tabBarLabelPosition: 'below-icon',

            // 2) 탭바 전체 높이
            tabBarStyle: {
              height: 100,
            },

            // 3) 아이콘·라벨 색상
            tabBarActiveTintColor: '#004225FF',
            tabBarInactiveTintColor: '#888',

            // 4) 탭 아이템(아이콘+라벨) 
            tabBarItemStyle: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 15,
            },

            // 5) 라벨 스타일
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: 0,
              marginBottom: 3,
            },

            // 6) 아이콘 렌더링
            tabBarIcon: ({ color }) => {
              let name = '';
              if (route.name === 'Home')       name = 'home';
              else if (route.name === 'Chat')  name = 'chatbubble';
              else if (route.name === 'Reservation') name = 'calendar';
              else if (route.name === 'Profile')     name = 'person';

              return <Ionicons name={name} size={23} color={color} />;
            },
          })} 
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Chat" component={Chat} />
          <Tab.Screen name="Reservation" component={Reservation} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
  );
}
