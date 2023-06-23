import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

import { useEffect } from 'react';

const useGetGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    expoClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  });
  const auth = getAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid, email, displayName, refreshToken } = user;
        console.log('uid :', uid);
        console.log('email :', email);
        console.log('displayName :', displayName);
        console.log('refreshToken :', refreshToken);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  return { request, response, promptAsync };
};

export default useGetGoogleAuth;
