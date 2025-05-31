import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function Chatting({ navigation }) {
  // 예시 채팅 목록 데이터
  const chatRooms = [
    { roomId: 'room1', receiverId: 'userB', name: '유저 B' },
    { roomId: 'room2', receiverId: 'userC', name: '유저 C' },
  ];

  const userId = 'userA'; // 현재 로그인한 내 아이디 (예시)

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ChatScreen', {
        userId,
        receiverId: item.receiverId,
        roomId: item.roomId,
      })}
    >
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={item => item.roomId}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 18,
  },
});
