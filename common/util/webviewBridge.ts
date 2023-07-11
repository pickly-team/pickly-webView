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
