import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus, Platform, StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import Button from '../ui/Button';
import Colors from '../constants/Colors';
import { Text } from '../ui/Text';
import useGetGoogleAuth from '../auth/useGetGoogleAuth';
import { useEffect, useState } from 'react';
import useGetAppleAuth from '../auth/useGetAppleAuth';
import * as AppleAuthentication from 'expo-apple-authentication';
import GoggleLogo from '../ui/GoggleLogo';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const { promptAsync: googleLogin } = useGetGoogleAuth();
  const { signInWithApple } = useGetAppleAuth();

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // router.push('(webview)');
    }
    setAppState(nextAppState);
  };

  return (
    <View style={styles.container}>
      <Text bold style={styles.logoText}>
        Pickly
      </Text>

      {/* <Text style={styles.title}>Modal</Text> */}
      <View style={styles.buttonWrapper}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={5}
          style={{
            width: '100%',
            height: 50,
          }}
          onPress={async () => signInWithApple()}
        />
        <Button onPress={() => googleLogin()} viewStyle={styles.buttonStyle}>
          <GoggleLogo />
          <Text bold style={{ fontSize: 18 }}>
            Sign in with Google
          </Text>
        </Button>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  logoText: {
    fontSize: 70,
    alignSelf: 'center',
    color: Colors.dark.lightPrimary,
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    rowGap: 20,
    padding: 30,
  },
  flexRow: {
    flex: 1,
  },
  googleBtn: {
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 2,
    backgroundColor: Colors.dark.google,
  },
  buttonStyle: {
    backgroundColor: Colors.dark.google,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    flexGrow: 1,
    paddingLeft: 63,
    borderRadius: 5,
    columnGap: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
