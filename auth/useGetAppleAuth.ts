import appleAuth from '@invertase/react-native-apple-authentication';
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';

const useGetAppleAuth = () => {
  const signInWithApple = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
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
