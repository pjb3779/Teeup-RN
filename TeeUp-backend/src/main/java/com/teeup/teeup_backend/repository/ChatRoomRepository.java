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
     * 두 사용자의 채팅방 조회 (loginId1, loginId2 중복 관계 허용)
     *
     * @param loginId1 사용자1 loginId
     * @param loginId2 사용자2 loginId
     * @return 존재하는 채팅방 Optional
     */
    Optional<ChatRoom> findByLoginId1AndLoginId2(String loginId1, String loginId2);

    /**
     * loginId1 또는 loginId2가 해당 사용자일 경우 채팅방 목록 조회
     * (예: 특정 사용자의 모든 채팅방)
     */
    List<ChatRoom> findByLoginId1OrLoginId2(String loginId1, String loginId2);
}
