import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../lib/client';
import { GET_MEMBER_INFO_KEY } from './login';

interface RequestInterface {
  memberId: number;
  putData: {
    name: string;
    nickname: string;
    profileEmoji: string;
  };
  token?: string;
}

const putUserInfo = async ({ memberId, putData, token }: RequestInterface) => {
  const { data } = await client({
    method: 'put',
    url: '/members/me',
    params: { memberId },
    data: putData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export interface PutAPIRequest {
  memberId: number;
}
export const usePutUserInfoQuery = ({ memberId }: PutAPIRequest) => {
  const queryClient = useQueryClient();

  return useMutation(putUserInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries(GET_MEMBER_INFO_KEY({ loginId: memberId }));
    },
  });
};
