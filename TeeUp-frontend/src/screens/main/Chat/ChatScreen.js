import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

export default function ChatScreen({ route }) {
  const { userId, receiverId, roomId } = route.params;

  const ws = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    ws.current = new WebSocket(`wss://yourserver.com/ws/chat?userId=${userId}`);

    ws.current.onopen = () => console.log('WebSocket 연결됨');
    ws.current.onmessage = e => {
      const msg = JSON.parse(e.data);
      setMessages(prev => [...prev, msg]);
    };
    ws.current.onerror = e => console.log('WebSocket 에러', e.message);
    ws.current.onclose = () => console.log('WebSocket 연결 종료');

    return () => ws.current.close();
  }, [userId]);

  const sendMessage = () => {
    if (!input) return;
    const message = {
      roomId,
      senderId: userId,
      receiverId,
      content: input,
      type: 'TEXT',
    };
    ws.current.send(JSON.stringify(message));
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => <Text>{item.senderId}: {item.content}</Text>}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="메시지를 입력하세요"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="전송" onPress={sendMessage} />
    </View>
  );
}
