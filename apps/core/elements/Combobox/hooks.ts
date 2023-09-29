import { useCallback, useLayoutEffect, useRef } from 'react';

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>();
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  useLayoutEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return ref;
};

export const useScrollIntoView = (triggered: boolean) => {
  const ref = useRef<HTMLLIElement>();
  useLayoutEffect(() => {
    if (ref && ref.current && triggered) {
      (ref.current.parentNode as Element).scrollTop = ref.current.offsetTop;
    }
  }, [triggered, ref]);

  return ref;
};
