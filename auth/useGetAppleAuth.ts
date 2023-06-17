import * as AppleAuthentication from 'expo-apple-authentication';
import {
  getAuth,
  signInWithCredential,
  OAuthProvider,
  onAuthStateChanged,
  OAuthCredential,
} from 'firebase/auth';
import { useEffect } from 'react';

const useGetAppleAuth = () => {
  const auth = getAuth();

  const signInWithApple = async () => {
    try {
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (result) {
        const { identityToken } = result;
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        provider.setCustomParameters({
          locale: 'ko',
        });
        const credential = OAuthCredential.fromJSON({
          providerId: 'apple.com',
          signInMethod: 'oauth',
          idToken: identityToken,
        });

        if (credential) {
          signInWithCredential(auth, credential)
            .then(() => {
              console.log('Apple sign in success');
            })
            .catch((error) => {
              console.log('Error:', error);
            });
        } else {
          console.log('Failed to create credential for Apple sign in');
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        console.log('uid:', uid);
        console.log('email:', email);
        console.log('displayName:', displayName);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  return { signInWithApple };
};

export default useGetAppleAuth;
