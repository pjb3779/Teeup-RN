import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../../api';

export default function Profile() {
  const [loginId, setLoginId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // 1) AsyncStorage에서 loginId 불러오기
  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem('loginId');
        setLoginId(storedId);
      } catch (e) {
        console.warn('loginId 불러오기 실패:', e);
      }
    })();
  }, []);

  // 2) loginId가 준비되면 프로필 + 팔로우 카운트 동시 조회
  useFocusEffect(
    React.useCallback(() => {
      if (!loginId) return;

      const loadAll = async () => {
        setLoading(true);
        try {
          // 2-1) 프로필 조회
          const profRes = await api.get(
            '/api/profile',
            { headers: { loginId } }
          );
          setProfile(profRes.data);

          // 2-2) 팔로워 목록 조회 → 배열 길이
          const follRes = await api.get(
            `/api/follows/followers/${loginId}`,
            { headers: { loginId } }
          );
          const follData = follRes.data;
          setFollowersCount(Array.isArray(follData) ? follData.length : 0);

          // 2-3) 팔로잉 목록 조회 → 배열 길이
          const flwRes = await api.get(
            `/api/follows/followees/${loginId}`,
            { headers: { loginId } }
          );
          const flwData = flwRes.data;
          setFollowingCount(Array.isArray(flwData) ? flwData.length : 0);

          setError('');
        } catch (err) {
          setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };

      loadAll();
    }, [loginId])
  );

  // 3) 로딩 타임아웃 처리
  useEffect(() => {
    const to = setTimeout(() => {
      if (loading) {
        setError('정보 불러오기 실패');
        setLoading(false);
      }
    }, 3000);
    return () => clearTimeout(to);
  }, [loading]);

  // 4) 로딩 / 에러 화면
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

  // 5) 편집 버튼 핸들러
  const handleSettingScrenen = () => {
    navigation.navigate('SettingScreen', { profile });
  };

  const handleOpenFollowers = () => {
    navigation.navigate('FollowerListScreen', { loginId });
  };

  const handleOpenFollowing = () => {
    navigation.navigate('FollowingListScreen', { loginId });
  };


  // ★ 별점은 아직 API 미구현 → mock
  const stars = 4.5;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettingScrenen} style={styles.settingButton}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
          <View style={styles.nameStars}>
            <Text style={styles.nickname}>{profile.nickname || 'None'}</Text>
            <View style={styles.starsContainer}>{renderStars(stars)}</View>
          </View>
        </View>

        <View style={styles.followContainer}>
          <TouchableOpacity style={styles.followItem} onPress={() => handleOpenFollowers()}>
            <Text style={styles.followNumber}>{followersCount}</Text>
            <Text style={styles.followLabel}>followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followItem} onPress={() => handleOpenFollowing()}>
            <Text style={styles.followNumber}>{followingCount}</Text>
            <Text style={styles.followLabel}>following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabs}>
        <Text style={[styles.tabItem, styles.tabItemActive]}>Posts</Text>
        <Text style={styles.tabItem}>Replies</Text>
      </View>

    </View>
  );
}

/** 별점 렌더링 */
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const starsArray = [];
  for (let i = 0; i < fullStars; i++) {
    starsArray.push(<Icon key={i} name="star" size={18} color="#FFD700" />);
  }
  if (halfStar) {
    starsArray.push(<Icon key="half" name="star-half" size={18} color="#FFD700" />);
  }
  return starsArray;
}

/** 개별 Post 컴포넌트 */
function Post({ user, text, time }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: user.avatar }} style={styles.postAvatar} />
        <View style={styles.postHeaderText}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.postUsername}>{user.name}</Text>
            {user.verified && (
              <Icon name="verified" size={14} color="#4a90e2" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.postTime}>{time}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="more-horiz" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.postText}>{text}</Text>
      <View style={styles.postActions}>
        <Icon name="favorite-border" size={20} color="#333" style={styles.postActionIcon} />
        <Icon name="chat-bubble-outline" size={20} color="#333" style={styles.postActionIcon} />
        <Icon name="repeat" size={20} color="#333" style={styles.postActionIcon} />
        <Icon name="send" size={20} color="#333" style={styles.postActionIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#17702E',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingButton: { position: 'absolute', top: 50, right: 20 },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    avatar: {
      width: 158,
      height: 158,
      borderRadius: 158,
      borderWidth: 4,
      borderColor: '#FCFBF7',
      backgroundColor: 'lightgray', // 배경색
      shadowColor: '#656565',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 5,
    },

  nameStars: { marginLeft: 15 },
  nickname: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  starsContainer: { flexDirection: 'row', marginTop: 4 },
  followContainer: { flexDirection: 'row', marginTop: 15 },
  followItem: { marginRight: 20 },
  followNumber: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  followLabel: { color: '#fff', fontSize: 12 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabItem: { fontSize: 16, color: '#666' },
  tabItemActive: { fontWeight: 'bold', color: '#000' },
  postsContainer: { padding: 10 },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postHeaderText: { flex: 1 },
  postUsername: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  postTime: { fontSize: 12, color: '#888' },
  postText: { fontSize: 14, color: '#333', marginBottom: 8 },
  postActions: { flexDirection: 'row' },
  postActionIcon: { marginRight: 20 },
  error: { color: '#e74c3c', fontSize: 16, textAlign: 'center', padding: 20 },
});
