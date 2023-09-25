import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, NativeModules } from 'react-native';

const useSharedData = (serverMemberId?: string) => {
  const { ShareModule, CustomShareModule } = NativeModules;
  const appState = useRef(AppState.currentState);
  const [activeAppState, setActiveAppState] = useState(appState.current);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string>('');

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
      checkSharedText();
    }
    appState.current = nextAppState;
    setActiveAppState(appState.current);
  };

  const checkSharedData = () => {
    if (ShareModule && ShareModule.receiveSharedData) {
      ShareModule?.receiveSharedData((error: string, data: string) => {
        if (data) setShouldRefetch(true);
      });
    }
  };

  const checkSharedText = () => {
    if (CustomShareModule && CustomShareModule.getSharedText) {
      CustomShareModule.getSharedText()
        .then((sharedText: string) => {
          setSharedUrl(sharedText);
        })
        .catch((error: string) => {
          setSharedUrl('');
        });
    }
  };

  const clearSharedText = () => {
    setSharedUrl('');
    if (CustomShareModule && CustomShareModule.clearSharedText) {
      CustomShareModule.clearSharedText();
    }
  };

  const setSharedMemberId = (id: string) => {
    if (ShareModule && ShareModule.setMemberId) {
      ShareModule.setMemberId(id);
    }
  };

  useEffect(() => {
    if (serverMemberId) {
      setSharedMemberId(String(serverMemberId));
    }
  }, [serverMemberId]);

  return {
    shouldRefetch,
    setShouldRefetch,
    sharedUrl,
    clearSharedText,
  };
};

export default useSharedData;
