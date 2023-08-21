import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useGetMemberId } from '../auth/api/login';
import useAuthContext from '../auth/useAuthContext';
import webviewStore from '../common/state/webview';
import Loading from '../common/ui/Loading';
import { navigationRef } from './_layout';

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

  const { mode } = webviewStore();

  useEffect(() => {
    if (mode === 'REGISTER') {
      return;
    }
    if (mode === 'BOOKMARK') {
      router.push('bookmarkWebview');
      return;
    }
    if (user && !user.token) {
      router.push('login');
      return;
    }
    if (serverMemberId) {
      router.push('initialWebview');
    }
  }, [serverMemberId, router, user, navigationRef]);

  return <Loading />;
};

export default index;
