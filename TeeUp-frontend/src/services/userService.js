import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '@env'; 

export const getUserProfile = async () => {

    const token = await AsyncStorage.getItem('userToken');
    const loginId  = await AsyncStorage.getItem('loginId');

    console.log('토큰:', token); // 토큰 확인용 로그
    if (!token || !loginId) {
        throw new Error('로그인이 필요합니다.');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { loginId },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
        const msg =
            typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || '프로필 조회 실패';
        throw new Error(msg);
        } else if (error.request) {
        throw new Error('서버 응답이 없습니다. 네트워크를 확인해주세요.');
        } else {
        throw new Error(error.message);
        }
    }
};

export const updateUserProfile = async (profileData) => {
    
    const loginId  = await AsyncStorage.getItem('loginId');

    try{
        const response = await axios.put(`${API_BASE_URL}/api/profile/edit`, profileData, {
            headers: { loginId },
        });
        return response.data;
    }
    catch (error) {
        if (error.response) {
        const msg =
            typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || '프로필 수정 실패';
        throw new Error(msg);
        } else if (error.request) {
        throw new Error('서버 응답이 없습니다. 네트워크를 확인해주세요.');
        } else {
        throw new Error(error.message);
        }
    }

}