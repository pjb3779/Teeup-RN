import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, WS_URL } from '@env';

export async function getLoginId() {
  return AsyncStorage.getItem('loginId');
}
export async function getToken() {
  return AsyncStorage.getItem('userToken');
}

export const API_BASE_DEFAULT = API_BASE_URL;
export const WS_URL_DEFAULT   = WS_URL;