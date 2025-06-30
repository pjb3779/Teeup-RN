import api from '../api'

/**
 * 로그인한 사용자의 추천 버디 목록을 불러온다.
 * 실패 시 하드코딩된 가짜 데이터 반환.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const fetchBuddyRecommendations = async (userId) => {
  try {
    const response = await api.get(`/match/recommendations`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('추천 버디 불러오기 실패:', error.message);

    // 실패 시 하드코딩된 임시 추천 목록 반환
    return [
      {
        id: 'fake1',
        nickname: '홍길동',
        golf_level: '중급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
      {
        id: 'fake2',
        nickname: '김버디',
        golf_level: '초급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
      {
        id: 'fake3',
        nickname: '김준하하',
        golf_level: '고급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
      {
        id: 'fake4',
        nickname: '김준준',
        golf_level: '고급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
      {
        id: 'fake5',
        nickname: '김하하하',
        golf_level: '고급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
      {
        id: 'fake6',
        nickname: '에효효',
        golf_level: '고급자',
        avatar_url: 'https://via.placeholder.com/100',
      },
    ];
  }
};
