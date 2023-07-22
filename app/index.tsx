import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import useNotification from '../common/hooks/useNotification';
import {
  useGETMemberInfo,
  useGetMemberId,
  useUserSignIn,
} from '../auth/api/login';
import { useEffect, useRef, useState } from 'react';
import { webviewBridge } from '../common/util/webviewBridge';
import useAuthContext from '../auth/useAuthContext';
import Loading from '../common/ui/Loading';

export type MODE = 'SIGN_IN' | 'SIGN_UP';

const webviewURL: Record<MODE, string> = {
  SIGN_IN: '',
  SIGN_UP: '/user/:id',
};

export default function App() {
  // const { expoPushToken, notification } = useNotification();
  // FIRST RENDER
  const { user } = useAuthContext();
  const [mode, setMode] = useState<MODE>('SIGN_UP');

  // 1. 유저 로그인
  // 1.1 유저가 로그인 되어있는지 확인
  const {
    data: serverMemberId,
    isLoading: isGetMemberIdLoading,
    isError: isGetMemberIdError,
  } = useGetMemberId({
    token: user?.token,
  });

  // 1.2 유저 정보 조회
  const { data: userInfo, isLoading: isGetUserInfoLoading } = useGETMemberInfo({
    loginId: serverMemberId ?? 0,
    setMode,
  });

  // 1.2 유저가 로그인 되어있지 않다면 > 가입
  const { mutate: userSignIn, isLoading: isUserSignInLoading } =
    useUserSignIn();
  useEffect(() => {
    if (!user?.token) return;
    if (!isGetUserInfoLoading) return;
    if (isGetMemberIdError) userSignIn({ token: user.token });
  }, [user, serverMemberId, isGetUserInfoLoading]);

  const [loading, setLoading] = useState(true);

  // 2. 웹뷰 로그인
  const webviewRef = useRef<WebView>(null);
  useEffect(() => {
    if (!userInfo?.id) return;
    const memberId: number = userInfo?.id;
    if (memberId) {
      setTimeout(() => {
        webviewBridge(webviewRef, 'login', {
          token: user?.token,
          memberId: memberId,
        })();
      }, 1000);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [userInfo?.id, user?.token]);

  if (isGetMemberIdLoading || isUserSignInLoading || isGetUserInfoLoading)
    return <Loading />;

  return (
    <>
      {loading && <Loading />}
      <SafeAreaView style={styles.safeArea}>
        <WebView
          onLoadStart={() => setLoading(true)}
          ref={webviewRef}
          style={[styles.container, { opacity: loading ? 0 : 1 }]}
          // source={{ uri: `http://localhost:3000${webviewURL[mode]}` }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          source={{ uri: `https://app.pickly.today${webviewURL[mode]}` }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
