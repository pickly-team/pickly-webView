import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useGETMemberInfo, useGetMemberId } from '../auth/api/login';
import useAuthContext from '../auth/useAuthContext';
import useAppState from '../common/hooks/useAppState';
import { useBackHandler } from '../common/hooks/useBackHandler';
import useClipboard from '../common/hooks/useClipboard';
import usePageAnimation, { MODE } from '../common/hooks/usePageAnimation';
import useSharedData from '../common/hooks/useSharedData';
import { useWebViewMessages } from '../common/hooks/useWebviewMessage';
import webviewStore from '../common/state/webview';
import Loading from '../common/ui/Loading';
import { webviewBridge } from '../common/util/webviewBridge';
import Colors from '../constants/Colors';
import useNotification from '../notification/hooks/useNotification';
import { navigationRef } from './_layout';

const webviewURL: Record<MODE, (id?: number) => string> = {
  SIGN_IN: () => '',
  SIGN_UP: (id?: number) => `/user/${id}`,
};

const App = () => {
  // 페이지 전환 애니메이션
  const {
    clientUrl,
    currentUrl,
    webviewOpacityValue,
    handleNavigationStateChange,
    setIsGoingBack,
    setAnimationStarted,
    setNoAnimation,
  } = usePageAnimation();

  const webviewRef = useRef<WebView>(null);
  const { user } = useAuthContext();

  const [mode, setMode] = useState<MODE>('SIGN_IN');
  const [loading, setLoading] = useState(true);

  const navigator = useNavigation();
  useEffect(() => {
    navigator.setOptions({
      gestureEnabled: false,
    });
  }, []);

  // 사용자의 뒤로가기 버튼을 제거
  const [exitApp, setExitApp] = useState(false);

  useBackHandler(() => {
    if (webviewRef?.current) {
      if (currentUrl === `${clientUrl}/`) {
        if (!exitApp) {
          ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
          setExitApp(true);
          setTimeout(() => {
            setExitApp(false);
          }, 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return false;
        }
      }
      setIsGoingBack(true);
      setAnimationStarted(true);
      webviewRef.current?.goBack();
    }
    return true;
  });

  // 클립보드에 복사된 url이 있을 경우
  const onClickPase = (url: string) => {
    webviewBridge(webviewRef, 'androidShareUrl', {
      url,
    })();
  };
  const { activeAppState } = useAppState();
  const { handleOnFocus } = useClipboard({ onPaste: onClickPase });
  useEffect(() => {
    if (activeAppState === 'active') {
      handleOnFocus();
    }
  }, [activeAppState]);

  // 1. 유저 로그인
  // 1.1 유저가 로그인 되어있는지 확인
  const { data: serverMemberId, isLoading: isGetMemberIdLoading } =
    useGetMemberId({
      token: user?.token,
    });

  // 1.2 유저 정보 조회
  const { data: userInfo, isLoading: isGetUserInfoLoading } = useGETMemberInfo({
    loginId: serverMemberId ?? 0,
    setMode,
  });

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      if (currentUrl === `${clientUrl}/`) return;
      setIsGoingBack(true);
      setAnimationStarted(true);
      webviewRef.current?.goBack();
    });

  // 3. 알림 설정
  const { requestUserPermission } = useNotification({
    memberId: userInfo?.id ?? 0,
  });

  // 4. 웹뷰 메시지
  const router = useRouter();
  const { setMode: setWebviewMode, setUrl } = webviewStore();

  const { shouldRefetch, setShouldRefetch, sharedUrl, clearSharedText } =
    useSharedData(String(serverMemberId) ?? '');

  const onWebViewMessage = useWebViewMessages({
    onLogin: () => {
      if (serverMemberId && user) {
        webviewBridge(webviewRef, 'login', {
          token: user.token,
          memberId: serverMemberId,
        })();
      }
      setLoading(false);
    },
    onNotification: requestUserPermission,
    onGoBack: () => setIsGoingBack(true),
    onSignUp: () => auth().signOut(),
    onVisitBookmark: (data) => {
      setWebviewMode('BOOKMARK');
      setNoAnimation(true);
      setUrl(data?.url ?? '');
      navigationRef.current?.isReady && router.push('webview');
    },
    onVibrate: () => {
      ReactNativeHapticFeedback.trigger('soft', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    },
    onEmail: () => {
      MailComposer.composeAsync({
        recipients: ['pickly.bookmark@gmail.com'],
        subject: '피클리에게 문의하기',
      });
    },
    onRefetch: () => {
      setShouldRefetch(false);
    },
    onAndroidSharedEnd: clearSharedText,
    onAppVersion: () => {
      webviewBridge(webviewRef, 'appVersion', {
        buildNumber: DeviceInfo.getBuildNumber(),
        version: DeviceInfo.getVersion(),
        platform: DeviceInfo.getSystemName(),
      })();
    },
  });

  // 5. 웹뷰 로그인
  useEffect(() => {
    if (shouldRefetch) webviewBridge(webviewRef, 'refetch', null)();
  }, [shouldRefetch, setShouldRefetch]);

  // 6. 안드로이드 공유
  useEffect(() => {
    if (sharedUrl) {
      webviewBridge(webviewRef, 'androidShareUrl', {
        url: sharedUrl,
      })();
      clearSharedText();
    }
  }, [sharedUrl, clearSharedText]);

  if (isGetMemberIdLoading || isGetUserInfoLoading) return <Loading />;

  return (
    <>
      {!!loading && <Loading />}
      <GestureDetector gesture={flingGesture}>
        <View shouldRasterizeIOS={true} style={styles.container}>
          <Animated.View
            shouldRasterizeIOS={true}
            style={[
              styles.container,
              {
                zIndex: 2,
                opacity: webviewOpacityValue,
              },
            ]}
          >
            <SafeAreaView shouldRasterizeIOS={true} style={styles.safeArea}>
              <StatusBar barStyle="light-content" />
              <WebView
                ref={webviewRef}
                source={{
                  uri: `${
                    Constants.expoConfig?.extra?.clientUrl || ''
                  }${webviewURL[mode](userInfo?.id)}`,
                }}
                onMessage={onWebViewMessage}
                onNavigationStateChange={handleNavigationStateChange}
                allowsBackForwardNavigationGestures={true}
                pullToRefreshEnabled={true}
                automaticallyAdjustContentInsets={false}
                allowsFullscreenVideo={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onContentProcessDidTerminate={() => {
                  setLoading(true);
                  webviewRef.current?.reload();
                  setTimeout(() => {
                    setLoading(false);
                  }, 3000);
                }}
              />
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  fullBlackView: {
    zIndex: 1,
    backgroundColor: Colors.dark.background,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});

export default App;
