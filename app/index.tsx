import * as React from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import useNotification from '../common/hooks/useNotification';

export default function App() {
  const { expoPushToken, notification } = useNotification();
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        style={styles.container}
        source={{ uri: 'https://app.pickly.today' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
});
