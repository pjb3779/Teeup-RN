import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'; 
import { fetchBuddyRecommendations } from '../../services/matchService'; // 추천 API 함수
import { fetchNearestLocation } from '../../services/locationService'; // 추가: 위치 API 함수
import useUserStore from '../../store/userStore';

export default function HomeScreen() {
  const { user } = useUserStore(); // 로그인 사용자 정보
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);   // 변경: 초기값 null

  // ▶ ① 현재 위치 좌표 + 서버 API 호출
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('위치 권한 거부됨');
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        console.log('현재 위치 좌표 불러오기 :', pos.coords);
        console.log('현재 위치 좌표 경도: ', pos.coords.latitude, ' 위도: ', pos.coords.longitude);

        const loc = await fetchNearestLocation(
          user.loginId,
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log('백에서 받은 위치정보:', loc);

        setLocation(loc);
      } catch (e) {
        console.log('위치 불러오기 실패:', e);
      }
    };

    loadLocation();
  }, []);

  // ▶ ② 추천 버디 부분
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await fetchBuddyRecommendations(user.loginId);
        setBuddies(data);
      } catch (error) {
        console.error('버디 추천 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, [user.id]);

  return (
    <View style={styles.container}>
      {/* 현재 위치 표시 */}
      <Text style={styles.title}>📍 현재 위치</Text>
      <Text style={styles.locationText}>
        {location
          ? `${location.state || ''} ${location.city || ''}`
          : '위치 정보를 불러오는 중...'}
      </Text>

      {/* 추천 버디 목록 */}
      <Text style={styles.title}>🧑‍🤝‍🧑 추천 버디</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      ) : (
        <FlatList
          data={buddies}
          keyExtractor={(item) => item.loginId}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nickname || '이름없음'}</Text>
              <Text style={styles.level}>{item.golf_level || '레벨정보없음'}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 전체 보기 버튼 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>전체 버디 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  locationText: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  level: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
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
