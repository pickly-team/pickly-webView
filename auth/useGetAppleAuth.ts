import appleAuth from '@invertase/react-native-apple-authentication';
import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import useUserStore from '../common/state/user';
import useSignInUser from './useSignInUser';

const useGetAppleAuth = () => {
  const { signInUser } = useSignInUser();
  const { setName } = useUserStore();

  const signInWithApple = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.REFRESH,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    if (fullName?.givenName && fullName?.familyName) {
      setName(`${fullName?.givenName}${fullName?.familyName}`);
    }

    // Sign the user in with the credential
    return auth()
      .signInWithCredential(appleCredential)
      .then(async (res) => {
        const { user } = res;
        const token = await user.getIdToken();
        signInUser(token);
        await analytics().logLogin({
          method: 'apple',
        });
      });
  };

  return { signInWithApple };
};

export default useGetAppleAuth;
