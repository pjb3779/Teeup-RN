import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 아이콘 라이브러리
import { signup } from '../../services/authService'; // 회원가입 API 호출 함수

export default function SignUpScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!loginId || !password) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    try {
      await signup({ 
        loginId,
        password,
      });
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('회원가입 실패 사인업 스크린', error.message);
      Alert.alert('회원가입 실패', error.message || '오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* UserID 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>UserID</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter UserID"
            placeholderTextColor="#aaa"
            value={loginId}
            onChangeText={setLoginId}
          />
        </View>
      </View>

      {/* Password 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.authButton} onPress={handleSignup}>
        <Text style={styles.authButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* 로그인 화면으로 이동 */}
      <View style={styles.promptWrapper}>
        <Text style={styles.promptText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.promptLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#004225FF',
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 48,
    paddingLeft: 10,
  },
  authButton: {
    width: 350,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#004225FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  promptWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  promptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  promptLink: {
    fontSize: 14,
    color: '#004225FF',
    fontWeight: '600',
  },
});
