package com.teeup.teeup_backend.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.teeup.teeup_backend.model.ChatRoom;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, ObjectId> {
    Optional<ChatRoom> findByRoomKey(String roomKey);
    List<ChatRoom> findByMembersContainsOrderByUpdatedAtDesc(String loginId);
}
