package com.teeup.teeup_backend.repository;

import com.teeup.teeup_backend.model.Post;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository; 
import java.util.List;

public interface PostRepository extends MongoRepository<Post, ObjectId> {
    
    // 특정 사용자의 게시글 목록 조회
    List<Post> findByAuthorId(String authorId);
    // 특정 카테고리의 게시글 목록 조회
    List<Post> findByCategory(String category);
    // 특정 위치의 게시글 목록 조회
    List<Post> findByLocation(String location);
    
}
