import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { usePUTNotificationSettingQuery } from '../api/notification';

interface Props {
  memberId: number;
}

const useNotification = ({ memberId }: Props) => {
  const [token, setToken] = useState('');
  const requestUserPermission = async () => {
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
  };

  useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        setToken(token);
      });
  }, []);

  const { mutate } = usePUTNotificationSettingQuery();

  useEffect(() => {
    if (token && memberId) {
      mutate({
        memberId,
        putData: {
          fcmToken: token,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    }
  }, [token, memberId]);

  // TODO : 알림이 왔을 때 처리
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  return { requestUserPermission };
};

export default useNotification;
