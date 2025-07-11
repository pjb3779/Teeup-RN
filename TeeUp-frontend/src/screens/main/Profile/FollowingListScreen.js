import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';

export default function FollowingListScreen({ navigation, route }) {
  const { loginId } = route.params;
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(
          `/api/follows/followees/${loginId}`,
          { headers: { loginId } }
        );
        // 배열로 넘어올 수도, 문자열 메시지일 수도 있으니 방어적으로 처리
        setFollowing(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('팔로잉 목록 로드 실패:', e);
        Alert.alert('오류', '팔로잉 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [loginId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7C3E" />
      </View>
    );
  }

  if (following.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>팔로잉 중인 사용자가 없습니다.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.navigate('OtherProfileScreen', {
          loginId: item.loginId,
          nickname: item.nickname,
          avatarUrl: item.avatarUrl,
        });
      }}
    >
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <Text style={styles.name}>{item.nickname || item.loginId}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={following}
        keyExtractor={(item) => item.loginId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#666' },
  listContent: { padding: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
});
