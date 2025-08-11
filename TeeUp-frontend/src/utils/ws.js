// src/lib/ws.js
import { Client } from '@stomp/stompjs';
import * as Notifications from 'expo-notifications';
import { getLoginId, WS_URL_DEFAULT } from './session'; 

// ---- 현재 보고 있는 방 id (알림 억제용) ----
let currentRoomId = null;
export const setCurrentRoomId = (id) => { currentRoomId = id; };

// ---- 전역 메시지 리스너(목록 화면 등에서 실시간 갱신) ----
const listeners = new Set();
export function addMessageListener(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emitMessage(msg) {
  listeners.forEach((fn) => {
    try { fn(msg); } catch (e) { console.log('listener error', e); }
  });
}

let client = null;
let subscribedLoginId = null; // 중복 구독 방지

export async function ensureWsConnected() {
  // 이미 연결되어 있으면 그대로 반환
  if (client && client.connected) return client;

  const loginIdRaw = await getLoginId();
  const loginId = loginIdRaw ? String(loginIdRaw).trim() : null;
  if (!loginId) return null;

  // 클라이언트 생성
  client = new Client({
    webSocketFactory: () => {
      const ws = new WebSocket(WS_URL_DEFAULT, ['v12.stomp', 'v11.stomp', 'v10.stomp']);
      ws.onopen = () => console.log('WS protocol =', ws.protocol);
      return ws;
    },
    connectHeaders: { loginId },
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
    // RN 호환 옵션 (권장)
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,
  });

  client.onConnect = () => {
    console.log('[WS] connected as', loginId);
    // 이미 같은 로그인아이디로 구독했다면 재구독 방지
    if (subscribedLoginId === loginId) return;

    // 개인 토픽 구독 — 앱 전역에서 새 메시지 수신
    client.subscribe(`/topic/users/${loginId}`, async (frame) => {
      let msg;
      try { msg = JSON.parse(frame.body); }
      catch (e) { console.log('parse error', e); return; }

      // 같은 방을 보고 있으면 알림 생략 (원하면 제거)
      if (currentRoomId && currentRoomId === msg.roomId) {
        // 그래도 목록 갱신 이벤트는 전달
        emitMessage(msg);
        return;
      }
      // 내가 보낸 건 알림 X (이벤트는 전달)
      if (msg.senderLoginId === loginId) {
        emitMessage(msg);
        return;
      }

      // 로컬 알림
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${msg.senderLoginId}`,
            body: msg.content ?? '(첨부)',
            data: { roomId: msg.roomId },
          },
          trigger: null, // 즉시
        });
      } catch (e) {
        console.log('notify error', e);
      }

      // 화면 갱신 이벤트 브로드캐스트
      emitMessage(msg);
    });

    subscribedLoginId = loginId;
  };

  client.onStompError = (f) => {
    console.warn('[WS] STOMP error', f.headers, f.body);
  };
  client.onWebSocketClose = (evt) => {
    console.log('[WS] closed', evt?.code, evt?.reason);
    // 재연결 시 다시 구독할 수 있도록 플래그 초기화
    subscribedLoginId = null;
  };
  client.onDisconnect = () => {
    console.log('[WS] disconnected');
    subscribedLoginId = null;
  };

  client.activate();
  return client;
}

export function disconnectWs() {
  if (client) {
    try { client.deactivate(); } catch {}
    client = null;
    subscribedLoginId = null;
  }
}
