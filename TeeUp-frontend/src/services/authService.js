import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env'; // 스프링 서버의 URL을 적어주세요.

//로그인 요청
export const login = async (loginId, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      loginId,
      password,
    });
    console.log('로그인 요청 성공');
    const { token, user } = response.data;

    try {
      await AsyncStorage.setItem('userToken', token);
      console.log('토큰 저장 성공:', token);
    } catch (e) {
      console.error('❌ 토큰 저장 실패:', e);
    }
    
    return { token, user };
  } catch (error) {
    console.error('로그인 실패ㅠㅠ:', error.response?.data || error.message);
    throw new Error('로그인 실패');
  }
};

// 회원가입 요청
export const signup = async ({ loginId, password }) => {
  console.log('회원가입 요청 시도');
  console.log('BASE_URL:', API_BASE_URL);  // BASE_URL 확인
  console.log('회원가입 URL:', `${API_BASE_URL}/api/auth/signup`);  // 실제 요청 URL 확인
  console.log('회원가입 데이터:', { loginId, password });  // 보내는 데이터 확인

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      loginId,
      password,
    });
    console.log('회원가입 요청 성공');
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw new Error('회원가입 요청 실패');
  }
};