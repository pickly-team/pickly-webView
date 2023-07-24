import { useMutation } from '@tanstack/react-query';
import client from '../../lib/client';

interface PUTNotificationSettings {
  memberId: number;
  putData: {
    timezone: string;
    fcmToken: string;
  };
  token?: string;
}

const putNotificationSettingAPI = async ({
  memberId,
  putData,
  token,
}: PUTNotificationSettings) => {
  console.log('putData', putData, memberId);
  const { data } = await client({
    method: 'put',
    url: `/members/${memberId}/notification-settings`,
    params: { memberId },
    data: putData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const usePUTNotificationSettingQuery = () => {
  return useMutation(putNotificationSettingAPI);
};
