import * as React from 'react';

import ResizeObserver from 'resize-observer-polyfill';

type Rect = {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Option = {
  updateOnScroll: boolean;
};

const defaultOption: Option = {
  updateOnScroll: false,
};

const getRect = (element?: Element | null | undefined): Rect => {
  if (!element) {
    return {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  } else {
    return element.getBoundingClientRect();
  }
};

const observeWheel = (
  callback: () => void,
  element: Element,
  option: Option
): (() => void) => {
  if (!option.updateOnScroll) {
    return (): void => {};
  }

  element.addEventListener('wheel', callback, {
    passive: true,
    capture: true,
  });
  return (): void => {
    element.removeEventListener('wheel', callback);
  };
};

const observeResize = (
  callback: () => void,
  element: Element
): (() => void) => {
  let observer = new ResizeObserver(callback);
  observer.observe(element);
  observer.observe(window.document.body);

  return (): void => {
    if (observer) {
      observer.disconnect();

      // for GC
      observer = null;
    }
  };
};

const useRect = (
  ref: {
    current: React.ElementRef<React.ElementType>;
  },
  option: Option = defaultOption
): Rect => {
  const [rect, setRect] = React.useState(getRect());

  const updateRect = React.useCallback(() => {
    if (ref.current instanceof Element) {
      setRect(getRect(ref.current));
    }
  }, [ref.current]);

  React.useLayoutEffect(() => {
    if (!ref.current || !(ref.current instanceof Element)) {
      return;
    }

    const element = ref.current;
    updateRect();

    const unobserveWheel = observeWheel(
      updateRect,
      window.document.body,
      option
    );
    const unobserveResize = observeResize(updateRect, element);

    // eslint-disable-next-line consistent-return
    return (): void => {
      unobserveWheel();
      unobserveResize();
    };
  }, [ref.current, option.updateOnScroll]);

  return rect;
};

export default useRect;
