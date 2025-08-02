import React, { useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../../api';

export default function Profile() {
  const [loginId, setLoginId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Posts');
  const [myPosts, setMyPosts]   = useState([]);  
  const [postsLoading, setPostsLoading] = useState(false);
  const navigation = useNavigation();
  const listRef = useRef(null);

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

  // 2) loginId 준비되면 프로필·팔로우 정보 동시에 조회
  useFocusEffect(
    React.useCallback(() => {
      if (!loginId) return;

      const loadAll = async () => {
        setLoading(true);
        try {
          // 프로필 조회
          const profRes = await api.get('/api/profile', {
            headers: { loginId },
          });
          setProfile(profRes.data);

          // 팔로워 수 조회
          const follRes = await api.get(
            `/api/follows/followers/${loginId}`,
            { headers: { loginId } }
          );
          setFollowersCount(
            Array.isArray(follRes.data) ? follRes.data.length : 0
          );

          // 팔로잉 수 조회
          const flwRes = await api.get(
            `/api/follows/followees/${loginId}`,
            { headers: { loginId } }
          );
          setFollowingCount(
            Array.isArray(flwRes.data) ? flwRes.data.length : 0
          );

          setError('');

          // 스크롤 최상단으로
          if (listRef.current) {
            listRef.current.scrollToOffset({ offset: 0, animated: true });
          }
        } catch (err) {
          setError(
            err.message || '데이터를 불러오는 중 오류가 발생했습니다.'
          );
        } finally {
          setLoading(false);
        }
      };

      loadAll();
    }, [loginId])
  );

  useEffect(() => {
    if (loginId) {
      fetchMyPosts();
    }
  }, [loginId]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    if(tab === 'Posts') fetchMyPosts();
  }

  const fetchMyPosts = async () => {
    if(!loginId) return;

    try{
      setPostsLoading(true);
      const resq = await api.get(`/api/post/list/${loginId}`,
        {headers: {loginId}}
      );
      
      setMyPosts(resq.data.data);
    }catch(e){
      console.warn('내 포스트 가져오기 실패', e);
    }finally {
      setPostsLoading(false);   // ← 빠져 있었습니다
    }
  }

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

  // 로딩 중일 때
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#17702E" />
      </View>
    );
  }

  // 에러 상태일 때
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
      {/* === Header === */}
      <View style={styles.header}>
        {/* 세팅 버튼 */}
        <TouchableOpacity
          style={styles.settingButton}
          onPress={handleSettingScrenen}
        >
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile 타이틀 */}
        <Text style={styles.title}>Profile</Text>

        {/* 프로필 정보 */}
        <View style={styles.profileHeader}>
          {/* 아바타 */}
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[styles.avatar, { backgroundColor: '#ccc' }]}
            />
          )}

          {/* 이름·별점·팔로우 */}
          <View style={styles.info}>
            <View style={styles.nameStars}>
              <View style={styles.starsContainer}>
                {renderStars(stars)}
              </View>
              <Text style={styles.nickname}>
                {profile?.nickname ?? 'None'}
              </Text>
            </View>
            <View style={styles.followContainer}>
              <TouchableOpacity
                onPress={handleOpenFollowers}
                style={styles.followItem}
              >
                <Text style={styles.followNumber}>
                  {followersCount}
                </Text>
                <Text style={styles.followLabel}>followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleOpenFollowing}
                style={styles.followItem}
              >
                <Text style={styles.followNumber}>
                  {followingCount}
                </Text>
                <Text style={styles.followLabel}>following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => changeTab('Posts')}>
          <Text
            style={[
              styles.tabItem,
              activeTab === 'Posts' && styles.tabItemActive,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeTab('Replies')}>
          <Text
            style={[
              styles.tabItem,
              activeTab === 'Replies' && styles.tabItemActive,
            ]}
          >
            Replies
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== 탭별 콘텐츠 ===== */}
      {activeTab === 'Posts' ? (
        postsLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {myPosts.length === 0 ? (
              <Text>작성한 글이 없습니다.</Text>
            ) : (
              myPosts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.postCard}
                  onPress={() => navigation.navigate('PostDetailScreen', { postId: p.id })}
                >
                  <Text style={styles.postTitle}>{p.title}</Text>
                  <Text style={styles.postSnippet} numberOfLines={2}>
                    {p.content}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )
      ) : (
        <View style={{ padding: 16 }}>
          <Text>Replies 탭은 준비 중…</Text>
        </View>
      )}
      
    </View>
  );
}

/** 별점 렌더링 */
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const starsArray = [];
  for (let i = 0; i < fullStars; i++) {
    starsArray.push(
      <Icon key={i} name="star" size={18} color="#FFD700" />
    );
  }
  if (halfStar) {
    starsArray.push(
      <Icon key="half" name="star-half" size={18} color="#FFD700" />
    );
  }
  return starsArray;
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;
const AVATAR_TOP = STATUS_BAR_HEIGHT + 50;
const screenWidth = Dimensions.get('window').width;
const AVATAR_SIZE = screenWidth * 0.45;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  errorText: { flex: 1, textAlign: 'center', marginTop: 50 },

  header: {
    backgroundColor: '#17702E',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 10,
    right: 20,
    zIndex: 10,
  },
  title: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: STATUS_BAR_HEIGHT + 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: '#FCFBF7',
  },
  info: {
    flex: 1,
    marginLeft: screenWidth * 0.1,
    alignItems: 'center',
  },
  nameStars: {
    flexDirection: 'column',
  },
  nickname: {
    fontSize: 27,
    fontWeight: '600',
    color: '#fff',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  followContainer: {
    flexDirection: 'row',
    marginTop: STATUS_BAR_HEIGHT - 10,
  },
  followItem: {
    alignItems: 'center',
    marginRight: 25,
  },
  followNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  followLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  tabItem: { 
    fontSize: 16, 
    color: '#666',
  },
  tabItemActive: { 
    fontWeight: 'bold', 
    color: '#000',
    backgroundColor: '#e0ffe0'  
  },
  postCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  postTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  postSnippet: { 
    fontSize: 14, 
    color: '#555' 
  },

});
