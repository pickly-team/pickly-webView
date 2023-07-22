import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import useNotification from '../common/hooks/useNotification';
import { useGETMemberInfo, useGetMemberId } from '../auth/api/login';
import { useEffect, useRef, useState } from 'react';
import { webviewBridge } from '../common/util/webviewBridge';
import useAuthContext from '../auth/useAuthContext';
import Loading from '../common/ui/Loading';

export type MODE = 'SIGN_IN' | 'SIGN_UP';

const webviewURL: Record<MODE, (id?: number) => string> = {
  SIGN_IN: () => '',
  SIGN_UP: (id?: number) => `/user/${id}`,
};

export default function App() {
  // const { expoPushToken, notification } = useNotification();
  // FIRST RENDER
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

  const [loading, setLoading] = useState(true);

  // 2. 웹뷰 로그인
  const webviewRef = useRef<WebView>(null);
  useEffect(() => {
    if (!serverMemberId) return;
    if (serverMemberId) {
      const bridgeCall = setInterval(() => {
        webviewBridge(webviewRef, 'login', {
          token: user?.token,
          memberId: serverMemberId,
        })();
      }, 100);

      setTimeout(() => {
        clearInterval(bridgeCall);
        setLoading(false);
      }, 1500);
    }
  }, [serverMemberId, user?.token]);

  if (isGetMemberIdLoading || isGetUserInfoLoading) return <Loading />;

  return (
    <>
      {loading && <Loading />}
      <SafeAreaView style={styles.safeArea}>
        <WebView
          ref={webviewRef}
          style={[styles.container, { opacity: loading ? 0 : 1 }]}
          // source={{
          //   uri: `http://localhost:3000${webviewURL[mode](userInfo?.id)}`,
          // }}
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
