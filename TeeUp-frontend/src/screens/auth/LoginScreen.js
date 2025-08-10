import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/authService';
import useUserStore from '../../store/userStore';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.85;

export default function LoginScreen({ navigation, onLogin }) {
  const [userid, setUserid] = useState('');       // 로그인 아이디 (email 대신 userid)
  const [password, setPassword] = useState('');   // 비밀번호
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 토글
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      if (!userid || !password) {
        Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }

      console.log('로그인 시도중');
      const { token, user } = await login(userid, password); // user.loginId 내려오도록 보장
      console.log('로그인 성공, 토큰:', token);

      // 글로벌 스토어 업데이트
      setUser(user);

      // ✅ 채팅/인증에 필요한 값 저장
      await AsyncStorage.multiSet([
        ['loginId', user?.loginId ?? userid], // 백엔드에서 loginId 주면 그 값, 없으면 입력값 사용
        ['userToken', token],
      ]);

      // 필요하면 환영 메시지
      // Alert.alert('로그인 성공', `환영합니다! ${user?.nickname ?? user?.loginId ?? userid}`);

      // 콜백 있으면 호출, 없으면 기본 네비게이션
      if (onLogin) onLogin();
      else navigation.replace('RoomsList'); // 네비 구조에 맞게 수정 가능
    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <Image
        source={require('../../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* 제목 */}
      <Text style={styles.title}>Welcome!</Text>

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
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Password 입력 */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock-outline" size={20} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity
        style={styles.forgot}
        onPress={() => Alert.alert('비밀번호 찾기', '비밀번호 찾기 화면으로 이동')}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Login 버튼 */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* 회원가입 링크 */}
      <View style={styles.signupPrompt}>
        <Text style={styles.signupText}>Not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Register now</Text>
        </TouchableOpacity>
      </View>

      {/* OR 구분선 */}
      <View style={styles.orWrapper}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* 소셜 로그인 버튼 */}
      <View style={styles.socialWrapper}>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="apple" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="facebook-square" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#004225',
  },
  inputGroup: {
    width: BUTTON_WIDTH,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: BUTTON_WIDTH,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  forgot: {
    width: BUTTON_WIDTH,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  forgotText: {
    color: '#004225',
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    width: BUTTON_WIDTH,
    height: 52,
    backgroundColor: '#004225',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signupLink: {
    color: '#004225',
    fontSize: 14,
    fontWeight: '600',
  },
  orWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: BUTTON_WIDTH,
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  socialWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: BUTTON_WIDTH,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
});
