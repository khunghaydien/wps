import { useRef } from 'react';

import { useId } from './index';

/**
 * Returns an unique key for React key.
 * @description The key is persistent for each instance.
 * @returns {string} an unique key
 */
const useKey = (): string => {
  const id = useId();
  const keyRef = useRef(id);

  return keyRef.current;
};

export default useKey;
