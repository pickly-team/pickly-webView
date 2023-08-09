import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Image,
  Dimensions,
  Easing,
} from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { useGETMemberInfo, useGetMemberId } from '../auth/api/login';
import Loading from '../common/ui/Loading';
import useAuthContext from '../auth/useAuthContext';
import Constants from 'expo-constants';
import { webviewBridge } from '../common/util/webviewBridge';
import useNotification from '../notification/hooks/useNotification';
import { captureScreen } from 'react-native-view-shot';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import webviewStore from '../common/state/webview';
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
  // const [snapshotUri, setSnapshotUri] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isGoingBack, setIsGoingBack] = useState(false); // 뒤로 가기 상태 관리
  const [noAnimation, setNoAnimation] = useState(false);

  const animationValue = useRef(new Animated.Value(windowWidth)).current;
  const snapShotAnimationValue = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [isInitialized, setIsInitialized] = useState(false);

  const { user } = useAuthContext();
  const [mode, setMode] = useState<MODE>('SIGN_UP');

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

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const url = navState.url;
    // if (!isGoingBack) captureScreenFn(setSnapshotUri);
    if (noAnimation) return;

    if (EXPLICIT_URL.includes(url) && !isGoingBack) {
      if (isInitialized) return;
      requestAnimationFrame(() => {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.poly(3)),
          useNativeDriver: true,
        }).start(() => {
          setIsGoingBack(false);
          setIsInitialized(true);
        });
      });
    }

    if (url) {
      snapShotAnimationValue.setValue(0);
      animationValue.setValue(isGoingBack ? -windowWidth / 2 : windowWidth);

      requestAnimationFrame(() => {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.poly(3)),
          useNativeDriver: true,
        }).start(() => {
          setIsGoingBack(false);
        });
      });

      webviewBridge(webviewRef, 'initialize', null)();
    }
  };

  // 뒤로 가기 상태가 변경되면 애니메이션 업데이트
  useEffect(() => {
    snapShotAnimationValue.setValue(windowWidth / 3);

    requestAnimationFrame(() => {
      Animated.timing(snapShotAnimationValue, {
        toValue: windowWidth,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(3)),
      }).start(() => {
        setIsGoingBack(false);
      });
    });
  }, [isGoingBack]);

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
      // captureScreenFn(setSnapshotUri);
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
  };

  // 2. 웹뷰 로그인
  const webviewRef = useRef<WebView>(null);
  if (isGetMemberIdLoading || isGetUserInfoLoading) return <Loading />;

  return (
    <>
      {!!loading && <Loading />}
      <View style={styles.container}>
        {/* 스냅샷 */}

        {/* {snapshotUri && (
          <Animated.View
            style={[
              styles.container,
              {
                zIndex: 0,
                opacity: imageOpacity,
                transform: [
                  {
                    translateX: snapShotAnimationValue,
                  },
                ],
              },
            ]}
          >
            <Image
              onLoad={() => {
                requestAnimationFrame(() => {
                  Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                  }).start(() => {
                    imageOpacity.setValue(0);
                  });
                });
              }}
              style={[styles.fullImage]}
              source={{ uri: snapshotUri }}
            />
          </Animated.View>
        )} */}

        {/* 기존 WebView */}
        <Animated.View
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

// const captureScreenFn = async (
//   setSnapShotUri: Dispatch<SetStateAction<string>>,
// ) => {
//   captureScreen({
//     format: 'png',
//     quality: 0.1,
//     handleGLSurfaceViewOnAndroid: true,
//     fileName: 'screenshot',
//   }).then((uri) => setSnapShotUri(uri));
// };
