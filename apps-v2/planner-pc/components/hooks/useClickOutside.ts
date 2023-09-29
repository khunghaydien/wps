// TODO Add unit test

import * as React from 'react';

const onClickOutside =
  (ref: React.RefObject<HTMLElement>, callback: () => void) =>
  (event: MouseEvent): void => {
    // @ts-ignore
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
): void => {
  React.useEffect(() => {
    const handler = onClickOutside(ref, callback);
    document.addEventListener('mousedown', handler);
    return (): void => document.removeEventListener('mousedown', handler);
  });
};

export default useClickOutside;
