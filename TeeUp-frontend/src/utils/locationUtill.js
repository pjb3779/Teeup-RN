import * as Location from 'expo-location';

/**
 * 위치 권한 요청 + 현재 위도/경도 가져오기
 */
export const getCurrentLocation = async () => {
    //위치 권한 요청청
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('위치 권한이 거부되었습니다.');
  }

  //현재 위치 가져오기기
  const { coords } = await Location.getCurrentPositionAsync({});
  return {
    latitude: coords.latitude,
    longitude: coords.longitude
  };
};
