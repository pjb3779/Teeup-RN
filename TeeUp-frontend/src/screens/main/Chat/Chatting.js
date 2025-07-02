import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';

export default function Chatting({ navigation }) {
  // 현재 로그인한 내 loginId (예시)
  const loginId = '11';

  // 채팅방 목록 (지금은 비워둠)
  const chatRooms = [];

  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [newReceiverId, setNewReceiverId] = useState('');

  /**
   * 새 채팅 모달 열기
   */
  const handleNewChat = () => {
    setModalVisible(true);
  };

  /**
   * 새 채팅방 만들러 이동
   */
  const startNewChat = () => {
    if (!newReceiverId.trim()) {
      Alert.alert('오류', '상대방 아이디를 입력해주세요.');
      return;
    }

    // 모달 닫기
    setModalVisible(false);

    // ChatScreen으로 이동
    navigation.navigate('ChatScreen', {
      loginId,
      receiverId: newReceiverId.trim(),
    });

    setNewReceiverId('');
  };

  /**
   * 리스트 아이템 렌더링
   */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          loginId,
          receiverId: item.receiverId,
          roomId: item.roomId,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      <Text style={styles.time}>{item.lastUpdated}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={item => item.roomId}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>채팅방이 없습니다.</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Text style={styles.newChatButtonText}>➕ 새 채팅</Text>
      </TouchableOpacity>

      {/* 모달: 새 채팅 상대 입력 */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>상대방 로그인 아이디</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="상대방 loginId 입력"
              value={newReceiverId}
              onChangeText={setNewReceiverId}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={startNewChat}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  item: {
    paddingVertical: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  newChatButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
