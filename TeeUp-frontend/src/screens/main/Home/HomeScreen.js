import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.sectionSpacing} />

      <LocationView location={location} loading={locationLoading} />
      <View style={styles.sectionSpacingLocation} />

      <SearchView
        value={searchKeyword}
        onChange={setSearchKeyword}
        onResult={handleSearchResult}
      />
      <View style={styles.sectionSpacingSearch} />

      {searchResult === null ? (
        <>
          <Text style={styles.Buddytext}>Recommended Buddy</Text>
          <View style={styles.sectionSpacingBuddyList} />

          <BuddyList buddies={buddies} loading={buddiesLoading} />
        </>
      ) : (
        <>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setSearchResult(null)}>
              <Icon name="arrow-back" size={24} color="#201913" />
            </TouchableOpacity>
            <Text style={styles.searchHeaderText}>Search Results</Text>
          </View>
          {searchResult.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : (
            <BuddyList buddies={searchResult} loading={false} />
          )}
        </>
      )}
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchHeaderText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#201913',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
