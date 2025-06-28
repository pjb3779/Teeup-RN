import { API_BASE_URL } from '@env';

/**
 * 현재 위치(lat/lng)를 백엔드에 보내고
 * country, state, city 주소를 받아온다
 */
export const fetchNearestLocation = async (loginId, lat, lng) => {
    const url = `${API_BASE_URL}/api/locations/nearest?loginId=${loginId}&lat=${lat}&lng=${lng}`;
    console.log('요청 URL:', url);

    const res = await fetch(url);
    console.log('res.ok:', res.ok, 'status:', res.status);

    if (!res.ok) {
        const text = await res.text();
        console.log('서버 에러 응답:', text);
        throw new Error('위치 정보 요청 실패 프론트');
    }
    return await res.json();   //나라 주 도시
}