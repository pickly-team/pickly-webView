import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Header from '../common/ui/Header';
import webviewStore from '../common/state/webview';

const bookmarkWebview = () => {
  const { setMode, url } = webviewStore();

  const onClickBackButton = () => {
    setMode('DEFAUlT');
  };

  const [loading, setLoading] = useState(true);

  return (
    <>
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
        <WebView
          onLoadEnd={() => setLoading(false)}
          style={{
            backgroundColor: Colors.dark.background,
          }}
          source={{
            uri: url,
          }}
        />
      </SafeAreaView>
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
