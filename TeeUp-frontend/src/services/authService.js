import axios from 'axios';

const API_URL = 'http://10.193.133.227:8080/api'; // 스프링 서버의 URL을 적어주세요.

//로그인 요청
export const login = async (userid, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      userid,
      password,
    });
    console.log('로그인 요청 성공');
    const { token } = response.data;
    return token;  // 토큰을 반환
  } catch (error) {
    console.error('로그인 실패ㅠㅠ:', error.response?.data || error.message);
    throw new Error('로그인 실패');
  }
};

// 회원가입 요청
export const signup = async ({ userid, password, nickname }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      userid,
      password,
      nickname,
    });
    console.log('회원가입 요청 성공');
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw new Error('회원가입 실패');
  }
};