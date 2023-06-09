import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import useSettingFont from '../common/hooks/useSettingFont';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { startApp } from '../firebaseConfig';
import { AuthProvider } from '../auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { loaded } = useSettingFont();

  useEffect(() => {
    startApp;
  }, []);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push('');
      else router.push('login');
    });
  }, [auth.currentUser]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
