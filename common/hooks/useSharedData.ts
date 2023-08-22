import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Alert, NativeModules } from 'react-native';

const useSharedData = (serverMemberId?: string) => {
  const { ShareModule } = NativeModules;
  const appState = useRef(AppState.currentState);
  const [activeAppState, setActiveAppState] = useState(appState.current);
  const [shouldRefetch, setShouldRefetch] = useState(false);

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
      checkSharedData();
    }
    appState.current = nextAppState;
    setActiveAppState(appState.current);
  };

  const checkSharedData = () => {
    ShareModule.receiveSharedData((error: string, data: string) => {
      if (data) {
        setShouldRefetch(true);
      } else {
        setShouldRefetch(false);
      }
    });
  };

  const setSharedMemberId = (id: string) => {
    ShareModule.setMemberId(id);
  };

  useEffect(() => {
    if (serverMemberId) {
      setSharedMemberId(String(serverMemberId));
    }
  }, [serverMemberId]);

  return {
    shouldRefetch,
    setShouldRefetch,
  };
};

export default useSharedData;
