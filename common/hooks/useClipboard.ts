import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import checkValidateURL from '../util/checkValidateURL';

interface ClipboardHook {
  onPaste: (url: string) => void;
}

const useClipboard = ({ onPaste }: ClipboardHook) => {
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const handleOnFocus = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    const validateURL = checkValidateURL(clipboardText);

    if (validateURL && !isAlert) {
      setIsAlert(true);

      onPaste(validateURL);
      await Clipboard.setStringAsync('');
      setIsAlert(false);
    }
  };

  return { handleOnFocus };
};

export default useClipboard;
