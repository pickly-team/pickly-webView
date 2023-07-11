import React from 'react';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import LogoImage from '../../assets/images/splash.png';

const Loading = () => {
  return (
    <SafeAreaView style={Styles.safeArea}>
      <View style={Styles.container}>
        <Image style={Styles.img} source={LogoImage} />
      </View>
    </SafeAreaView>
  );
};

export default Loading;

const Styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    height: '100%',

    backgroundColor: Colors.dark.logoGreen,
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.logoGreen,
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
