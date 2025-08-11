// src/screens/main/Chat/ChatScreen.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View, TextInput, FlatList, Text, Platform, Alert, TouchableOpacity, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Client } from '@stomp/stompjs';
import * as Device from 'expo-device'; // ⬅️ Z 플립 감지용
import { getLoginId, API_BASE_DEFAULT, WS_URL_DEFAULT } from '../../../utils/session';
import { setCurrentRoomId } from '../../../utils/ws';

const COLORS = {
  pageBg: '#FCFBF7',
  bubbleInBg: '#F8F9FE',
  bubbleOutBg: '#1D7C3E',
  textDarkest: '#1F2024',
  textOnPrimary: '#FFFFFF',
  inputBg: '#F8F9FE',
  brand: '#1D7C3E',
  highlight: '#006FFD',
};

export default function ChatScreen({ route, navigation }) {
  const roomId = route?.params?.roomId || null;

  const [loginId, setLoginId] = useState(null);
  const [apiBase] = useState(API_BASE_DEFAULT);
  const [wsUrl]   = useState(WS_URL_DEFAULT);

  const clientRef = useRef(null);
  const subRef = useRef(null);
  const listRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState('');
  const [inputH, setInputH]       = useState(56);

  // ⬇️ 키보드 수동 리프트용
  const [kbHeight, setKbHeight]   = useState(0);
  const [kbVisible, setKbVisible] = useState(false);

  const insets = useSafeAreaInsets();

  // Z 플립 감지: 모델명이 'Z Flip' 이거나 SM-F7xx 계열이면 true
  const isZFlip = useMemo(() => {
    if (Platform.OS !== 'android') return false;
    const name = (Device.modelName || '').toUpperCase();
    return name.includes('Z FLIP') || /SM-F7\d{2}/i.test(name);
  }, []);

  // iOS 또는 Z 플립은 수동 리프트, 그 외 안드로이드는 OS resize 신뢰
  const needsManualLift = Platform.OS === 'ios' || isZFlip;

  // 현재 방 표시 (알림 억제)
  useEffect(() => {
    if (roomId) setCurrentRoomId(roomId);
    return () => setCurrentRoomId(null);
  }, [roomId]);

  // 탭바 숨기기/복구
  useEffect(() => {
    const parent = navigation.getParent?.();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  // 로그인 아이디
  useEffect(() => {
    (async () => {
      if (!roomId) return;
      const id = await getLoginId();
      if (!id) {
        Alert.alert('로그인 필요', '다시 로그인 해주세요.');
        return;
      }
      setLoginId(id);
    })();
  }, [roomId]);

  // 히스토리
  useEffect(() => {
    (async () => {
      if (!roomId) return;
      try {
        const res = await fetch(`${apiBase}/api/chat/rooms/${roomId}/history?page=0&size=30`);
        const page = await res.json();
        const list = (page.content || []).slice().reverse();
        setMessages(list);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0);
      } catch (e) {
        console.warn('history error', e);
      }
    })();
  }, [apiBase, roomId]);

  // STOMP
  useEffect(() => {
    if (!roomId || !loginId) return;

    const client = new Client({
      webSocketFactory: () => {
        const ws = new WebSocket(wsUrl, ['v12.stomp', 'v11.stomp', 'v10.stomp']);
        ws.onopen = () => console.log('WS NEGOTIATED PROTOCOL =', ws.protocol);
        return ws;
      },
      connectHeaders: { loginId: (loginId || '').trim() },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log('[STOMP]', str),
      onWebSocketClose: (evt) => console.log('WS closed', evt?.code, evt?.reason),
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    client.onConnect = () => {
      setConnected(true);
      subRef.current = client.subscribe(`/topic/rooms/${roomId}`, (msgFrame) => {
        try {
          const msg = JSON.parse(msgFrame.body);
          setMessages((prev) => {
            const next = [...prev, msg];
            requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
            return next;
          });
        } catch (e) { console.warn('parse error:', e); }
      });
    };

    client.onStompError = (f) => console.warn('STOMP ERROR', f.headers, f.body);
    client.activate();
    clientRef.current = client;

    return () => {
      try { subRef.current?.unsubscribe?.(); } catch {}
      client.deactivate();
      setConnected(false);
    };
  }, [wsUrl, loginId, roomId]);

  // ✅ 키보드 수동 리프트 (iOS + Z 플립에서만 실사용, 나머지 기기는 영향 없음)
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKbHeight(h);
      setKbVisible(true);
    };
    const onHide = () => {
      setKbHeight(0);
      setKbVisible(false);
    };

    const s1 = Keyboard.addListener(showEvt, onShow);
    const s2 = Keyboard.addListener(hideEvt, onHide);

    return () => {
      s1?.remove?.();
      s2?.remove?.();
    };
  }, []);

  const sendMessage = () => {
    const content = text.trim();
    if (!connected || !content) return;
    clientRef.current?.publish({
      destination: `/app/rooms/${roomId}/send`,
      body: JSON.stringify({ type: 'TEXT', content }),
      headers: { 'content-type': 'application/json' },
    });
    setText('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const keyOf = (item) =>
    item?.id || item?._id || (item?.id && item.id.$oid) || `${item?.senderLoginId}-${item?.createdAt}`;

  const Bubble = ({ mine, content }) => (
    <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', marginVertical: 4, maxWidth: '80%' }}>
      <View
        style={{
          backgroundColor: mine ? COLORS.bubbleOutBg : COLORS.bubbleInBg,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: mine ? 20 : 0,
          borderBottomRightRadius: mine ? 0 : 20,
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 20, color: mine ? COLORS.textOnPrimary : COLORS.textDarkest }}>
          {content}
        </Text>
      </View>
    </View>
  );

  if (!roomId) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor: COLORS.pageBg}}><Text>roomId 없음</Text></View>;
  }
  if (!loginId) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor: COLORS.pageBg}}><Text>로그인 확인 중...</Text></View>;
  }

  // 상단 바
  const NavBar = () => (
    <View
      style={{
        height: 56 + (Platform.OS === 'ios' ? insets.top : 0),
        paddingTop: Platform.OS === 'ios' ? insets.top : 0,
        backgroundColor: COLORS.pageBg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() => navigation?.goBack?.()}
        style={{ position: 'absolute', left: 24, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={20} color={COLORS.highlight} />
      </TouchableOpacity>

      <Text style={{ fontWeight: '700', fontSize: 14, lineHeight: 17, color: COLORS.textDarkest }}>
        Chats
      </Text>

      <View
        style={{
          position: 'absolute', right: 16, width: 40, height: 40,
          backgroundColor: '#EAF2FF', borderRadius: 16, justifyContent: 'center', alignItems: 'center'
        }}
      >
        <View style={{ position: 'absolute', width: 12, height: 8, backgroundColor: COLORS.brand, borderRadius: 1.2, bottom: 6 }}/>
        <View style={{ position: 'absolute', width: 8, height: 8, backgroundColor: COLORS.brand, borderRadius: 4, top: 8 }}/>
      </View>
    </View>
  );

  // 🔧 입력바 절대 위치: iOS & Z 플립은 키보드 높이만큼 띄우고, 그 외 안드로이드는 0
  const bottomOffset = needsManualLift ? kbHeight : 0;
  // 리스트 패딩: 입력바 높이 + (수동 리프트면 키보드 높이 추가) + 안전 여백
  const extraBottomSafe = kbVisible ? 6 : (Platform.OS === 'ios' ? insets.bottom : 0);
  const listPadBottom = inputH + (needsManualLift ? kbHeight : 0) + extraBottomSafe;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBg }}>
      <NavBar />

      <FlatList
        ref={listRef}
        style={{ flex: 1, paddingHorizontal: 12, paddingTop: 12 }}
        contentContainerStyle={{ paddingBottom: listPadBottom }}
        data={messages}
        keyExtractor={keyOf}
        keyboardShouldPersistTaps="always"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => <Bubble mine={item.senderLoginId === loginId} content={item.content} />}
      />

      {/* 입력 바 - 화면 맨 아래 고정 + 필요 시 키보드 높이만큼 리프트 */}
      <View
        onLayout={(e) => setInputH(e.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          left: 0, right: 0, bottom: bottomOffset,
          backgroundColor: COLORS.pageBg,

          paddingTop: 8,
          paddingHorizontal: 16,
          // 키보드가 보일 땐 하단 inset 빼고 아주 얇은 여백만, 숨을 땐 홈인디케이터만큼
          paddingBottom: kbVisible ? 6 : (Platform.OS === 'ios' ? insets.bottom : 10),

          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={20} color={COLORS.highlight} />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            height: 40,
            borderRadius: 71,
            backgroundColor: COLORS.inputBg,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message"
            placeholderTextColor={COLORS.textDarkest}
            style={{ flex: 1, fontSize: 14, lineHeight: 20, color: COLORS.textDarkest, paddingVertical: 0 }}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
        </View>

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!connected || !text.trim()}
          activeOpacity={0.8}
          style={{
            width: 32, height: 32, borderRadius: 38,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: (!connected || !text.trim()) ? '#C5C6CC' : COLORS.brand,
          }}
        >
          <Ionicons name="send" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
