// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import * as Notifications from 'expo-notifications';
import { setupNotification } from './src/utils/setupNotification';
import { ensureWsConnected } from './src/utils/ws.js';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// 포그라운드에서도 배너 보이기
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // 1) 알림 권한/채널
    setupNotification();

    // 2) 전역 WS 연결 (개인 토픽 구독 → 로컬 알림)
    ensureWsConnected();

    // 3) 알림 클릭 시 라우팅
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      try {
        const roomId = resp?.notification?.request?.content?.data?.roomId;
        if (!roomId) return;

        // ❗네비 구조에 맞춰 한쪽만 쓰면 됨
        if (navigationRef.isReady()) {
          // (A) 루트에 ChatScreen이 바로 있다면:
          // navigationRef.navigate('ChatScreen', { roomId });

          // (B) 탭/스택 중첩 구조(예: ChatStack 안에 ChatScreen):
          navigationRef.navigate('ChatStack', {
            screen: 'ChatScreen',
            params: { roomId },
          });
        }
      } catch (e) {
        console.log('navigate from notification error', e);
      }
    });

    return () => {
      sub && Notifications.removeNotificationSubscription?.(sub);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
}