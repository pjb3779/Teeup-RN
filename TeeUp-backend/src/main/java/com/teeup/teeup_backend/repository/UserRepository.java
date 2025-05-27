package com.teeup.teeup_backend.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.User;


// MongoDB의 users 컬렉션과 연동되는 Repository
@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    // userid로 사용자 검색 (로그인에 사용)
    Optional<User> findByUserid(String userid);
}
