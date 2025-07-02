import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,           // ← 여기 추가
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../../api';

export default function SearchScreen({ navigation }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchCommunityRecommendations = async (limit = 10) => {
      try {
        const response = await api.get('/api/community/recommendations', {
          params: { limit },
        });
        setRecommendations(response.data);
      } catch (err) {
        console.error('추천 데이터 로드 실패:', err);
      }
    };
    fetchCommunityRecommendations(10);
  }, []);

    // 팔로우 요청 함수
    const handleFollow = async (followeeLoginId) => {
    try {

        const myloginId = loginId;
        await api.post(
            `/api/follows/${followeeLoginId}`,
            {},
            { headers: { loginId: myLoginId } }
        );        
        Alert.alert('팔로우 성공', `${followeeLoginId}님을 팔로우했습니다.`);
    } catch (err) {
        // 에러 상태와 메시지 출력
        console.error(
        '팔로우 실패:',
        err.response?.status,
        err.response?.data
        );
        Alert.alert(
        '팔로우 실패',
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

      {/* 프로필 정보 터치 시 화면 전환 */}
      <TouchableOpacity
        style={styles.info}
        onPress={() =>
          navigation.navigate(
            'OtherProfileScreen',      // ← 여기 이름 확인!
            { loginId: item.loginId }
          )
        }
      >
        <Text style={styles.name}>{item.loginId}</Text>
        <Text style={styles.username}>
          {item.nickname || '닉네임 없음'}
        </Text>
        <Text style={styles.followers}>
          {item.followerCount.toLocaleString()} followers
        </Text>
      </TouchableOpacity>

      {/* Follow 버튼 터치 시 바로 API 호출 */}
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => handleFollow(item.loginId)}
      >
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.headerMenu}>
        <Text style={styles.titleText}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={recommendations}
        keyExtractor={(item, index) =>
          item.loginId != null ? item.loginId : index.toString()
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerMenu: {
    marginTop: 20,
    alignItems: 'flex-start',
    marginLeft: '5%',
  },
  titleText: {
    color: '#1D7C3E',
    fontFamily: 'SF Pro',
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
    marginHorizontal: 16,
    marginTop: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
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
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  username: {
    marginTop: 2,
    fontSize: 14,
    color: '#666',
  },
  followers: {
    marginTop: 1,
    fontSize: 12,
    color: '#888',
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
});
