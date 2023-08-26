import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useBackHandler } from '../common/hooks/useBackHandler';
import webviewStore from '../common/state/webview';
import Header from '../common/ui/Header';
import Colors from '../constants/Colors';

const bookmarkWebview = () => {
  const { setMode, url } = webviewStore();
  const [webviewOff, setWebviewOff] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const onClickBackButton = () => {
    setMode('DEFAUlT');
  };

  useBackHandler(() => {
    if (Platform.OS === 'android') {
      if (canGoBack) {
        webviewRef.current?.goBack();
      } else {
        setWebviewOff(true);
        setMode('DEFAUlT');
        setTimeout(() => {
          router.back();
        }, 100);
      }
      return true;
    }
    return true;
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      if (Platform.OS === 'android') return;
      setWebviewOff(true);
      setMode('DEFAUlT');
      setTimeout(() => {
        router.back();
      }, 100);
    });

  return (
    <>
      <GestureDetector gesture={flingGesture}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />
          <Header showBackButton backButtonCallback={onClickBackButton} />
          {loading && (
            <View
              style={{
                height: '100%',
              }}
            />
          )}
          {!webviewOff && (
            <WebView
              ref={webviewRef}
              onLoadEnd={() => setLoading(false)}
              style={{
                backgroundColor: loading ? Colors.dark.background : 'white',
              }}
              source={{
                uri: url,
              }}
              allowsBackForwardNavigationGestures={true}
              pullToRefreshEnabled={true}
              allowsFullscreenVideo={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              automaticallyAdjustContentInsets={false}
              onLoadProgress={({ nativeEvent }) => {
                setCanGoBack(nativeEvent.canGoBack);
              }}
            />
          )}
        </SafeAreaView>
      </GestureDetector>
    </>
  );
};

export default bookmarkWebview;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
