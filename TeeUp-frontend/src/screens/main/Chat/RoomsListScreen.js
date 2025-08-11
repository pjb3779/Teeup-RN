// src/screens/main/Chat/RoomsListScreen.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  RefreshControl, ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getLoginId, API_BASE_DEFAULT } from '../../../utils/session';

function pickRoomId(obj) {
  if (!obj) return null;
  const raw = obj.id || obj._id || (obj.id && obj.id.$oid) || obj.roomId || null;
  return raw ? String(raw) : null;
}

// 리스트 동등성 체크(길이, 각 항목의 id/updatedAt/lastMessage 비교)
function isSameRooms(prev, next) {
  if (!Array.isArray(prev) || !Array.isArray(next)) return false;
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    const a = prev[i], b = next[i];
    const aid = pickRoomId(a), bid = pickRoomId(b);
    if (aid !== bid) return false;
    if ((a.updatedAt || '') !== (b.updatedAt || '')) return false;
    if ((a.lastMessage || '') !== (b.lastMessage || '')) return false;
  }
  return true;
}

const COLORS = {
  pageBg: '#FCFBF7',
  searchBg: 'rgba(184,184,184,0.54)',
  neutralDarkest: '#1F2024',
  neutralLight: '#71727A',
  neutralLightest: '#8F9098',
  divider: '#EEEEEE',
  brand: '#1D7C3E',
  highlight: '#006FFD',
  avatarBg: '#EAF2FF',
  badgeText: '#FFFFFF'
};

