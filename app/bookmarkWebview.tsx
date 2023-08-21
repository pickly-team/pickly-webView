import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import webviewStore from '../common/state/webview';
import Header from '../common/ui/Header';
import Colors from '../constants/Colors';

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
          <StatusBar barStyle="light-content" />
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
