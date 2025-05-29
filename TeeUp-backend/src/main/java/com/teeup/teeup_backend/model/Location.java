package com.teeup.teeup_backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    private ObjectId id;
    
    private ObjectId userId;

    private String country;
    private String state;
    private String city;
    private double lat;     //위도
    private double lng;     //경도도
}
