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
import EmailAndPassword from '../../auth/ui/EmailAndPassword';
import useEmailStore from '../../common/state/email';
import webviewStore from '../../common/state/webview';
import BottomFixedButton from '../../common/ui/BottomFixedButton';
import Header from '../../common/ui/Header';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const reset = () => {
  const router = useRouter();

  const { setMode } = webviewStore();
  const { email } = useEmailStore();

  const onPressLogin = () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then((res) => {
        Alert.alert('이메일이 전송되었습니다.');
        router.push('/email/login');
        setMode('REGISTER');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('가입되지 않은 이메일입니다.');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('유효하지 않은 이메일입니다.');
        }
        console.error(error);
      });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
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
            <EmailAndPassword withPassword={false} />
          </View>
          <BottomFixedButton onPress={onPressLogin}>
            <Text style={{ fontFamily: 'NanumSquareBold', fontSize: 16 }}>
              재설정 이메일 보내기
            </Text>
          </BottomFixedButton>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default reset;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
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
