import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';

export default function SplashScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 화면으로 이동
  const goToLogin = () => {
    navigation.navigate('Login');  // 로그인 화면으로 이동
  };

  // 회원가입 화면으로 이동
  const goToSignUp = () => {
    navigation.navigate('SignUp');  // 회원가입 화면으로 이동
  };

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        {/* 상단: 로고 + 환영문구 */}
        <View style={styles.top}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Find Your Golf Mate</Text>
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.signInButton} onPress={goToLogin}>
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.signUpButton} onPress={goToSignUp}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: '85%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    justifyContent: 'flex-end', // 버튼들이 하단으로 모이게 설정
  },

  top: {
    alignItems: 'center',
  },

  logo: {
    width: 174,
    height: 174,
    marginTop: 100,
  },

  welcomeText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#6E7787',
    textAlign: 'center',
    marginTop: 16,
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  buttonContainer: {
    width: '100%',
    flexDirection: 'column', // 버튼들이 세로로 나열되도록 설정
  },

  signInButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#004225FF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  signInText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFF',
  },

  signUpButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#004225FF',
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signUpText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#004225FF',
  },
});

