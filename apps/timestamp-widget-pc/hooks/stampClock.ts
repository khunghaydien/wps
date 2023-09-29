import * as React from 'react';

export const useTickTimer = (): Date => {
  let clockTickTimer: number | null | undefined;
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const TICKING_INTERVAL = 500;
    setCurrentTime(new Date());

    clockTickTimer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, TICKING_INTERVAL);

    return () => {
      clearInterval(clockTickTimer);
    };
  }, []);

  return currentTime;
};

export const useLocale = (): string | null => {
  const [locale, setLocale] = React.useState(
    (window.empInfo && window.empInfo.language) || null
  );

  React.useEffect(() => {
    setLocale((window.empInfo && window.empInfo.language) || null);
  }, [locale]);

  return locale;
};
