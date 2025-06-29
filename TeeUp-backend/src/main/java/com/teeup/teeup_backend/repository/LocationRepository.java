package com.teeup.teeup_backend.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.Location;

@Repository
public interface LocationRepository extends MongoRepository<Location, ObjectId> {

    Optional<Location> findById(ObjectId id);

    Optional<Location> findByLoginId(String loginId);
}
