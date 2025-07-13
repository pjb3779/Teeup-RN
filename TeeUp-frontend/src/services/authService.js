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
      await AsyncStorage.setItem('loginId', user.loginId);
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
export const signup = async ({ loginId, password , email}) => {
  console.log('회원가입 요청 시도');
  console.log('회원가입 BASE_URL:', API_BASE_URL);
  console.log('회원가입 URL:', `${API_BASE_URL}/api/auth/signup`);
  console.log('회원가입 데이터:', { loginId, password , email});

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      loginId,
      password,
      email,
    });
    console.log('회원가입 요청 성공');
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error.response?.data || error.message);

    // 에러 코드가 409일 때, 중복된 회원 가입 처리
    if (error.response?.status === 409) {
      throw new Error('이미 존재하는 회원입니다. 다른 아이디를 시도해주세요.');
    }

    // 그 외 다른 오류 처리
    throw new Error(error.response?.data?.message || '오류가 발생했습니다.');
  }
};

// 프로필 업데이트 요청
export const updateProfile = async (
  {
    nickname,
    gender,
    age,
    golfLevel,
    // purpose,
    // area,
  },
  loginId
) => {
  console.log('프로필 업데이트 요청 시도');
  console.log('프로필 업데이트 BASE_URL:', API_BASE_URL);
  console.log('프로필 업데이트 URL:', `${API_BASE_URL}/api/profile/edit`);
  console.log('프로필 업데이트 데이터:', {
    nickname,
    gender,
    age,
    golfLevel,
    // purpose,
    // area,
  });
  console.log('실제 loginId header에 넣는 값:', loginId);

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.put(
      `${API_BASE_URL}/api/profile/edit`,
      {
        nickname,
        gender,
        age,
        golfLevel,
        // purpose,
        // area,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          loginId: loginId || '',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('프로필 업데이트 요청 성공');
    return response.data;
  } catch (error) {
    console.error(
      '프로필 업데이트 실패:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        '프로필 업데이트 중 오류가 발생했습니다.'
    );
  }
};
