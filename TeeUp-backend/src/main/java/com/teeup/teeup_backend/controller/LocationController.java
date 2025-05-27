package com.teeup.teeup_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.LocationDto;
import com.teeup.teeup_backend.service.LocationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Slf4j
public class LocationController {
    
    @Autowired
    private LocationService locationService;

    /**
     *  사용자의 현재 위도, 경도를 사용해 가장 가까운 지역을 반환하는 API
     */
    @GetMapping("/nearest")
    public ResponseEntity<LocationDto> getNearestCity(@RequestParam double lat, @RequestParam double lng) {
        log.info("📍 위치 요청 받음: lat={}, lng={}", lat, lng);


        LocationDto location = locationService.findNearest(lat, lng);
        return ResponseEntity.ok(location);
    }
}
