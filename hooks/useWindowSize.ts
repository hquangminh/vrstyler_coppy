import { useEffect, useState } from 'react';

type Size = { width: number; height: number };

export default function useWindowSize() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (typeof window !== 'undefined')
        setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
