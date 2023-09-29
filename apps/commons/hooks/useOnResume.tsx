import * as React from 'react';

let VISIBILITY_CHANGE = '';
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 や Firefox 18 以降でサポート
  VISIBILITY_CHANGE = 'visibilitychange';
} else if (typeof (document as any).msHidden !== 'undefined') {
  VISIBILITY_CHANGE = 'msvisibilitychange';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
  VISIBILITY_CHANGE = 'webkitvisibilitychange';
}

const useOnResume = (handler: () => void, loading = false) => {
  const [onLoading, setOnLoading] = React.useState(loading);
  const start = React.useCallback(() => {
    setOnLoading(false);
  }, [setOnLoading]);
  const stop = React.useCallback(() => {
    setOnLoading(true);
  }, [setOnLoading]);
  const $handler = React.useCallback(async () => {
    if (onLoading) {
      return;
    }
    setOnLoading(true);

    try {
      if (document.visibilityState === 'visible') {
        await handler();
      }
    } catch {}

    setOnLoading(false);
  }, [onLoading, handler]);

  React.useEffect(() => {
    document.addEventListener(VISIBILITY_CHANGE, $handler, false);
    return () => {
      document.removeEventListener(VISIBILITY_CHANGE, $handler);
    };
  }, [$handler]);

  return { start, stop, handler: $handler };
};

export default useOnResume;
