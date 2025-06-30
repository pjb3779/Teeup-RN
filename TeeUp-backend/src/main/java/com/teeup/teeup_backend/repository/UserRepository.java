package com.teeup.teeup_backend.repository;

import java.util.List;              
import java.util.Optional;
import java.util.Spliterator.OfPrimitive;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.User;



// MongoDB의 users 컬렉션과 연동되는 Repository
@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    // loginid로 사용자 검색 (로그인에 사용)
    Optional<User> findByLoginId(String loginId);

    Optional<User> findByUserId(ObjectId userId);

    List<User> findByLoginIdIn(List<String> loginIds);
}
