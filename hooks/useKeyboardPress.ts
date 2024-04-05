import { useCallback, useEffect, useState } from 'react';

const useKeyboardPress = (keyCode: number | string) => {
  const [result, setResult] = useState<boolean>(false);

  const keyboardFunction = useCallback(
    (event: any) => {
      if (event.key === keyCode) setResult(true);
    },
    [keyCode]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyboardFunction, false);
    return () => document.removeEventListener('keydown', keyboardFunction, false);
  }, [keyboardFunction]);

  useEffect(() => {
    if (result) setResult(false);
  }, [result]);

  return result;
};

export default useKeyboardPress;
