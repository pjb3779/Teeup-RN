// src/screens/main/Chat/ChatScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View, TextInput, Button, FlatList, Text, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Client } from '@stomp/stompjs';
import { getLoginId, API_BASE_DEFAULT, WS_URL_DEFAULT } from '../../../utils/session';

export default function ChatScreen({ route, navigation }) {
  const roomId = route?.params?.roomId || null;

  const [loginId, setLoginId] = useState(null);
  const [apiBase] = useState(API_BASE_DEFAULT);
  const [wsUrl]   = useState(WS_URL_DEFAULT);

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // 진입 파라미터 확인
  useEffect(() => {
    console.log('Chat route.params =', route?.params);
  }, [route?.params]);

  // 로그인 아이디 로드
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

  // 히스토리 로드
  useEffect(() => {
    (async () => {
      if (!roomId) return;
      try {
        const res = await fetch(`${apiBase}/api/chat/rooms/${roomId}/history?page=0&size=30`);
        const page = await res.json();
        setMessages((page.content || []).slice().reverse());
      } catch (e) {
        console.warn('history error', e);
      }
    })();
  }, [apiBase, roomId]);

  // STOMP 연결
  useEffect(() => {
    if (!roomId || !loginId) return;

    const client = new Client({
      webSocketFactory: () => {
        const ws = new WebSocket(wsUrl, ['v12.stomp', 'v11.stomp', 'v10.stomp']); // ★ 배열
        ws.onopen = () => {
         // 협상된 프로토콜 실제로 뭐로 잡혔는지 확인
        console.log('WS NEGOTIATED PROTOCOL =', ws.protocol);
      };
      return ws;
    },
      connectHeaders: { loginId: (loginId || '').trim() }, // Principal로 사용
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log('[STOMP]', str),
      onWebSocketClose: (evt) => console.log('WS closed', evt?.code, evt?.reason),
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    client.onConnect = (frame) => {
      console.log('STOMP connected, session:', frame?.headers?.['session']);
      setConnected(true);
      client.subscribe(`/topic/rooms/${roomId}`, (msgFrame) => {
        console.log('sub msg:', msgFrame.body);
        const msg = JSON.parse(msgFrame.body);
        setMessages(prev => [...prev, msg]);
      });
    };

    client.onStompError = (frame) => {
      console.warn('STOMP ERROR hdr:', frame.headers);
      console.warn('STOMP ERROR body:', frame.body);
    };

    client.onWebSocketError = (e) => {
      console.warn('WS ERROR', e?.message || e);
    };

    client.onDisconnect = () => {
      console.log('STOMP disconnected');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [wsUrl, loginId, roomId]);

  // 전송
  const sendMessage = () => {
    const content = text.trim();
    if (!connected || !content) return;
    console.log('publish ->', { roomId, loginId, content });
    clientRef.current?.publish({
      destination: `/app/rooms/${roomId}/send`,
      body: JSON.stringify({ type: 'TEXT', content }),
      headers: { 'content-type': 'application/json' }, // 중요
    });
    setText('');
  };

  if (!roomId) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>roomId 없음</Text></View>;
  }
  if (!loginId) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>로그인 확인 중...</Text></View>;
  }

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        style={{ flex:1, padding:12 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const mine = item.senderLoginId === loginId;
          return (
            <View style={{
              alignSelf: mine ? 'flex-end' : 'flex-start',
              backgroundColor: mine ? '#DCF8C6' : '#fff',
              padding:10, borderRadius:10, marginVertical:4, maxWidth:'80%', elevation:1
            }}>
              <Text style={{ fontSize:15 }}>{item.content}</Text>
              <Text style={{ fontSize:10, color:'#666', marginTop:4 }}>{mine ? '나' : item.senderLoginId}</Text>
            </View>
          );
        }}
      />
      <View style={{ flexDirection:'row', gap:8, padding:12, borderTopWidth:1, borderColor:'#eee' }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="메시지를 입력..."
          style={{ flex:1, borderWidth:1, borderColor:'#ccc', borderRadius:20, paddingHorizontal:14, height:44 }}
        />
        <Button title="보내기" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}
