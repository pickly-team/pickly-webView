import React from 'react';
import { StyleSheet } from 'react-native';
import Spin from 'react-native-loading-spinner-overlay';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';

const FullPageLoading = () => {
  return (
    <View style={styles.wrapper}>
      <Spin
        visible={true}
        textStyle={styles.loadingText}
        animation="fade"
        size={'large'}
      />
    </View>
  );
};

export default FullPageLoading;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
    zIndex: 1,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.dark.grey900,
  },
});
