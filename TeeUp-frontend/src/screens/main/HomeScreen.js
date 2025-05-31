import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchBuddyRecommendations } from '../../services/matchService'; // 추천 API 함수
import useUserStore from '../../store/userStore';

export default function HomeScreen() {
  const { user } = useUserStore(); // 로그인 사용자 정보
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = { state: '구글api', city: '안돼 엉엉' }; // 임시 위치

  console.log('유저 정보:', user);
  console.log('유저 아이디:', user.loginId);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        console.log(user.loginId);
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
      <Text style={styles.locationText}>{location.state} {location.city}</Text>

      {/* 추천 버디 목록 */}
      <Text style={styles.title}>🧑‍🤝‍🧑 추천 버디</Text>

      {/*화면 비율로 동적으로 어느정도만 적당히 리스트 형식으로 만들어주세요*/}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      ) : (
        <FlatList
          data={buddies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.loginId}</Text>
              <Text style={styles.name}> 들어있는게 없어 </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
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
