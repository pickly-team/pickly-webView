import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (handleBackAction: () => boolean) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackAction,
    );

    return () => backHandler.remove();
  }, [handleBackAction]);
};
