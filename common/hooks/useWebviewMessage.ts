import { useCallback } from 'react';
import { WebViewMessageEvent } from 'react-native-webview';

export interface PostBridgeParams {
  /** 웹뷰 로그인 */
  login: null;
  /** 알림 */
  notification: null;
  /** 페이지 뒤로 가기 */
  goBack: null;
  /** 회원가입 */
  signUp: null;
  /** 북마크 방문 */
  visitBookmark: {
    url: string;
  };
  /** 진동 */
  vibrate: null;
  /** 이메일 */
  email: null;
  /** 새로고침 */
  refetch: null;
  /** 안드로이드 공유 종료 */
  androidSharedEnd: null;
  /** 앱 버전 */
  appVersion: null;
}

interface WebviewOnMessage {
  message: keyof PostBridgeParams;
  params: PostBridgeParams[keyof PostBridgeParams];
}

export const useWebViewMessages = (handlers: {
  onLogin?: (data: WebviewOnMessage) => void;
  onNotification?: () => void;
  onGoBack?: () => void;
  onSignUp?: () => void;
  onVisitBookmark?: (params: { url: string }) => void;
  onVibrate?: () => void;
  onEmail?: () => void;
  onRefetch?: () => void;
  onAndroidSharedEnd?: () => void;
  onAppVersion?: () => void;
}) => {
  const onWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = JSON.parse(event.nativeEvent.data) as WebviewOnMessage;

      switch (data.message) {
        case 'login':
          handlers.onLogin?.(data);
          break;
        case 'notification':
          handlers.onNotification?.();
          break;
        case 'goBack':
          handlers.onGoBack?.();
          break;
        case 'signUp':
          handlers.onSignUp?.();
          break;
        case 'visitBookmark':
          handlers.onVisitBookmark?.(data.params as { url: string });
          break;
        case 'vibrate':
          handlers.onVibrate?.();
          break;
        case 'email':
          handlers.onEmail?.();
          break;
        case 'refetch':
          handlers.onRefetch?.();
          break;
        case 'androidSharedEnd':
          handlers.onAndroidSharedEnd?.();
          break;
        case 'appVersion':
          handlers.onAppVersion?.();
          break;
        default:
          break;
      }
    },
    [handlers],
  );

  return onWebViewMessage;
};
