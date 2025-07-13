import api from '../api';
import { API_BASE_URL } from '@env';

/**
 * [추천] 로그인한 사용자의 추천 버디 목록 불러오기
 * @param {string} loginId
 * @returns {Promise<Array>}
 */
export const fetchBuddyRecommendations = async (loginId) => {
  try {
    console.log('추천 버디 로그인 아이디:', loginId);
    const response = await api.get(`${API_BASE_URL}/api/match/recommendations`, {
      params: { loginId },
    });
    console.log('추천 버디 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('추천 버디 불러오기 실패:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || '추천 버디 불러오기에 실패했습니다.'
    );
  }
};

/**
 * [일반검색] 닉네임으로 버디 검색
 * @param {string} nickname
 * @returns {Promise<Array>}
 */
export const searchBuddiesSimple = async (nickname) => {
  try {
    console.log('일반검색 요청 nickname:', nickname);
    const response = await api.get(`${API_BASE_URL}/api/match/search`, {
      params: { nickname },
    });
    console.log('일반검색 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('일반검색 실패:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || '버디 일반검색에 실패했습니다.'
    );
  }
};

/**
 * [상세검색] 조건 기반 버디 검색
 * @param {Object} params
 *    nickname (string)
 *    gender (string)
 *    ageMin (number)
 *    ageMax (number)
 *    level (string)
 *    area (string)
 * @returns {Promise<Array>}
 */
export const searchBuddiesDetail = async (params) => {
  try {
    console.log('상세검색 요청 params:', params);
    const response = await api.get(`${API_BASE_URL}/api/match/search`, {
      params,
    });
    console.log('상세검색 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('상세검색 실패:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || '버디 상세검색에 실패했습니다.'
    );
  }
};
