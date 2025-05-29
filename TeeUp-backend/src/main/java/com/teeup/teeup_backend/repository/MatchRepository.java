package com.teeup.teeup_backend.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.User;

@Repository
public interface  MatchRepository extends MongoRepository<User, ObjectId>{
    
    Optional<User> findByUserId(ObjectId userId);

    List<User> findAll();
}
