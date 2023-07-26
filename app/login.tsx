import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import Button from '../ui/Button';
import Colors from '../constants/Colors';
import { Text } from '../ui/Text';
import useGetGoogleAuth from '../auth/useGetGoogleAuth';
import GoggleLogo from '../ui/GoggleLogo';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import useGetAppleAuth from '../auth/useGetAppleAuth';

export default function ModalScreen() {
  const { onClickGoogleLogin } = useGetGoogleAuth();
  const { signInWithApple } = useGetAppleAuth();

  return (
    <View style={styles.container}>
      <Text bold style={styles.logoText}>
        Pickly
      </Text>
      <View style={styles.buttonWrapper}>
        {appleAuth.isSupported && (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: '100%',
              height: 50,
            }}
            onPress={signInWithApple}
          />
        )}
        <Button onPress={onClickGoogleLogin} viewStyle={styles.buttonStyle}>
          <GoggleLogo />
          <Text bold style={{ fontSize: 18 }}>
            Google로 로그인
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
    justifyContent: 'center',
    flex: 1,
    flexGrow: 1,
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