export default function RoomsListScreen({ navigation }) {
  const [loginId, setLoginId] = useState(null);
  const [apiBase] = useState(API_BASE_DEFAULT);

  const [rooms, setRooms] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);  // ✅ 최초 로딩만 스피너
  const [refreshing, setRefreshing] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const id = await getLoginId();
      if (!id) {
        Alert.alert('로그인 필요', '다시 로그인 해주세요.');
        setInitialLoading(false);
        return;
      }
      setLoginId(id);
    })();
  }, []);

  const fetchRooms = useCallback(async (opts = {}) => {
    const { silent = false } = opts; // ✅ 깜빡임 제거: 기본은 silent
    if (!loginId) return;
    try {
      if (!silent && initialLoading) {
        // 첫 로딩에만 상단 스피너(오버레이) 표시
        setInitialLoading(true);
      }
      const res = await fetch(`${apiBase}/api/chat/rooms/my?loginId=${encodeURIComponent(loginId)}`);
      if (!res.ok) throw new Error('방 목록 조회 실패');
      const data = await res.json();
      const next = Array.isArray(data) ? data : [];
      setRooms((prev) => (isSameRooms(prev, next) ? prev : next)); // ✅ 동일하면 상태 갱신 안 함
    } catch (e) {
      Alert.alert('오류', e.message || '조회 실패');
    } finally {
      setInitialLoading(false);
    }
  }, [apiBase, loginId, initialLoading]);

  // 최초 진입: 스피너 보이되 리스트를 안 가림 (오버레이)
  useEffect(() => { fetchRooms({ silent: false }); }, [fetchRooms]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms({ silent: true }); // ✅ 당겨서 새로고침도 리스트 유지
    setRefreshing(false);
  };

  // 포커스될 때마다 조용히 동기화
  useFocusEffect(
    React.useCallback(() => {
      fetchRooms({ silent: true });
    }, [fetchRooms])
  );

  // 화면 떠있는 동안 폴링(조용히)
  useEffect(() => {
    if (!isFocused || !loginId) return;
    const t = setInterval(() => fetchRooms({ silent: true }), 4000);
    return () => clearInterval(t);
  }, [isFocused, loginId, fetchRooms]);

  const startChat = async () => {
    const target = peerId.trim();
    if (!loginId || !target) return;
    if (target === loginId) {
      Alert.alert('알림', '자기 자신과는 대화할 수 없습니다.');
      return;
    }
    try {
      setCreating(true);
      let exists = true;
      try {
        const ex = await fetch(`${apiBase}/api/users/exists?loginId=${encodeURIComponent(target)}`);
        if (ex.ok) {
          const json = await ex.json();
          exists = !!json.exists;
        }
      } catch {}
      if (!exists) {
        Alert.alert('알림', '해당 로그인 아이디가 없습니다.');
        return;
      }
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
        Alert.alert('오류', '서버 응답에 roomId가 없습니다.');
        return;
      }
      setPeerId('');
      fetchRooms({ silent: true });
      navigation.navigate('ChatScreen', { roomId: rid });
    } catch (e) {
      Alert.alert('오류', e.message || '방 생성 실패');
    } finally {
      setCreating(false);
    }
  };

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((r) => {
      const other = r.members?.find(m => m !== loginId) || r.members?.[0] || '';
      const last = r.lastMessage || '';
      return String(other).toLowerCase().includes(q) || String(last).toLowerCase().includes(q);
    });
  }, [rooms, query, loginId]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* 상단 네비 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftBtnHit}>
          <Text style={styles.leftBtnText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Chats</Text>
        <TouchableOpacity onPress={() => fetchRooms({ silent: true })} style={styles.rightBtnHit}>
          <Text style={styles.rightBtnText}>새로고침</Text>
        </TouchableOpacity>
      </View>

      {/* 검색/시작 */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.neutralLightest} style={{ marginRight: 0 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.neutralLightest}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
        <View style={styles.startRow}>
          <TextInput
            value={peerId}
            onChangeText={setPeerId}
            placeholder="상대 loginId 입력"
            placeholderTextColor={COLORS.neutralLight}
            autoCapitalize="none"
            style={styles.peerInput}
          />
          <TouchableOpacity onPress={startChat} disabled={creating} style={[styles.startBtn, creating && { opacity:0.6 }]}>
            <Text style={styles.startBtnText}>{creating ? '시작 중...' : '시작'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 목록 */}
      {filteredRooms.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>
            {initialLoading ? '불러오는 중...' : '대화가 없습니다'}
          </Text>
          {!initialLoading && (
            <Text style={styles.emptyDesc}>상단에서 상대 아이디로 대화를 시작하세요</Text>
          )}
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal:8, paddingBottom:16 }}
          data={filteredRooms}
          keyExtractor={(item) => pickRoomId(item)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const rid = pickRoomId(item);
            if (!rid) return null;
            const other = item.members?.find(m => m !== loginId) || item.members?.[0] || '';
            const lastMsg = item.lastMessage || '대화를 시작해 보세요';
            const unread = Number(item.unreadCount || 0);

            return (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate('ChatScreen', { roomId: rid })}
              >
                <View style={styles.avatar}>
                  <View style={styles.avatarRect}/>
                  <View style={styles.avatarDot}/>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{String(other)}</Text>
                  <Text style={styles.itemDesc} numberOfLines={1}>{String(lastMsg)}</Text>
                </View>
                {unread > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText} numberOfLines={1}>
                      {unread > 99 ? '99+' : unread}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* 최초 로딩 시에만 오버레이 스피너(리스트를 가리지 않음) */}
      {initialLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
        </View>
      )}

      <View style={styles.homeIndicatorSpacer}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.pageBg },
  navBar: { height: 56, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  pageTitle: {
    position: 'absolute', left: 0, right: 0, textAlign: 'center',
    fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 17, color: COLORS.neutralDarkest,
  },
  leftBtnHit: { position: 'absolute', left: 16, top: 0, bottom: 0, justifyContent: 'center' },
  rightBtnHit: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  rightBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.brand },
  leftBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.brand },

  searchWrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  searchBar: {
    height: 44, backgroundColor: COLORS.searchBg, borderRadius: 24,
    paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  searchInput: {
    flex: 1, height: 44, paddingVertical: 0,
    fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: '#1F2024',
  },

  startRow: { marginTop: 10, flexDirection: 'row', gap: 8 },
  peerInput: {
    flex: 1, height: 44, borderWidth: 1, borderColor: '#D4D6DD', borderRadius: 8,
    paddingHorizontal: 12, color: COLORS.neutralDarkest, fontFamily: 'Inter_400Regular',
  },
  startBtn: {
    height: 44, paddingHorizontal: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.brand,
  },
  startBtnText: { color: '#fff', fontWeight: '700' },

  listItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16,
    borderBottomWidth: 1, borderColor: COLORS.divider,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 16, backgroundColor: COLORS.avatarBg,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarRect: {
    position: 'absolute', width: 12, height: 8, backgroundColor: COLORS.brand, borderRadius: 1.2, bottom: 6,
  },
  avatarDot: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.brand, top: 8,
  },
  itemContent: { flex: 1, gap: 4 },
  itemTitle: { fontFamily: 'Inter_700Bold', fontSize: 12, lineHeight: 15, color: COLORS.neutralDarkest },
  itemDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: COLORS.neutralLight },
  badge: {
    width: 24, height: 24, borderRadius: 20, backgroundColor: COLORS.brand,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, lineHeight: 12,
    color: COLORS.badgeText, textTransform: 'uppercase',
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, color: '#666' },
  emptyDesc: { marginTop: 6, color: '#888', textAlign: 'center' },
  homeIndicatorSpacer: { height: 16 },

  // 오버레이 스피너(리스트 유지)
  loadingOverlay: {
    position: 'absolute', top: 56, right: 16, // 헤더 오른쪽 근처에 작게 표시
    padding: 4, backgroundColor: 'transparent',
  },
});
