import { useMemo } from 'react';

import nanoid from 'nanoid';

export default (): string => {
  const SIZE = 8;
  return useMemo(() => nanoid(SIZE), []);
};
