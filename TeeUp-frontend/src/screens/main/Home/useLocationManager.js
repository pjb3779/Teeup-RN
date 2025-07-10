import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { fetchNearestLocation } from '../../../services/locationService';

export default function useLocationManager(loginId) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('위치 권한 거부됨');
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        console.log('현재 위치 좌표:', pos.coords);

        const loc = await fetchNearestLocation(
          loginId,
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log('백에서 받은 위치정보:', loc);

        setLocation(loc);
      } catch (e) {
        console.log('위치 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [loginId]);

  return { location, loading };
}