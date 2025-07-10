import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'; 
import { fetchBuddyRecommendations } from '../../../services/matchService'; // 추천 API 함수
import { fetchNearestLocation } from '../../../services/locationService'; // 추가: 위치 API 함수
import useUserStore from '../../../store/userStore';
import useLocationManager from './useLocationManager';
import BuddyList from './BuddyList';

export default function HomeScreen() {
  const { user } = useUserStore();

  const { location, loading: locationLoading } = useLocationManager(user.loginId);
  const { buddies, loading: buddiesLoading } = fetchBuddyRecommendations(user.loginId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 현재 위치</Text>
      <LocationView location={location} loading={locationLoading} />

      <Text style={styles.title}>🧑‍🤝‍🧑 추천 버디</Text>
      <BuddyList buddies={buddies} loading={buddiesLoading} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>전체 버디 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});