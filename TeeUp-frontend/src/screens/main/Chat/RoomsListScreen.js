// src/screens/main/Chat/RoomsListScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { getLoginId, API_BASE_DEFAULT } from '../../../utils/session';

function pickRoomId(obj) {
  if (!obj) return null;
  return obj.id || obj._id || (obj.id && obj.id.$oid) || obj.roomId || null;
}

export default function RoomsListScreen({ navigation }) {
  const [loginId, setLoginId] = useState(null);
  const [apiBase] = useState(API_BASE_DEFAULT);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [peerId, setPeerId] = useState('');
  const [creating, setCreating] = useState(false);

  // 로그인 아이디 로드
  useEffect(() => {
    (async () => {
      const id = await getLoginId();
      if (!id) {
        Alert.alert('로그인 필요', '다시 로그인 해주세요.');
        setLoading(false);
        return;
      }
      setLoginId(id);
    })();
  }, []);

  // 내 채팅방 목록
  const fetchRooms = useCallback(async () => {
    if (!loginId) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/chat/rooms/my?loginId=${encodeURIComponent(loginId)}`);
      if (!res.ok) throw new Error('방 목록 조회 실패');
      const data = await res.json();
      setRooms(data);
    } catch (e) {
      Alert.alert('오류', e.message || '조회 실패');
    } finally {
      setLoading(false);
    }
  }, [apiBase, loginId]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  // 상대 존재 확인(Optional) → 방 생성/이동
  const startChat = async () => {
    const target = peerId.trim();
    if (!loginId || !target) return;
    if (target === loginId) {
      Alert.alert('알림', '자기 자신과는 대화할 수 없어요.');
      return;
    }

    try {
      setCreating(true);

      // 1) (있으면) 존재 확인 API 호출
      let exists = true;
      try {
        const ex = await fetch(`${apiBase}/api/users/exists?loginId=${encodeURIComponent(target)}`);
        if (ex.ok) {
          const json = await ex.json();
          exists = !!json.exists;
        }
      } catch (_) {
        // 존재확인 API 없으면 스킵
      }
      if (!exists) {
        Alert.alert('알림', '해당 로그인 아이디가 없습니다.');
        return;
      }

      // 2) 1:1 방 생성/조회
      const url = `${apiBase}/api/chat/rooms/1to1?me=${encodeURIComponent(loginId)}&peer=${encodeURIComponent(target)}`;
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) {
        if (res.status === 404) {
          Alert.alert('알림', '상대 사용자가 존재하지 않습니다.');
          return;
        }
        const msg = await res.text();
        throw new Error(msg || '방 생성 실패');
      }
      const room = await res.json();
      const rid = pickRoomId(room);
      if (!rid) {
        console.log('room 응답:', room);
        Alert.alert('오류', '서버 응답에 roomId가 없습니다.');
        return;
      }

      setPeerId('');
      // 3) 목록 갱신(선택) 후 해당 방으로 이동
      fetchRooms();
      navigation.navigate('ChatScreen', { roomId: rid }); // ✅ 이름 일치
    } catch (e) {
      Alert.alert('오류', e.message || '방 생성 실패');
    } finally {
      setCreating(false);
    }
  };

  if (!loginId) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>로그인 정보를 불러오는 중...</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16 }}>
      {/* 상대 loginId로 새 대화 시작 */}
      <View style={{ flexDirection:'row', gap:8, marginBottom:12 }}>
        <TextInput
          value={peerId}
          onChangeText={setPeerId}
          placeholder="상대 loginId 입력"
          autoCapitalize="none"
          style={{ flex:1, borderWidth:1, borderColor:'#ccc', borderRadius:8, paddingHorizontal:12, height:44 }}
        />
        <TouchableOpacity
          onPress={startChat}
          disabled={creating}
          style={{
            height:44, paddingHorizontal:16, borderRadius:8,
            alignItems:'center', justifyContent:'center',
            backgroundColor:'#1D7C3E', opacity: creating ? 0.6 : 1
          }}
        >
          <Text style={{ color:'#fff', fontWeight:'700' }}>
            {creating ? '시작 중...' : '시작'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 빈 상태 / 목록 */}
      {rooms.length === 0 ? (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Text style={{ fontSize:16, color:'#666' }}>대화가 없습니다</Text>
          <Text style={{ marginTop:6, color:'#888' }}>상단에서 상대 아이디로 대화를 시작하세요</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => pickRoomId(item)}
          renderItem={({ item }) => {
            const rid = pickRoomId(item);
            const other = item.members?.find(m => m !== loginId) || item.members?.[0] || '';
            return (
              <TouchableOpacity
                style={{ paddingVertical:14, borderBottomWidth:1, borderColor:'#eee' }}
                onPress={() => navigation.navigate('ChatScreen', { roomId: rid })}
              >
                <Text style={{ fontSize:16, fontWeight:'700' }}>{other}</Text>
                <Text style={{ fontSize:13, color:'#666' }} numberOfLines={1}>
                  {item.lastMessage || '대화를 시작해 보세요'}
                </Text>
              </TouchableOpacity>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}
