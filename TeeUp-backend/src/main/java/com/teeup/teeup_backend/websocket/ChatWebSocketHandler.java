package com.teeup.teeup_backend.websocket;

import java.net.URI;
import java.util.List;
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
    /**
     * loginId → WebSocketSession 저장용
     * (추후 로그인 연동 후 loginId 확보 필요)
     */
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    /**
     * sessionId → loginId 저장
     * (연결 종료 시 매핑 해제용)
     */
    private final Map<String, String> sessionIdToLoginId = new ConcurrentHashMap<>();

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 클라이언트와 연결이 성공하면 호출되는 콜백
     * 연결된 세션을 sessions 맵에 저장합니다.
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("📍 새 WebSocket 연결: {}", session.getId());

        // 웹 소켓 연결 시 URI 쿼리에서 loginId 추출
        URI uri = session.getUri();
        String loginId = null;
        String roomId = null;

        if (uri != null && uri.getQuery() != null) {
            Map<String, String> queryParams = parseQueryParams(uri.getQuery());
            loginId = queryParams.get("loginId");
            roomId = queryParams.get("roomId");
        }

        if (loginId == null || loginId.isEmpty()) {
            session.close();
            log.warn("loginId 누락으로 연결 종료 - 세션ID: {}", session.getId());
            return;
        }

        // loginId를 key로 세션 저장
        sessions.put(loginId, session);
        sessionIdToLoginId.put(session.getId(), loginId);

        log.info("✅ 유저 연결됨: loginId={}, sessionId={}", loginId, session.getId());

        // ✅ roomId가 있으면 미수신 메시지 내려주기
        if (roomId != null && !roomId.isEmpty()) {
            List<Message> pendingMessages = chatService.findMessagesForUser(loginId, roomId);
            for (Message m : pendingMessages) {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(m)));
            }
        }
    }

    /**
     * 클라이언트로부터 텍스트 메시지를 수신하면 호출되는 콜백
     * 현재는 모든 접속 세션에 메시지를 브로드캐스트하는 예시 코드입니다.
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("📍 메시지 수신: {}", payload);

        // JSON → ChatMessageDto 변환
        ChatMessageDto chatMessage = objectMapper.readValue(payload, ChatMessageDto.class);

        // DB 저장
        Message savedMessage = chatService.saveMessage(chatMessage);

        // 수신자 loginId로 세션 찾아 전송
        WebSocketSession receiverSession = sessions.get(chatMessage.getReceiverId());

        if (receiverSession != null && receiverSession.isOpen()) {
            receiverSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(savedMessage)));
        } else {
            log.warn("수신자 세션 없음 또는 닫힘: loginId={}", chatMessage.getReceiverId());
        }

        // 발신자에게도 메시지 전송 (본인 화면 업데이트용)
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
        String loginId = sessionIdToLoginId.get(sessionId);

        if (loginId != null) {
            sessions.remove(loginId);
            sessionIdToLoginId.remove(sessionId);
            log.info("📍 유저 연결 종료: loginId={}, sessionId={}", loginId, sessionId);
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
