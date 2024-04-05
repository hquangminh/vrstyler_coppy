import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import urlPage from 'constants/url.constant';

const throwFakeErrorToFoolNextRouter = () => {
  // Throwing an actual error class trips the Next.JS 500 Page, this string literal does not.
  throw 'Abort route change due to unsaved changes in form. Triggered by useWarningOnExit. Please ignore this error. See issue https://github.com/vercel/next.js/issues/2476';
};

const getWindow = (): Window | null => (typeof window !== 'undefined' ? window : null);

const getHistory = () => getWindow()?.history?.state;

export const useWarningOnExit = (shouldWarn = true, message = 'Discard unsaved changes?') => {
  const router = useRouter();
  const lastHistory = useRef(getHistory());

  useEffect(() => {
    const storeLastHistoryState = () => {
      lastHistory.current = getHistory();
    };
    router.events.on('routeChangeComplete', storeLastHistoryState);
    return () => {
      router.events.off('routeChangeComplete', storeLastHistoryState);
    };
  }, [router]);

  /**
   * @experimental HACK - idx is not documented
   * Determines which direction to travel in history.
   */
  const revertTheChangeRouterJustMade = useCallback(() => {
    const state = lastHistory.current;
    if (state !== null && history.state !== null && state.idx !== history.state.idx) {
      const delta = lastHistory.current.idx < history.state.idx ? -1 : 1;
      history.go(delta);
    }
  }, []);

  const killRouterEvent = useCallback(() => {
    router.events.emit('routeChangeError');
    revertTheChangeRouterJustMade();
    throwFakeErrorToFoolNextRouter();
  }, [revertTheChangeRouterJustMade, router]);

  useEffect(() => {
    let isWarned = false;

    const routeChangeStart = (url: string, { shallow }: { shallow: boolean }) => {
      const isLocaleInUrl = url.split('/')[1] === router.locale;
      const nextUrl = isLocaleInUrl ? '/' + url.split('/').slice(2).join('/') : url;
      const confirmExclusion =
        nextUrl.startsWith('/upload-model') && nextUrl !== urlPage.upload && shallow;

      if (router.asPath !== url && !confirmExclusion && shouldWarn && !isWarned) {
        isWarned = true;
        const confirm = window.confirm(message);
        if (confirm) {
          router.push(url);
          return;
        }
        isWarned = false;
        killRouterEvent();
      }
    };

    const beforeUnload = (e: Event | null) => {
      if (shouldWarn && !isWarned) {
        const event = e ?? getWindow()?.event;
        if (event) {
          event.returnValue = Boolean(message);
        }
        return message;
      }
      return null;
    };

    router.events.on('routeChangeStart', routeChangeStart);
    getWindow()?.addEventListener('beforeunload', beforeUnload);

    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      getWindow()?.removeEventListener('beforeunload', beforeUnload);
    };
  }, [message, shouldWarn, killRouterEvent, router]);
};

export default useWarningOnExit;
