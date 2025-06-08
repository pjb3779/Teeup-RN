package com.teeup.teeup_backend.websocket;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teeup.teeup_backend.dto.ChatMessageDto;
import com.teeup.teeup_backend.model.Message;
import com.teeup.teeup_backend.service.ChatService;

import lombok.extern.slf4j.Slf4j;

/**
 * WebSocket 메시지 처리 핸들러
 * - 클라이언트와 WebSocket 연결 관리
 * - 메시지 수신 및 브로드캐스트 처리
 */
@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private ChatService chatService;

    // userId → WebSocketSession 저장용 (추후 로그인 연동 후 userId 확보 필요)
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // sessionId → userId 저장 (종료 시 매핑 해제용)
    private final Map<String, String> sessionIdToUserId = new ConcurrentHashMap<>();

    // 클래스 내 필드로 ObjectMapper 선언
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 클라이언트와 연결이 성공하면 호출되는 콜백
     * 연결된 세션을 sessions 맵에 저장합니다.
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("📍 새 WebSocket 연결: " + session.getId());

        //웹 소켓 연결 시 URI 쿼리에서 userId추출출 
        URI uri = session.getUri();
        String userId = null;
        if (uri != null && uri.getQuery() != null) {
            Map<String, String> queryParams = parseQueryParams(uri.getQuery());
            userId = queryParams.get("userId");
        }

        if (userId == null || userId.isEmpty()) {
            // userId 없으면 연결 종료 처리 (또는 예외 발생)
            session.close();
            log.warn("userId 누락으로 연결 종료 - 세션ID: " + session.getId());
            return;
        }
        
        //userId를 key로 세션 저장
        sessions.put(userId, session);
        sessionIdToUserId.put(session.getId(), userId);

        log.info("유저 연결됨: userId={}, sessionId={}", userId, session.getId());
    }

    /**
     * 클라이언트로부터 텍스트 메시지를 수신하면 호출되는 콜백
     * 현재는 모든 접속 세션에 메시지를 브로드캐스트하는 예시 코드입니다.
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("📍 메시지 수신: " + payload);

        ChatMessageDto chatMessage = objectMapper.readValue(payload, ChatMessageDto.class);

        // DB 저장
        Message savedMessage = chatService.saveMessage(chatMessage);

        WebSocketSession receiverSession = sessions.get(chatMessage.getReceiverId());

        if (receiverSession != null && receiverSession.isOpen()) {
            receiverSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(savedMessage)));
        } else {
            log.warn("수신자 세션 없음 or 닫힘: userId={}", chatMessage.getReceiverId());
        }

        //발신자에게도 메시지 전송 (본인 화면 업데이트용)
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(savedMessage)));
        }
    }

    /**
     * 클라이언트와의 연결이 종료되면 호출되는 콜백
     * 종료된 세션을 sessions 맵에서 제거합니다.
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        String userId = sessionIdToUserId.get(sessionId);

        if(userId != null) {
            sessions.remove(userId);
            sessionIdToUserId.remove(sessionId);
            log.info("📍유저 연결 종료: userId={}, sessionId={}", userId, sessionId);
        }
    }

    /**
     * 쿼리 스트링을 Map으로 변환하는 유틸 함수
     */
    private Map<String, String> parseQueryParams(String query) {
        return Stream.of(query.split("&"))
                .map(param -> param.split("="))
                .filter(arr -> arr.length == 2)
                .collect(Collectors.toMap(arr -> arr[0], arr -> arr[1]));
    }
}
