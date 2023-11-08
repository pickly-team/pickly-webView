import { useMutation, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { MODE } from '../../common/hooks/usePageAnimation';
import client from '../../lib/client';
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
  const { data } = await client<Json>({
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
  const { data } = await client<MemberId>({
    method: 'get',
    url: `${Constants.expoConfig?.extra?.serverEndpoint || ''}/members/id`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export interface GETMemberIdQueryParams {
  token?: string;
}

export const GET_MEMBER_ID = (params: GETMemberIdQueryParams) => [
  'GET_MEMBER_ID',
  params.token,
];

export const useGetMemberId = (params: GETMemberIdQueryParams) => {
  return useQuery(GET_MEMBER_ID(params), () => getMemberIdAPI(params), {
    enabled: !!params.token,
  });
};

export interface UserInfo {
  id: number;
  name: string;
  nickname: string;
  profileEmoji: string;
  followersCount: number;
  followeesCount: number;
  bookmarksCount: number;
}

interface GETUserInfoRequest {
  loginId: number;
  token?: string;
}

const getUserInfo = async ({ loginId, token }: GETUserInfoRequest) => {
  const { data } = await client<UserInfo>({
    method: 'get',
    url: '/members/me',
    params: { loginId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export interface GETUserInfoQueryParams {
  loginId: number;
  setMode?: (mode: MODE) => void;
  token?: string;
}

export const GET_MEMBER_INFO_KEY = (params: GETUserInfoQueryParams) => [
  'GET_MEMBER_INFO',
  params.loginId,
];

export const useGETMemberInfo = (params: GETUserInfoQueryParams) => {
  return useQuery(
    GET_MEMBER_INFO_KEY(params),
    async () => getUserInfo(params),
    {
      enabled: params.loginId !== 0,
      onSuccess: (data) => {
        // 최초 회원가입시 UUID로 닉네임이 설정되어
        // 닉네임이 7자 이상이면 닉네임 설정 페이지로 이동
        if (data.nickname.length > 7)
          params.setMode && params.setMode('SIGN_UP');
      },
      onError: (error) => {
        console.log('error:', error);
        params.setMode && params.setMode('SIGN_UP');
      },
    },
  );
};
