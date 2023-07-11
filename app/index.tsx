import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import useNotification from '../common/hooks/useNotification';
import { useGetMemberId, useUserSignIn } from '../auth/api/login';
import { useEffect, useRef, useState } from 'react';
import { webviewBridge } from '../common/util/webviewBridge';
import { SplashScreen } from 'expo-router';
import useAuthContext from '../auth/useAuthContext';
import Loading from '../common/ui/Loading';

export default function App() {
  // const { expoPushToken, notification } = useNotification();
  // FIRST RENDER
  const { user } = useAuthContext();

  // 1. 유저 로그인
  // 1.1 유저가 로그인 되어있는지 확인
  const { data: serverMemberId, isLoading: isGetMemberIdLoading } =
    useGetMemberId({
      token: user?.token,
    });

  // 1.2 유저가 로그인 되어있지 않다면 > 가입
  const {
    mutate: userSignIn,
    isLoading: isUserSignInLoading,
    data: signInData,
  } = useUserSignIn();
  useEffect(() => {
    if (!user?.token || serverMemberId || isGetMemberIdLoading) return;
    userSignIn({ token: user.token });
  }, [user, serverMemberId, isGetMemberIdLoading]);

  const [loading, setLoading] = useState(true);

  // 2. 웹뷰 로그인
  const webviewRef = useRef<WebView>(null);
  useEffect(() => {
    if (!user?.token) return;
    const memberId = signInData?.memberId || serverMemberId;
    if (memberId) {
      setTimeout(() => {
        webviewBridge(webviewRef, 'login', {
          token: user?.token,
          memberId: memberId,
        })();
      }, 1000);
    }
  }, [serverMemberId, signInData, user?.token]);

  if (isGetMemberIdLoading || isUserSignInLoading) return <SplashScreen />;

  return (
    <>
      {loading && <Loading />}
      <SafeAreaView style={styles.safeArea}>
        <WebView
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          ref={webviewRef}
          style={[styles.container, { opacity: loading ? 0 : 1 }]}
          source={{ uri: 'https://app.pickly.today' }}
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
