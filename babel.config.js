module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};
