import { useFonts } from 'expo-font';
import { useEffect } from 'react';

const useSettingFont = () => {
  const [loaded, error] = useFonts({
    NanumSquareRound: require('../../assets/fonts/NanumSquareRoundR.ttf'),
    NanumSquareBold: require('../../assets/fonts/NanumSquareRoundB.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return { loaded };
};

export default useSettingFont;
