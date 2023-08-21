import type { ComponentProps, ForwardRefRenderFunction } from 'react';
import React, { forwardRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export type TextInputProps = ComponentProps<typeof RNTextInput>;

const _TextInput: ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  { style, ...props },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <RNTextInput
      ref={ref}
      style={[
        {
          color: Colors.dark.white,
          borderColor: Colors.dark.grey400,
          backgroundColor: Colors.dark.grey900,
        },
        styles.textInput,
        style,
      ]}
      placeholderTextColor={Colors.dark.grey400}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
};
export const TextInput = forwardRef(_TextInput);
const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: 'NanumSquareRound',
  },
});
