import type { ComponentProps } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>;
export type TouchableViewProps = TouchableOpacityProps & {
  viewStyle?: StyleProp<ViewStyle>;
};
const BottomFixedButton = ({
  children,
  viewStyle,
  ...touchableProps
}: TouchableViewProps) => {
  return (
    <View style={styles.bottomFixedWrapper}>
      <TouchableOpacity style={styles.bottomFixedButton} {...touchableProps}>
        <View style={[viewStyle]}>{children}</View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomFixedButton;

const styles = StyleSheet.create({
  bottomFixedWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  bottomFixedButton: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
    height: 50,
    justifyContent: 'center',
    justifySelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.lightPrimary,
    borderRadius: 10,
  },
});
