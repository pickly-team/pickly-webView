import auth from '@react-native-firebase/auth';
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
import Header from '../../common/ui/Header';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';

const register = () => {
  const { email, password } = useEmailStore();
  const { setMode } = webviewStore();

  const { signInUser } = useSignInUser();

  const onPressRegister = () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      Alert.alert('비밀번호를 입력해주세요.');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        res.user?.getIdToken().then((token) => {
          signInUser(token);
        });
        setMode('DEFAUlT');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('이미 사용중인 이메일입니다.');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('유효하지 않은 이메일입니다.');
        }
        if (error.code === 'auth/weak-password') {
          Alert.alert('비밀번호는 6자리 이상이어야 합니다.');
        }
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header showBackButton />
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <EmailAndPassword />
        </View>
        <BottomFixedButton onPress={onPressRegister}>
          <Text style={{ fontFamily: 'NanumSquareBold', fontSize: 16 }}>
            회원가입
          </Text>
        </BottomFixedButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

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
  registerText: {
    fontSize: 12,
    color: Colors.dark.lightPrimary,
  },
});
