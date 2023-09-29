// TODO Add unit test

import * as React from 'react';

const onClickOutside =
  (ref: React.MutableRefObject<HTMLElement>, callback: () => void) =>
  (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

const useClickOutside = (
  ref: React.MutableRefObject<HTMLElement>,
  callback: () => void
): void => {
  React.useEffect(() => {
    const handler = onClickOutside(ref, callback);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  });
};

export default useClickOutside;
