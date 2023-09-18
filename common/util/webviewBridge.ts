import { RefObject } from 'react';
import WebView from 'react-native-webview';

interface BridgeParams {
  /** 웹뷰 종료 */
  browserExit: null;
  /** 웹뷰 로그인 */
  login: {
    token: string;
    memberId: number;
  };
  /** 초기화 */
  initialize: null;
  /** refetch */
  refetch: null;
  /** android url 공유 */
  androidShareUrl: {
    url: string;
  };
  /** 앱 버전 */
  appVersion: {
    version: string;
    buildNumber: string;
    platform: string;
  };
}

export function webviewBridge<T extends keyof BridgeParams>(
  ref: RefObject<WebView>,
  message: T,
  params: BridgeParams[T],
) {
  const checkObjectIsEmpty =
    params === null ||
    (params &&
      Object.keys(params).length === 0 &&
      params.constructor === Object);

  if (!checkObjectIsEmpty) {
    return wrapLoggingWithArg(() =>
      ref.current?.postMessage(JSON.stringify({ message, params })),
    );
  }
  if (checkObjectIsEmpty) {
    return wrapLoggingWithArg(() =>
      ref.current?.postMessage(JSON.stringify({ message })),
    );
  }

  return () => console.warn('message not exist');
}

const wrapLoggingWithArg =
  <T>(callback: (argument?: T) => void) =>
  () => {
    try {
      callback();
    } catch (e) {
      console.error(e);
    }
  };

export { wrapLoggingWithArg };
