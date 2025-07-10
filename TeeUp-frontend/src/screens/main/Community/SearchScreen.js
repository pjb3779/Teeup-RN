import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';

export default function SearchScreen({ navigation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [myLoginId, setMyLoginId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyLoginId = async () => {
      try {
        const stored = await AsyncStorage.getItem('loginId');
        if (stored) {
          setMyLoginId(stored);
          console.log('✅ 내 로그인ID:', stored);
        } else {
          console.log('⚠️ AsyncStorage에 loginId가 없음');
        }
      } catch (e) {
        console.error('loginId 불러오기 실패', e);
      } finally {
        setLoading(false);
      }
    };

    loadMyLoginId();

    (async () => {
      try {
        const res = await api.get('/api/community/recommendations', {
          params: { limit: 10 },
        });
        const data = res.data.map((u) => ({
          ...u,
          isFollowing: u.isFollowing ?? false,
        }));
        setRecommendations(data);
      } catch (e) {
        console.error('추천 로드 실패', e);
      }
    })();
  }, []);

  // 팔로우 ↔ 언팔로우 토글 함수
  const handleToggleFollow = async (followeeLoginId, currentFollowing) => {
    try {
      if (!currentFollowing) {
        // 팔로우
        await api.post(
          `/api/follows/${followeeLoginId}`,
          {},
          { headers: { loginId: myLoginId } }
        );
        Alert.alert('팔로우 성공', `${followeeLoginId}님을 팔로우했습니다.`);
      } else {
        // 언팔로우
        await api.delete(`/api/follows/${followeeLoginId}`, {
          headers: { loginId: myLoginId },
        });
        Alert.alert('언팔로우 성공', `${followeeLoginId}님을 언팔로우했습니다.`);
      }

      // UI 업데이트
      setRecommendations((prev) =>
        prev.map((item) =>
          item.loginId === followeeLoginId
            ? {
                ...item,
                isFollowing: !currentFollowing,
                followerCount:
                  item.followerCount + (currentFollowing ? -1 : 1),
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        currentFollowing ? '언팔로우 실패:' : '팔로우 실패:',
        err.response?.status,
        err.response?.data
      );
      Alert.alert(
        currentFollowing ? '언팔로우 실패' : '팔로우 실패',
        err.response?.data?.message || '다시 시도해주세요.'
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}

    <TouchableOpacity
      style={styles.info}
      onPress={async () => {
        try {
          const res = await api.get('/api/profile', {
            headers: { loginId: item.loginId }
          });
          const { nickname, avatarUrl } = res.data;

          // ② OtherProfileScreen 으로 이동하면서 nickname, avatarUrl 함께 전달
          navigation.navigate('OtherProfileScreen', {
            loginId: item.loginId,
            nickName: nickname,
            avatarUrl: avatarUrl
          });
        } catch (err) {
          console.error('프로필 조회 실패', err);
          Alert.alert('오류', '프로필을 불러오는 데 실패했습니다.');
        }
      }}
    >
        <Text style={styles.name}>{item.loginId}</Text>
        <Text style={styles.username}>
          {item.nickname || '닉네임 없음'}
        </Text>
        <Text style={styles.followers}>
          {item.followerCount.toLocaleString()} followers
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing && styles.followButtonActive,
        ]}
        onPress={() => handleToggleFollow(item.loginId, item.isFollowing)}
      >
        <Text
          style={[
            styles.followText,
            item.isFollowing && styles.followTextActive,
          ]}
        >
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerMenu}>
        <Text style={styles.titleText}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={recommendations}
        keyExtractor={(item, index) =>
          item.loginId ?? index.toString()
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMenu: {
    marginTop: 20,
    marginLeft: '5%',
  },
  titleText: {
    color: '#1D7C3E',
    fontSize: 35,
    fontWeight: '600',
    marginTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    margin: 16,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  listContent: { paddingBottom: 16 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
  },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  username: { marginTop: 2, fontSize: 14, color: '#666' },
  followers: { marginTop: 1, fontSize: 12, color: '#888' },
  followButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  followButtonActive: {
    backgroundColor: '#1D7C3E',
    borderColor: '#1D7C3E',
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  followTextActive: {
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
});
