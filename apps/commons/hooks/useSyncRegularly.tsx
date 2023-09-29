import * as React from 'react';

import useInterval from './useInterval';
import useOnResume from './useOnResume';

const useSyncRegularly = (
  handler: () => Promise<void>,
  intervalTime: number,
  loading = false
) => {
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
      await handler();
    } catch {}

    setOnLoading(false);
  }, [onLoading, handler]);

  useOnResume($handler);
  useInterval($handler, intervalTime);

  return { start, stop, handler: $handler };
};

export default useSyncRegularly;
