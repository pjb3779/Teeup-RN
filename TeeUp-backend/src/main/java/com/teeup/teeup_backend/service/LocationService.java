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

    @Value("${google.api.key}")
    private String googleApiKey;

    private final RestTemplate restTemplate;
    private final LocationRepository locationRepository;

    public LocationDto findNearest(String loginId, double lat, double lng) {
        String url = String.format(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&language=ko&key=%s",
            lat, lng, googleApiKey
        );

        try {
            log.info("📍 google API 호출전");
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            log.info("📍 google API 호출후");

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Google API 호출 실패");
            }

            LocationDto locationDto = parseLocationFromJson(response.getBody());

            Location saved = new Location(
                new ObjectId(),
                loginId,
                locationDto.getCountry(),
                locationDto.getState(),
                locationDto.getCity(),
                lat, lng
            );
            locationRepository.save(saved);

            return locationDto;

        } catch (Exception e) {
            log.error("❌ 구글 API 호출 실패: {}", e.getMessage(), e);
            throw new RuntimeException("구글 API 호출 실패", e);
        }
    }

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
