import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';
import axios from 'axios';

export default function OtherProfileScreen({ navigation, route }) {
  const { loginId, nickName } = route.params;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile/avatar/get', {
          headers: { loginId }
        });
        console.log("✅ 프로필 조회 성공:", res.data);
        setAvatarUrl(res.data.avatarUrl);
      } catch (err) {
        if (err.response) {
          // 서버가 4xx, 5xx 응답을 준 경우
          console.error("❌ 서버 에러!");
          console.error("Status:", err.response.status);
          console.error("Response data:", err.response.data);
          console.error("Headers:", err.response.headers);
        } else if (err.request) {
          // 요청이 서버에 도달했으나 응답이 없는 경우
          console.error("❌ 응답 없음! (네트워크 문제일 가능성)");
          console.error("Request:", err.request);
        } else {
          // 요청을 보내기 전 에러 발생 (설정 오류 등)
          console.error("❌ 요청 생성 중 에러:", err.message);
        }
        console.error("에러 config:", err.config);
      }
    };

    fetchProfile();
  }, [loginId]);


  return (
    <SafeAreaView style={styles.container}>

      {/* 상단 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={"#000"}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Icon name="more-vert" size={24} color={"#000"}/>
        </TouchableOpacity>
      </View>

      {/* 프로필 헤더 */}
      <View style={styles.profileHeader}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
            onLoad={() => console.log('✅ Image onLoad')}
            onError={(e) => console.error('❌ Image onError:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.avatar} />   // 로딩 중 placeholder
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.userNickname}>{nickName}</Text>
          <Text style={styles.userLoginId}>{loginId}</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  userNickname: {
    fontWeight: "700",
    lineHeight: 28,
    fontSize: 26,
  },
  userLoginId: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#ddd', // 로딩 중 회색 배경
  },
});
