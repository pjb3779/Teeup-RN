package com.teeup.teeup_backend.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.teeup.teeup_backend.model.Comment;
import com.teeup.teeup_backend.model.Post;
import com.teeup.teeup_backend.repository.CommentRepository;
import com.teeup.teeup_backend.repository.PostRepository;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.model.User;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 게시물의 댓글들 전부 조회하기 
    public List<Comment> getCommentsByPost(String postId) {
        
        ObjectId oid;
        try {
            oid = new ObjectId(postId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid postId format");
        }
        if (!postRepository.existsById(oid)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Post not found");
        }

        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
    

    // 댓글 추가하기 
    @Transactional
    public Comment addComment(String postId, String authorId, String content, String parentId) {
        // 1) postId → ObjectId 변환
        ObjectId pid;
        try {
            pid = new ObjectId(postId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid postId format");
        }
        Post post = postRepository.findById(pid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        // 2) authorId는 String loginId이므로 ObjectId 변환 NO
        User author = userRepository.findByLoginId(authorId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 3) Comment 객체 생성 및 저장
        Comment c = new Comment();
        c.setPostId(post.getId().toString());
        c.setAuthorId(author.getLoginId());
        c.setContent(content);
        c.setAuthorAvatarUrl(author.getAvatarUrl());


        if (parentId != null) {
            // parentId도 String이므로 그대로 사용
            commentRepository.findById(parentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found"));
            c.setParentId(parentId);
        }

        return commentRepository.save(c);
    }


    @Transactional
    public int toggleLike(String commentId, String userLoginId) {
        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Comment not found"
            ));

        List<String> likedBy = c.getLikeBy();
        if (likedBy.contains(userLoginId)) {
            likedBy.remove(userLoginId);
        } else {
            likedBy.add(userLoginId);
        }

        c.setLikeBy(likedBy);
        commentRepository.save(c);
        return likedBy.size();
    }

    // 좋아요 누른 사람들 리스트 형태로 가져오기
    @Transactional(readOnly = true)
    public List<String> getLikedUsers(String commentId){

        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Comment not found"
            ));

        return c.getLikeBy(); 
    }
}
