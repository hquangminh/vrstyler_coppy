import { RefObject, useEffect } from 'react';

// type Handler = (event: MouseEvent) => void;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    window.addEventListener('click', clickOutside);
    return () => window.removeEventListener('click', clickOutside);
  }, []);
}
