import * as React from 'react';

const useOutsideClick = (
  callback: () => void,
  refs: ReadonlyArray<{
    current: null | React.ElementRef<React.ElementType>;
  }>
): void => {
  const inputs = refs.map(({ current }) => current);
  const handleClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.target instanceof Node) {
        const target = e.target; // For Flow
        const isClickedOutside = refs.every(
          (ref) =>
            ref.current &&
            ref.current instanceof Node &&
            !ref.current.contains(target)
        );
        if (isClickedOutside) {
          callback();
        }
      }
    },
    [callback, ...inputs]
  );
  React.useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick, ...inputs]);
};

export default useOutsideClick;
