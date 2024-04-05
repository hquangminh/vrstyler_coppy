import { useEffect, useState } from 'react';
import useWindowSize from './useWindowSize';

const useDetectMobile = () => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(width > 0 && width <= 991);
  }, [width]);

  return isMobile;
};
export default useDetectMobile;
