package com.teeup.teeup_backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class BuddySearchRequest {
    private String gender;
    private Integer ageMin;
    private Integer ageMax;
    private List<String> purposeIds;
    private String level;
    private Double lat;
    private Double lng;
    private Double radius;  //추후 위치기반 검색 예시 반경 5키로내 등등
    private LocalDate date;
}
