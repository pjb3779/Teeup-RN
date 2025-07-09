import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

export default function ChatScreen({ route, navigation }) {
  const { loginId, receiverId, roomId: routeRoomId } = route.params;

  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    if (routeRoomId) {
      console.log('[Chat] ✅ roomId 전달받음:', routeRoomId);
      setRoomId(routeRoomId);
      connectWebSocket(routeRoomId);
    } else {
      /**
       * Step 1. 채팅방 생성 or 조회
       */
      const createOrGetRoom = async () => {
        try {
          console.log('[Chat] 🔗 방 생성 or 조회 중...');

          const res = await fetch('http://10.193.58.82:8080/api/chatrooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              loginId1: loginId,
              loginId2: receiverId,
            }),
          });

          if (!res.ok) {
            throw new Error(`Failed to create/get chat room. Status: ${res.status}`);
          }

          const data = await res.json();
          console.log('[Chat] ✅ 채팅방 생성/조회 완료:', data);

          const newRoomId =
            typeof data.id === 'object' && data.id?.toString
              ? data.id.toString()
              : String(data.id);

          setRoomId(newRoomId);
          connectWebSocket(newRoomId);
        } catch (error) {
          console.error('[Chat] ❌ 방 생성/조회 실패:', error);
          Alert.alert('Error', '채팅방 생성에 실패했습니다.');
        }
      };

      createOrGetRoom();
    }

    return () => {
      console.log('[WebSocket] Cleaning up connection...');
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  /**
   * WebSocket 연결 함수
   */
  const connectWebSocket = (roomId) => {
    console.log(`[WebSocket] Connecting to ws://10.193.58.82:8080/ws/chat?loginId=${loginId}&roomId=${roomId}`);
    
    ws.current = new WebSocket(
      `ws://10.193.58.82:8080/ws/chat?loginId=${loginId}&roomId=${roomId}`
    );

    ws.current.onopen = () => {
      console.log('[WebSocket] ✅ Connected!');
    };

    ws.current.onmessage = (event) => {
      console.log('[WebSocket] 📥 Message received:', event.data);

      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error('[WebSocket] ❌ JSON parse error:', error, event.data);
      }
    };

    ws.current.onerror = (e) => {
      console.error('[WebSocket] ❌ Error occurred:', e.message);
      Alert.alert('WebSocket Error', e.message);
    };

    ws.current.onclose = (e) => {
      console.log(`[WebSocket] 🚪 Connection closed. Code: ${e.code}, Reason: ${e.reason}`);
    };
  };

  /**
   * 메시지 전송
   */
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const messageDto = {
      roomId: roomId,        // ✅ 이제 roomId는 무조건 string
      senderId: loginId,
      receiverId: receiverId,
      content: inputText,
      type: 'TEXT'
    };

    try {
      ws.current.send(JSON.stringify(messageDto));
      console.log('[WebSocket] 📤 Message sent:', messageDto);

      setMessages(prev => [...prev, { ...messageDto, isLocal: true }]);
      setInputText('');
    } catch (e) {
      console.error('[WebSocket] ❌ Failed to send message:', e);
      Alert.alert('WebSocket Error', '메시지를 보낼 수 없습니다.');
    }
  };



  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === loginId ? styles.myMessage : styles.otherMessage
      ]}
    >
      <Text style={styles.sender}>
        {item.senderId === loginId ? '나' : item.senderId}
      </Text>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageList: {
    padding: 10,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#EEE',
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
