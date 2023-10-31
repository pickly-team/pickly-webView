import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [activeAppState, setActiveAppState] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
    }
    appState.current = nextAppState;
    setActiveAppState(appState.current);
  };

  return { activeAppState };
};

export default useAppState;
