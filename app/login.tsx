import { MaterialIcons } from '@expo/vector-icons';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform, StyleSheet } from 'react-native';
import useGetAppleAuth from '../auth/useGetAppleAuth';
import useGetGoogleAuth from '../auth/useGetGoogleAuth';
import Button from '../common/ui/Button';
import FullPageLoading from '../common/ui/FullPageLoading';
import GoggleLogo from '../common/ui/GoggleLogo';
import { Text } from '../common/ui/Text';
import { View } from '../components/Themed';
import Colors from '../constants/Colors';

export default function ModalScreen() {
  const { onClickGoogleLogin, isLoading: isGoogleLoading } = useGetGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading } = useGetAppleAuth();
  const router = useRouter();

  const onClickEmailLogin = () => {
    router.push('email/login');
  };

  return (
    <View style={styles.container}>
      {isGoogleLoading || isAppleLoading ? <FullPageLoading /> : null}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/images/icon.png')}
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
      </View>
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
        <Button onPress={onClickGoogleLogin} viewStyle={styles.blueButtonStyle}>
          <GoggleLogo />
          <Text bold style={{ fontSize: 18 }}>
            Google로 로그인
          </Text>
        </Button>
        <Button onPress={onClickEmailLogin} viewStyle={styles.greenButtonStyle}>
          <MaterialIcons name="email" size={24} color="white" />
          <Text bold style={{ fontSize: 18 }}>
            Email로 로그인
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
  imageWrapper: {
    height: '30%',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  blueButtonStyle: {
    backgroundColor: Colors.dark.google,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexGrow: 1,
    borderRadius: 5,
    columnGap: 5,
  },
  greenButtonStyle: {
    backgroundColor: Colors.dark.lightPrimary,
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
