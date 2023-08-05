import React, { useEffect } from 'react';
import Loading from '../common/ui/Loading';
import { usePathname, useRouter } from 'expo-router';
import useAuthContext from '../auth/useAuthContext';
import { useGetMemberId } from '../auth/api/login';

const index = () => {
  const { user } = useAuthContext();

  const router = useRouter();
  // NOTE : usePathname은 라우터가 바뀔때마다 pathname을 가져온다.
  // 이를 이용해서 로딩 화면에서 로그인이 되어있는지 확인하고
  // 로그인이 되어있다면 webview로 이동시킨다.
  usePathname();

  const { data: serverMemberId } = useGetMemberId({
    token: user?.token,
  });

  useEffect(() => {
    if (serverMemberId) {
      router.push('initialWebview');
    }
  }, [serverMemberId, router]);

  return <Loading />;
};

export default index;
