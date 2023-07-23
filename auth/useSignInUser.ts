import { useGetMemberId, useUserSignIn } from './api/login';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

const useSignInUser = () => {
  const [token, setToken] = useState<string>('');
  const { mutate: userSignIn, isSuccess } = useUserSignIn();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      router.push('webview');
    }
  }, [isSuccess]);

  const { refetch } = useGetMemberId({ token });

  const signInUser = async (token: string) => {
    userSignIn({ token });
    setToken(token);
  };

  return { signInUser };
};

export default useSignInUser;
