import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGetMemberId, useUserSignIn } from './api/login';

const useSignInUser = () => {
  const [token, setToken] = useState<string>('');
  const { mutate: userSignIn, isSuccess, isLoading } = useUserSignIn();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      router.replace('initialWebview');
    }
  }, [isSuccess]);

  const { refetch } = useGetMemberId({ token });

  const signInUser = async (token: string) => {
    userSignIn({ token });
    setToken(token);
  };

  return { signInUser, isLoading };
};

export default useSignInUser;
