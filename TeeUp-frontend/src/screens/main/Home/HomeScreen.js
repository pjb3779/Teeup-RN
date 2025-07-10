import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useUserStore from '../../../store/userStore';
import useLocationManager from '../../../hooks/useLocationManager';
import useBuddyRecommendations from '../../../hooks/useBuddyRecommendations';
import Header from './Header';
import LocationView from './LocationView';
import SearchView from './SearchView';
import BuddyList from './BuddyList';

export default function HomeScreen() {
  const { user } = useUserStore();
  const { location, loading: locationLoading } = useLocationManager(user.loginId);
  const { buddies, loading: buddiesLoading } = useBuddyRecommendations(user.loginId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.sectionSpacing} />

      <LocationView location={location} loading={locationLoading} />
      <View style={styles.sectionSpacingLocation} />

      <SearchView />
      <View style={styles.sectionSpacingSearch} />

      <Text style={styles.Buddytext}>Recommended Buddy</Text>
      <View style={styles.sectionSpacingBuddyList} />

      <BuddyList buddies={buddies} loading={buddiesLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  sectionSpacing: {
    height: 10,
  },
  sectionSpacingLocation: {
    height: 5,
  },
  sectionSpacingSearch: {
    height: 9,
  },
  sectionSpacingBuddyList: {
    height: 0,
  },
  Buddytext: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    color: '#201913',
  },
  button: {
    marginTop: 39,
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
