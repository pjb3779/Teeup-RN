package com.teeup.teeup_backend.util;

/**
 * 위도ㅡ 경도를 이용한 거리 계산 도구 클래스 (Haversine 공식 이용)
 */
public class DistanceUtil {
    
    /**
     * 두 좌표 사이의 거리 계산 (단위: km)
     */
    public static double calculate(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371; // 지구 반지름 (km)

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
