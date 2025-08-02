import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/main/Profile/ProfileScreen';
import EditProfileScreen from '../screens/main/Profile/EditProfileScreen';
import FollowerListScreen from '../screens/main/Profile/FollowerListScreen';
import FollowingListScreen from '../screens/main/Profile/FollowingListScreen';
import SettingScreen from '../screens/main/Profile/SettingScreen';
import PostDetailScreen from '../screens/main/Community/PostDetailScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="FollowerListScreen" component={FollowerListScreen} />
            <Stack.Screen name="FollowingListScreen" component={FollowingListScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
        </Stack.Navigator>
    );
}
