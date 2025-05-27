import { API_BASE_URL } from '@env';

/**
 * 현재 위치(lat/lng)를 백엔드에 보내고
 * country, state, city 주소를 받아온다
 */
export const fetchNearestLocation = async (lat, lng) => {
    const res = await fetch('${API_BASE_URL}/api/locations/nearest?lat=${lat}&lng=${lng}');
    if(!res.ok) {
        throw new Error('위치 정보 요청 실패 프론트');
    }
    return await res.json();    //나라 주 도시
}