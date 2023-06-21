import * as React from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        style={styles.container}
        source={{ uri: 'http://localhost:3000/' }}
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
