import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmailAndPassword from '../../auth/ui/EmailAndPassword';
import useSignInUser from '../../auth/useSignInUser';
import useEmailStore from '../../common/state/email';
import webviewStore from '../../common/state/webview';
import BottomFixedButton from '../../common/ui/BottomFixedButton';
import FullPageLoading from '../../common/ui/FullPageLoading';
import Header from '../../common/ui/Header';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';

const login = () => {
  const router = useRouter();

  const { setMode } = webviewStore();
  const { email, password, initialize } = useEmailStore();

  const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false);

  const keyboardDidShow = () => setIsKeyboardFocus(true);
  const keyboardDidHide = () => setIsKeyboardFocus(false);

  const onPressRegister = () => {
    router.push('/email/register');
    setMode('REGISTER');
  };

  const onPressReset = () => {
    router.push('/email/reset');
    setMode('REGISTER');
  };

  const { signInUser, isLoading } = useSignInUser();

  const onPressLogin = () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      Alert.alert('비밀번호를 입력해주세요.');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        res.user?.getIdToken().then((token) => {
          signInUser(token);
        });

        setMode('DEFAUlT');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('가입되지 않은 이메일입니다.');
        }
        if (error.code === 'auth/wrong-password') {
          Alert.alert('비밀번호가 틀렸습니다.');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('유효하지 않은 이메일입니다.');
        }
        console.error(error);
      });
  };

  const onClickBackButton = () => {
    initialize();
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
      />
      <SafeAreaView style={styles.safeArea}>
        {!!isLoading && <FullPageLoading />}
        <Header
          showBackButton
          backButtonCallback={onClickBackButton}
          top={Platform.OS === 'ios' ? -20 : 0}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <EmailAndPassword
              onKeyFocus={keyboardDidShow}
              onKeyBlur={keyboardDidHide}
            />
            <View style={styles.registerTextWrapper}>
              <Text onPress={onPressRegister} style={styles.registerText}>
                회원가입 하기
              </Text>
            </View>
            <View style={styles.resetTextWrapper}>
              <Text onPress={onPressReset} style={styles.registerText}>
                비밀번호 재설정
              </Text>
            </View>
          </View>
          {!isKeyboardFocus && (
            <BottomFixedButton onPress={onPressLogin}>
              <Text style={{ fontFamily: 'NanumSquareBold', fontSize: 16 }}>
                로그인
              </Text>
            </BottomFixedButton>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 30,
  },
  resetTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 20,
  },
  registerText: {
    fontSize: 12,
    color: Colors.dark.lightPrimary,
  },
});
