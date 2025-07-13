import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 아이콘 라이브러리
import { login, signup } from '../../services/authService'; // 회원가입 API 호출 함수

export default function SignUpScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [loginId, setLoginId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);  // ← 약관 동의 상태

  const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    });
  };

  const handleSignup = async () => {
    if (!loginId || !password || !email) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (!agreed) {
      Alert.alert('약관 동의', '약관에 동의하셔야 회원가입이 가능합니다.');
      return;
    }

    try {
      //await signup({ loginId, password });
      //await signup({ name, email, loginId, password });  // 이메일도 함께 전송
      //Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      //navigation.navigate('Login');
      await signup({ /*name, email,*/ loginId, password , email,  });
          // 회원가입 성공 시 VerifyScreen 으로 이동, 이메일 파라미터 전달
          navigation.navigate('Vertify', { email, loginId });

    } catch (error) {
      console.error('회원가입 실패 사인업 스크린', error.message);
      Alert.alert('회원가입 실패', error.message || '오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>
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
      

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {/* 약관 동의 체크박스 */}
      <View style={styles.agreeWrapper}>
        <TouchableOpacity onPress={() => setAgreed(prev => !prev)}>
          <MaterialIcons
            name={agreed ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color={agreed ? '#004225FF' : '#ccc'}
          />
        </TouchableOpacity>
        <Text style={styles.agreeText}>
          I’ve read and agree with the{' '}
          <Text style={styles.link} onPress={() => openLink('https://example.com/terms')}>
            Terms and Conditions
          </Text>{' '}
          and the{' '}
          <Text style={styles.link} onPress={() => openLink('https://example.com/privacy')}>
            Privacy Policy
          </Text>.
        </Text>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity
        style={[styles.authButton, !agreed && styles.authButtonDisabled]}
        onPress={handleSignup}
        disabled={!agreed}
      >
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
    justifyContent: 'flex-start',  // 화면 상단부터 레이아웃 시작
    alignItems: 'center',
    paddingTop: 150,               // 위쪽 여유 공간
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    color: '#004225FF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',       // neutral-500 계열
    marginBottom: 24,       // 제목과 폼 사이 간격
    textAlign: 'center',    // 가운데 정렬을 원한다면
    marginBottom:130,
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

  // ← 추가된 스타일
  agreeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  agreeText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
    lineHeight: 20,
  },
  link: {
    color: '#004225FF',
    textDecorationLine: 'underline',
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
  authButtonDisabled: {
    backgroundColor: '#AAC7B8', // disabled 색상 예시
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