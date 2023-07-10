import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Constants from 'expo-constants';
export interface Json {
  email: string;
  isHardMode: boolean;
  name: string;
  nickname: string;
  username: string;
  memberId: number;
}

interface RequestInterface {
  token?: string;
}

const loginAPI = async ({ token }: RequestInterface) => {
  const { data } = await axios<Json>({
    method: 'post',
    url: `${
      Constants.expoConfig?.extra?.serverEndpoint || ''
    }/members/register`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const useUserSignIn = () => {
  return useMutation(loginAPI);
};

type MemberId = number;

interface RequestInterface {
  token?: string;
}

const getMemberIdAPI = async ({ token }: RequestInterface) => {
  const { data } = await axios<MemberId>({
    method: 'get',
    url: `${Constants.expoConfig?.extra?.serverEndpoint || ''}/members/id`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export interface GetAPIRequest {
  token?: string;
}

const GET_MEMBER_ID = (params: GetAPIRequest) => ['get', params.token];

export const useGetMemberId = (params: GetAPIRequest) => {
  return useQuery(GET_MEMBER_ID(params), () => getMemberIdAPI(params), {
    enabled: !!params.token,
  });
};
