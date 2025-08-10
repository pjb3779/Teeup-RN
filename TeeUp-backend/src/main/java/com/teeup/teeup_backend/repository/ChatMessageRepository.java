package com.teeup.teeup_backend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.teeup.teeup_backend.model.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, ObjectId> {
    Page<ChatMessage> findByRoomIdOrderByCreatedAtDesc(ObjectId roomId, Pageable pageable);
}