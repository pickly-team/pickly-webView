import React from 'react';
import { StyleSheet } from 'react-native';
import useEmailStore from '../../common/state/email';
import { TextInput } from '../../common/ui/Input';
import { View } from '../../components/Themed';

interface Props {
  withPassword?: boolean;
}

const EmailAndPassword = ({ withPassword = true }: Props) => {
  const { email, password, setEmail, setPassword } = useEmailStore();
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="이메일"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ width: '90%' }}
      />
      {!!withPassword && (
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
          style={{ width: '90%' }}
        />
      )}
    </View>
  );
};

export default EmailAndPassword;

const styles = StyleSheet.create({
  inputWrapper: {
    rowGap: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
