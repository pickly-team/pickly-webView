import messaging from '@react-native-firebase/messaging';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../auth/AuthContext';
import useSettingFont from '../common/hooks/useSettingFont';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  Clipboard.setStringAsync(JSON.stringify(remoteMessage));
});

interface NavigationParams {
  index: undefined;
  login: undefined;
  initialWebview: undefined;
  webview: {
    url: string;
  };
}

export const navigationRef = createNavigationContainerRef<NavigationParams>();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { loaded } = useSettingFont();

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
  initialRouteName: '',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // 사용자의 뒤로가기 버튼을 제거
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  animation: 'flip',
                }}
              />
              <Stack.Screen
                name="initialWebview"
                options={{ animation: 'none' }}
              />
              <Stack.Screen
                name="bookmarkWebview"
                options={{ animation: 'flip' }}
              />
              <Stack.Screen name="email" options={{ animation: 'flip' }} />
            </Stack>
          </ThemeProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
