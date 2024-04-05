import { useEffect, useState } from 'react';

const useWindowScroll = () => {
  const [pageYOffset, setPageYOffset] = useState<number>(0);

  const handleScroll = () =>
    setPageYOffset(document.documentElement.scrollTop || document.body.scrollTop);

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return pageYOffset;
};
export default useWindowScroll;
