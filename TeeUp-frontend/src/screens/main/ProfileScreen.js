import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getUserProfile } from '../../services/userService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_WIDTH * 0.45;
const AVATAR_SIZE = SCREEN_WIDTH * 0.38;
const AVATAR_TOP = HEADER_HEIGHT - AVATAR_SIZE / 2;
const STATS_LEFT = AVATAR_SIZE + 32;

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const latest = await getUserProfile();
      setProfile(latest);
    } catch (err) {
      setError(err.message || '프로필 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadProfile();
  }, [loadProfile]));

  useEffect(() => {
    const id = setInterval(loadProfile, 30000);
    return () => clearInterval(id);
  }, [loadProfile]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>프로필 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>프로필 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#1D7C3E" barStyle="light-content" />

      <View style={styles.container}>
        <View style={[styles.profileHeader, { height: HEADER_HEIGHT }]}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Icon name="settings" size={32} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <View
            style={[
              styles.avatar,
              {
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                top: AVATAR_TOP / 1.5,
              },
            ]}
          >
            {profile.avatar && (
              <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
            )}
          </View>

          <View style={[styles.statsWrapper, { left: STATS_LEFT }]}>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>100</Text>
              <Text style={styles.statsLabel}>followers</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>100</Text>
              <Text style={styles.statsLabel}>following</Text>
            </View>
          </View>
        </View>

        <View style={[styles.infoContainer , { marginTop: AVATAR_SIZE / 10}]}>
          <Text style={styles.name}>{profile.nickname}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <View style={styles.starContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <FontAwesomeIcon
                key={i}
                name="star"
                size={20}
                color="#FFD700"
                style={{ marginRight: 4 }}
              />
            ))}
            <FontAwesomeIcon name="star-half-empty" size={20} color="#FFD700" />
          </View>
        </View>

        <View style={styles.segmentContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('posts')}
            style={[styles.segment, selectedTab === 'posts' && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, selectedTab === 'posts' && styles.segmentTextActive]}>
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab('matching')}
            style={[styles.segment, selectedTab === 'matching' && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, selectedTab === 'matching' && styles.segmentTextActive]}>
              Matching record
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1D7C3E'
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  error: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    padding: 20
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#1D7C3E',
    width: '100%',
    position: 'relative',
    marginBottom: 40
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: '800',
    color: '#fff'
  },
  avatar: {
    position: 'absolute',
    left: 20,
    borderWidth: 4,
    borderColor: '#FCFBF7',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#656565',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'cover'
  },
  statsWrapper: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row'
  },
  statsBox: {
    alignItems: 'center',
    marginHorizontal: 24
  },
  statsNumber: {
    color: '#FCFBF7',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600'
  },
  statsLabel: {
    color: '#FCFBF7',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600'
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20
  },
  name: {
    color: '#000',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center'
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4
  },

  email: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 4
  },
  segmentContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 24
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  segmentActive: {
    backgroundColor: '#fff'
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0A0'
  },
  segmentTextActive: {
    color: '#1D7C3E'
  }
});
