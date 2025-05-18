import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signup } from '../../services/authService'; // 회원가입 API 함수

export default function SignUpScreen({ navigation }) {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = async () => {
    if (!userid || !password || !nickname) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    try {
      await signup({ userid, password, nickname });  // API 요청
      console.log('회원가입 시도 중');
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('회원가입 시도 실패');
      Alert.alert('회원가입 실패', error.response?.data || '오류 발생');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디 (UserID)"
        value={userid}
        onChangeText={setUserid}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>← 로그인으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#004225FF',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#004225FF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  goBackText: {
    textAlign: 'center',
    color: '#004225FF',
    fontSize: 14,
  },
});
