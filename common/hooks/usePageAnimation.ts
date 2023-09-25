import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, InteractionManager } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';
export type MODE = 'SIGN_IN' | 'SIGN_UP';

const clientUrl = Constants.expoConfig?.extra?.clientUrl || '';
const EXPLICIT_URL = [
  `${clientUrl}/`,
  `${clientUrl}/friend`,
  `${clientUrl}/notification`,
  `${clientUrl}/profile`,
];

const windowWidth = Dimensions.get('window').width;

const usePageAnimation = () => {
  const [isGoingBack, setIsGoingBack] = useState(false); // 뒤로 가기 상태 관리
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [noAnimation, setNoAnimation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const animationValue = useRef(new Animated.Value(windowWidth)).current;
  const snapShotAnimationValue = useRef(new Animated.Value(0)).current;
  const backgroundOpacityValue = useRef(new Animated.Value(1)).current;
  const webviewOpacityValue = useRef(new Animated.Value(0)).current;

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;
    setCurrentUrl(url);
    if (noAnimation) return;
    if (EXPLICIT_URL.includes(url) && !isGoingBack) {
      if (isInitialized) return;
      requestAnimationFrame(() => {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.poly(2)),
          useNativeDriver: true,
        }).start(() => {
          setIsGoingBack(false);
          setIsInitialized(true);
        });
      });
    }

    setAnimationStarted(true);
  };

  useEffect(() => {
    if (!animationStarted) return;

    snapShotAnimationValue.setValue(0);
    animationValue.setValue(isGoingBack ? -windowWidth / 2 : windowWidth);
    backgroundOpacityValue.setValue(1);
    webviewOpacityValue.setValue(0);

    requestAnimationFrame(() => {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setAnimationStarted(false);
      });
    });
    InteractionManager.runAfterInteractions(() => {
      setIsGoingBack(false);
    });

    Animated.timing(backgroundOpacityValue, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();

    Animated.timing(webviewOpacityValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isGoingBack, animationStarted, currentUrl]);

  return {
    clientUrl,
    currentUrl,
    handleNavigationStateChange,
    animationValue,
    snapShotAnimationValue,
    backgroundOpacityValue,
    webviewOpacityValue,
    setIsGoingBack,
    setNoAnimation,
    setAnimationStarted,
  };
};

export default usePageAnimation;
