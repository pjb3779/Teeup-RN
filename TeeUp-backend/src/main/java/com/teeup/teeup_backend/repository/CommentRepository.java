package com.teeup.teeup_backend.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.Comment;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    
    // postId 로 댓글 조회
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}
