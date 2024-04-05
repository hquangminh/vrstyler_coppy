import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useRouterChange(
  onStart: (path: string, option: { shallow: boolean }) => void,
  onEnd: () => void
) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onEnd);
    router.events.on('routeChangeError', onEnd);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onEnd);
      router.events.off('routeChangeError', onEnd);
    };
  }, [onEnd, onStart, router.events]);
}
