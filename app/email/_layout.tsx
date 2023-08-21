import { Stack } from 'expo-router';
import React from 'react';

const RootLayoutNav = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default RootLayoutNav;
