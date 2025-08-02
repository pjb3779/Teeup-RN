import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/main/Community/CommunityScreen';
import SearchScreen from '../screens/main/Community/SearchScreen';
import OtherProfileScreen from '../screens/main/Community/OtherProfileScreen';
import NewPostScreen from '../screens/main/Community/NewPostScreen';
import PostDetailScreen from '../screens/main/Community/PostDetailScreen';

const Stack =  createNativeStackNavigator();

export default function CommunityStackNavigator(){
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="CommunityScreen"component={CommunityScreen}/>
            <Stack.Screen name="Search" component={SearchScreen}/>
            <Stack.Screen name="OtherProfileScreen" component={OtherProfileScreen}/>
            <Stack.Screen name="NewPostScreen" component={NewPostScreen}/>
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
        </Stack.Navigator>
    )
}