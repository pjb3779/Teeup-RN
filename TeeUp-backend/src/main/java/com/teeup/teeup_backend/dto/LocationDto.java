package com.teeup.teeup_backend.dto;

import com.teeup.teeup_backend.model.Location;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDto {
    private String country;
    private String state;
    private String city;

    public static LocationDto from(Location location) {
        return new LocationDto(location.getCountry(), location.getState(), location.getCity());
    }
}
