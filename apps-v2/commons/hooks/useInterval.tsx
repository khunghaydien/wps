import * as React from 'react';

const useInterval = (handler: () => void, intervalTime: number) => {
  React.useEffect(() => {
    const timer = window.setInterval(handler, intervalTime);
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  });
};

export default useInterval;
