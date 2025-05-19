import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 아이콘 라이브러리
import { login } from '../../services/authService'; // 로그인 API 호출 함수
import Main from '../main/HomeScreen'; // 로그인 후 메인 화면

export default function LoginScreen({ navigation, onLogin }) {
  const [userid, setUserid] = useState('');  // email을 userid로 변경
  const [password, setPassword] = useState('');  // 비밀번호 상태
  const [showPassword, setShowPassword] = useState(false);  // 비밀번호 보이기 여부 상태

  // 로그인 함수
  const handleLogin = async () => {
    console.log('로그인 시도중');
    if (!userid || !password) {  // 이메일과 비밀번호가 비어있는지 확인
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const token = await login(userid, password);  // 서버와 로그인 요청
      console.log('로그인 성공, 토큰:', token);  // 토큰을 console에 출력 (개발 중)

      onLogin();  // 로그인 성공 시 홈 화면으로 이동
      
      Alert.alert('로그인 성공', `환영합니다! ${token.nickname}`); 
    } catch (error) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 틀렸습니다.');
       console.log('로그인 실패');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, TeeUp</Text>

      {/* UserID 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>UserID</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter UserID"
            placeholderTextColor="#aaa"
            value={userid}
            onChangeText={setUserid}
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
          {/* 비밀번호 보이기/숨기기 기능 */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>   
      </View>

      {/* 비밀번호 찾기 */}
      <TouchableOpacity style={styles.forgotWrapper} onPress={() => Alert.alert('비밀번호 찾기', '비밀번호 찾기 창으로 이동합니다')}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* 로그인 버튼  */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        <Text style={styles.signUpButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* 회원가입 화면으로 이동 */}
      <View style={styles.signupPromt}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign up</Text>
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
    backgroundColor: 'white'
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color:'#004225FF',
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

  signUpButton: {
    width: 350,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#004225FF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  signUpButtonText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 28,
  },

  forgotWrapper: {
    width: '100%',
    alignItems: 'flex-end', // 오른쪽 정렬
    marginBottom: 16,
  },

  forgotText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#004225FF',
  },

  signupPromt: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  signupText: {
    fontSize: 14,
    color: '#6B7280', // neutral-500
  },

  signupLink: {
    fontSize: 14,
    color: '#004225FF', // primary color
    fontWeight: '600',
    marginLeft: 4,
  },

});
