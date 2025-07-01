import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/main/Community/CommunityScreen';
import SearchScreen from '../screens/main/Community/SearchScreen';

const Stack =  createNativeStackNavigator();

export default function CommunityStackNavigator(){
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="CommunityScreen"component={CommunityScreen}/>
            <Stack.Screen name="Search" component={SearchScreen}/>
        </Stack.Navigator>
    )
}