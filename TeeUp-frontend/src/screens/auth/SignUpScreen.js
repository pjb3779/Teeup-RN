import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 아이콘 라이브러리
import { signup } from '../../services/authService'; // 회원가입 API 호출 함수
import { Picker } from '@react-native-picker/picker';

export default function SignUpScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [golfLevel, setGolfLevel] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!loginId || !password || !nickname || !age || !golfLevel || !gender) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    try {
      await signup({ 
        loginId,
        password,
        // nickname,
        // gender,
        // age: parseInt(age),
        // golf_level: golfLevel 
      });
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('error 전체:', error);
      console.log('error.response:', error.response);
      console.log('error.response.data:', error.response?.data);

      let message = '오류가 발생했습니다.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (typeof error.response.data === 'object') {
          message = error.response.data.message || message;
        }
      }

      Alert.alert('회원가입 실패', message);
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
            value={loginId}           // 수정된 부분
            onChangeText={setLoginId} // 수정된 부분
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

      {/* Nickname 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nickname</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="person" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter nickname"
            placeholderTextColor="#aaa"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
      </View>

      {/* 성별 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="wc" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter gender (남/여)"
            placeholderTextColor="#aaa"
            value={gender}
            onChangeText={setGender}
          />
        </View>
      </View>

      {/* 나이 입력*/}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="calendar-today" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>
      </View>

      {/* 골프 레벨 입력 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Golf Level</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="golf-course" size={20} color="#aaa" />
          <Picker
            style={{ flex: 1 }}
            selectedValue={golfLevel}
            onValueChange={(itemValue) => setGolfLevel(itemValue)}
          >
            <Picker.Item label="Select level" value="" />
            <Picker.Item label="초급" value="초급" />
            <Picker.Item label="중급" value="중급" />
            <Picker.Item label="고급" value="고급" />
          </Picker>
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
