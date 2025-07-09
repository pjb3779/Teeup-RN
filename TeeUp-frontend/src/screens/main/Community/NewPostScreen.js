import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';

export default function NewPostScreen({ navigation }) {
  const [loginId, setLoginId] = useState(null);
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem('loginId');
        if (id) setLoginId(id);
        else console.warn('⚠️ AsyncStorage에 loginId가 없습니다.');
      } catch (err) {
        console.error('❌ LoginId load error', err);
      }
    })();
  }, []);

  const handleCancel = () => navigation.goBack();
  const handlePost = async () => {
    if (!loginId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }
    try {
      await api.post(`/api/post/${loginId}`, { title, contents });
      Alert.alert('성공', '게시물이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('❌ Post creation failed', err.response || err);
      Alert.alert(
        '실패',
        err.response?.data?.message || '게시물 생성에 실패했습니다.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputRow}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.username}>{loginId || '...'}</Text>
              <TextInput
                style={styles.textTitle}
                placeholder="Enter a title..."
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Start to post..."
                multiline
                value={contents}
                onChangeText={setContents}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.attachment}>
            <Text>📎</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.reply}>Anyone can reply</Text>
            <View style={styles.spacer} />
          </View>
        </ScrollView>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.bottomPostButton}
            onPress={handlePost}
            disabled={!title.trim() || !contents.trim()}
          >
            <Text
              style={[
                styles.bottomPostButtonText,
                (!title.trim() || !contents.trim()) && styles.disabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  headerButton: {
    fontSize: 16,
    color: '#1D7C3E',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexGrow: 1,
    padding: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  textTitle: {
    fontSize: 15,
    minHeight: 50,
  },
  textInput: {
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  attachment: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reply: {
    fontSize: 14,
    color: '#888',
  },
  spacer: {
    flex: 1,
  },
  bottomArea: {
    padding: 10,
    backgroundColor: '#fff',
  },
  bottomPostButton: {
    backgroundColor: '#1D7C3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  bottomPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
