import React, { useState } from 'react';

// Supported Keys
const keys = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ENTER: 'Enter',
};

/**
 *
 * This hook can be used to add keyboard navigation to a list though up and donw arrows
 * @param {number} size length of list
 * @returns
 */
const useKeyboardNavigation = (size: number) => {
  const [cursor, setCursor] = useState(-1);
  const downHandler = ({ key }) => {
    if (key === keys.ARROW_DOWN) {
      if (size) {
        setCursor((prevState) =>
          prevState < size - 1 ? prevState + 1 : prevState
        );
      }
    }
    if (key === keys.ARROW_UP) {
      if (size) {
        setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
      }
    }
    if (key === keys.ENTER) {
      setCursor(-1);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  });

  return { cursor, setCursor };
};

export default useKeyboardNavigation;
