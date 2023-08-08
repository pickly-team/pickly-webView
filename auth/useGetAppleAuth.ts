import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import useSignInUser from './useSignInUser';

const useGetAppleAuth = () => {
  const { signInUser } = useSignInUser();
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
    return auth()
      .signInWithCredential(appleCredential)
      .then(async (res) => {
        const { user } = res;
        const token = await user.getIdToken();
        signInUser(token);
      });
  };

  return { signInWithApple };
};

export default useGetAppleAuth;
