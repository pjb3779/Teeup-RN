package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 채팅방 정보 Document
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_rooms")
public class ChatRoom {

    @Id
    private ObjectId roomId;            // 채팅방 고유 ID
    
    @Indexed
    private String loginId1;       // 채팅 참여자 1
    @Indexed
    private String loginId2;       // 채팅 참여자 2
    private String lastMessage;     // 마지막 메시지 내용
    private LocalDateTime lastUpdated; // 마지막 메시지 전송 시간

    /**
     * 항상 loginId1 < loginId2 되도록 정렬해서 생성
     */
    public static ChatRoom createSortedRoom(String id1, String id2) {
        if (id1.compareTo(id2) < 0) {
            return ChatRoom.builder()
                    .loginId1(id1)
                    .loginId2(id2)
                    .lastUpdated(LocalDateTime.now())
                    .build();
        } else {
            return ChatRoom.builder()
                    .loginId1(id2)
                    .loginId2(id1)
                    .lastUpdated(LocalDateTime.now())
                    .build();
        }
    }
}
