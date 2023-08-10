import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Header from '../common/ui/Header';
import webviewStore from '../common/state/webview';
import { navigationRef } from './_layout';
import { useNavigation, useRouter } from 'expo-router';
import {
  Directions,
  FlingGestureHandler,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const bookmarkWebview = () => {
  const { setMode, url } = webviewStore();
  const [webviewOff, setWebviewOff] = useState(false);

  const onClickBackButton = () => {
    setMode('DEFAUlT');
  };

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
    .onStart((e) => {
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
          <Header showBackButton backButtonCallback={onClickBackButton} />
          {loading && (
            <View
              style={{
                backgroundColor: Colors.dark.background,
                height: '100%',
              }}
            />
          )}
          {!webviewOff && (
            <WebView
              onLoadEnd={() => setLoading(false)}
              style={{
                backgroundColor: Colors.dark.background,
              }}
              source={{
                uri: url,
              }}
              allowsBackForwardNavigationGestures={true}
              // onNavigationStateChange={(e) => {
              //   console.log(e);
              // }}
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
