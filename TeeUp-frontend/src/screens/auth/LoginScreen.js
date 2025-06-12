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
import { login } from '../../services/authService';
import Main from '../main/HomeScreen'; // 로그인 후 메인 화면
import useUserStore from '../../store/userStore';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation, onLogin }) {
  const [userid, setUserid] = useState('');  // email을 userid로 변경
  const [password, setPassword] = useState('');  // 비밀번호 상태
  const [showPassword, setShowPassword] = useState(false);  // 비밀번호 보이기 여부 상태
  const setUser = useUserStore((state) => state.setUser);
  
  // 로그인 함수
  const handleLogin = async () => {
    console.log('로그인 시도중');
    if (!userid || !password) {  // 이메일과 비밀번호가 비어있는지 확인
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const { token, user } = await login(userid, password);;  // 서버와 로그인 요청
      console.log('로그인 성공, 토큰:', token);  // 토큰을 console에 출력 (개발 중)
      setUser(user);
      //Alert.alert('로그인 성공', 환영합니다! ${user.nickname}); 

      onLogin();  // 로그인 성공 시 홈 화면으로 이동
    } catch (error) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 틀렸습니다.');
       console.log('로그인 실패');
      console.error(error);
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
        />
        <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
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

const BUTTON_WIDTH = width * 0.85;

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
    justifyContent: 'center',    // 가운데 정렬
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