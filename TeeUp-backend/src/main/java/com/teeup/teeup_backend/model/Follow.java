package com.teeup.teeup_backend.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "follows")
// 인덱스 정의의 Key와 Value 사이, 작은따옴표 위치를 정확히
@CompoundIndex(def = "{ 'followerId': 1, 'followeeId': 1 }", unique = true)
public class Follow {
    // 1) ID 타입을 ObjectId로 변경
    @Id
    private ObjectId id;

    private String followerId;  // 팔로우를 건 사용자 ID
    private String followeeId;  // 팔로우된 사용자 ID

    private Instant createdAt;  // 팔로우 시각
}
