package com.teeup.teeup_backend.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.ChatRoom;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, ObjectId> {

    /**
     * 두 사용자의 채팅방 조회 (userId1, userId2 중복 관계 허용)
     * 
     * @param userId1 사용자1 ObjectId
     * @param userId2 사용자2 ObjectId
     * @return 존재하는 채팅방 Optional
     */
    Optional<ChatRoom> findByUserId1AndUserId2(ObjectId userId1, ObjectId userId2);

    /**
     * userId1 또는 userId2가 해당 사용자일 경우 채팅방 목록 조회
     * (예: 특정 사용자의 모든 채팅방)
     */
    List<ChatRoom> findByUserId1OrUserId2(ObjectId userId1, ObjectId userId2);

}
