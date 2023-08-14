import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import { useGETMemberInfo, useGetMemberId } from '../auth/api/login';
import useAuthContext from '../auth/useAuthContext';
import webviewStore from '../common/state/webview';
import Loading from '../common/ui/Loading';
import { webviewBridge } from '../common/util/webviewBridge';
import Colors from '../constants/Colors';
import useNotification from '../notification/hooks/useNotification';
import { navigationRef } from './_layout';

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
}

interface WebviewOnMessage {
  message: keyof PostBridgeParams;
  params: PostBridgeParams[keyof PostBridgeParams];
}

export type MODE = 'SIGN_IN' | 'SIGN_UP';
const clientUrl = Constants.expoConfig?.extra?.clientUrl || '';
const EXPLICIT_URL = [
  `${clientUrl}/`,
  `${clientUrl}/friend`,
  `${clientUrl}/notification`,
  `${clientUrl}/profile`,
];

const webviewURL: Record<MODE, (id?: number) => string> = {
  SIGN_IN: () => '',
  SIGN_UP: (id?: number) => `/user/${id}`,
};

const windowWidth = Dimensions.get('window').width;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isGoingBack, setIsGoingBack] = useState(false); // 뒤로 가기 상태 관리
  const [noAnimation, setNoAnimation] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const animationValue = useRef(new Animated.Value(windowWidth)).current;
  const snapShotAnimationValue = useRef(new Animated.Value(0)).current;
  const [isInitialized, setIsInitialized] = useState(false);

  const { user } = useAuthContext();
  const [mode, setMode] = useState<MODE>('SIGN_UP');

  const navigator = useNavigation();
  useEffect(() => {
    navigator.setOptions({
      gestureEnabled: false,
    });
  }, []);

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

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const url = navState.url;
    setCurrentUrl(url);
    if (noAnimation) return;
    if (EXPLICIT_URL.includes(url) && !isGoingBack) {
      if (isInitialized) return;
      requestAnimationFrame(() => {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.poly(2)),
          useNativeDriver: true,
        }).start(() => {
          setIsGoingBack(false);
          setIsInitialized(true);
        });
      });
    }

    setAnimationStarted(true);
  };

  useEffect(() => {
    if (!animationStarted) return;

    snapShotAnimationValue.setValue(0);
    animationValue.setValue(isGoingBack ? -windowWidth / 2 : windowWidth);

    requestAnimationFrame(() => {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: isGoingBack ? 150 : 300,
        easing: Easing.out(Easing.poly(2)),
        useNativeDriver: true,
      }).start(() => {
        setIsGoingBack(false);
      });
    });
    setAnimationStarted(false);
  }, [isGoingBack, animationStarted, currentUrl]);

  // 3. 알림 설정
  const { requestUserPermission } = useNotification({
    memberId: userInfo?.id ?? 0,
  });

  // 4. 웹뷰 메시지
  const router = useRouter();
  const { setMode: setWebviewMode, setUrl } = webviewStore();
  const onWebViewMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data) as WebviewOnMessage;
    if (data.message === 'login') {
      if (serverMemberId) {
        webviewBridge(webviewRef, 'login', {
          token: user?.token,
          memberId: serverMemberId,
        })();
      }
      setLoading(false);
    }
    if (data.message === 'notification') {
      requestUserPermission();
    }
    if (data.message === 'goBack') {
      setIsGoingBack(true);
    }
    if (data.message === 'signUp') {
      auth().signOut();
    }
    setNoAnimation(false);
    if (data.message === 'visitBookmark') {
      setWebviewMode('BOOKMARK');
      setNoAnimation(true);
      setUrl(data.params?.url ?? '');
      navigationRef.current?.isReady && router.push('webview');
    }
    if (data.message === 'vibrate') {
      ReactNativeHapticFeedback.trigger('soft', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  };

  // 2. 웹뷰 로그인
  const webviewRef = useRef<WebView>(null);
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
                zIndex: 1,
                transform: [
                  {
                    translateX: animationValue,
                  },
                ],
              },
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
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
                allowsFullscreenVideo={true}
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
  fullImage: {
    zIndex: 0,
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
});

export default App;
