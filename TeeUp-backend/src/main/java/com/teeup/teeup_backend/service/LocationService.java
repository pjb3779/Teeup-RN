package com.teeup.teeup_backend.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teeup.teeup_backend.dto.LocationDto;
import com.teeup.teeup_backend.model.Location;
import com.teeup.teeup_backend.repository.LocationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    @Value("${google.api.key}") // application.yml 또는 .properties에 있는 Google API 키 주입
    private String googleApiKey;

    private final RestTemplate restTemplate = new RestTemplate(); // 외부 API 호출용 HTTP 클라이언트
    private final LocationRepository locationRepository; // MongoDB 저장용 레포지토리

    /**
     * 위도/경도를 기반으로 Google Geocoding API를 호출하고,
     * country/state/city 정보를 파싱하여 LocationDto로 반환하며,
     * DB에 저장까지 수행함.
     */
    public LocationDto findNearest(ObjectId userId, double lat, double lng) {
        // Google Maps Geocoding API 호출 URL 생성
        String url = String.format(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&language=ko&key=%s",
            lat, lng, googleApiKey
        );

        // Google API 호출
        log.info("📍 google API 호출전");
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        log.info("📍 google API 호출후");
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Google API 호출 실패");
        }

        // JSON 응답 파싱해서 행정 주소 추출
        LocationDto locationDto = parseLocationFromJson(response.getBody());

        // 파싱된 주소 정보를 MongoDB에 저장
        Location saved = new Location(
            new ObjectId(),                         // ID 생성
            userId,
            locationDto.getCountry(),               // 국가 코드 (예: KR)
            locationDto.getState(),                 // 도/광역시
            locationDto.getCity(),                  // 시/구
            lat, lng                                 // 사용자의 실제 위도/경도 저장
        );
        locationRepository.save(saved); // MongoDB에 저장

        return locationDto; // 프론트에 전달할 DTO 반환
    }

    /**
     * Google API의 JSON 응답을 파싱해서 국가, 시/도, 시/군/구 정보 추출
     */
    private LocationDto parseLocationFromJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            JsonNode results = root.get("results");
            if (results == null || results.isEmpty()) {
                throw new RuntimeException("주소 결과 없음");
            }

            String country = null, state = null, city = null;
            JsonNode addressComponents = results.get(0).get("address_components");

            for (JsonNode comp : addressComponents) {
                JsonNode types = comp.get("types");
                if (types.isArray()) {
                    for (JsonNode type : types) {
                        switch (type.asText()) {
                            case "country" -> country = comp.get("short_name").asText();
                            case "administrative_area_level_1" -> state = comp.get("long_name").asText();
                            case "administrative_area_level_2", "locality", "sublocality" -> {
                                if (city == null) city = comp.get("long_name").asText();
                            }
                        }
                    }
                }
            }

            return new LocationDto(country, state, city);

        } catch (Exception e) {
            throw new RuntimeException("Google 응답 파싱 실패", e);
        }
    }

    
}
