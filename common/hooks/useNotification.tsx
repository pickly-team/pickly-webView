import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const useNotification = () => {
  async function requestUserPermission() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    const authStatus = await messaging().requestPermission({
      providesAppNotificationSettings: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert('알림 권한을 허용해주세요.');
    }
  }

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then((token) => {
        console.log('token', token);
        Clipboard.setStringAsync(token);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return { requestUserPermission };
};

export default useNotification;
