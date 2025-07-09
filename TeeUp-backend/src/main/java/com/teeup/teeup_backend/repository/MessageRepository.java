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

    //룸아이디에서 메세지 가져오기
    List<Message> findByRoomIdAndReceiverId(ObjectId roomId, String receiverId);

    /*
     * 해당 채팅룸의 메세지 조회
     */
    List<Message> findByRoomId(ObjectId roomId);
}
