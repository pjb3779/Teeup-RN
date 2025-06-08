package com.teeup.teeup_backend.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.teeup.teeup_backend.model.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId>{
    
    // 특정 채팅방(roomId) 메시지 목록을 timestamp 기준 오름차순 정렬하여 조회
    List<Message> findByRoomIdOrderByTimestampAsc(ObjectId roomId);

}
